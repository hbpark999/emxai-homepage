"""Connects the real filter, the LISN and a noise source to the HFSS PCB model.

This is the step that turns the 14-port PCB extraction into a CE answer. The
PCB S-matrix is converted to Y, every component is stamped in as an admittance
between ports (all ports share the PE plane as reference, which is what makes
this legal), and the LISN's 50 ohm receiver voltage is solved for.

Why nodal admittance rather than an S-parameter cascade: the choke couples four
ports at once and the Y-stamp handles that in one 4x4 block, whereas cascading
would need an artificial port ordering. It also matches how LTspice will see it,
so netlist.py can emit an equivalent circuit that should agree.

Sign/reference conventions, fixed here and relied on downstream:
  * ports 1,2  = mains side  -> LISN, this is where the receiver measures
  * ports 3,4  = EUT side    -> noise source
  * every port's negative terminal is the PE plane
"""

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import config
from src.postprocess import read_touchstone

PORT = {name: num for num, name, _, _ in
        [(n, f"{ref}.{pad}", ref, pad) for n, _, ref, pad in config.PORT_SETS["full"]]}


def s_to_y(s, z0=50.0):
    """S -> Y for a multiport with a common reference. Y = (1/z0)(I+S)^-1 (I-S)."""
    n = s.shape[1]
    eye = np.eye(n)
    return np.stack([np.linalg.solve(eye + sk, eye - sk) / z0 for sk in s])


def z_cap(f, c, esr, esl):
    w = 2 * np.pi * f
    return esr + 1j * w * esl + 1 / (1j * w * c)


def stamp_shunt(y, port, adm):
    """Admittance from `port` to PE (the common reference)."""
    y[:, port - 1, port - 1] += adm


def stamp_series(y, pa, pb, adm):
    """Admittance between two ports."""
    a, b = pa - 1, pb - 1
    y[:, a, a] += adm
    y[:, b, b] += adm
    y[:, a, b] -= adm
    y[:, b, a] -= adm


def stamp_cmc(y, f, p_l_in, p_l_out, p_n_in, p_n_out):
    """Common-mode choke as a pair of coupled windings.

    ACM7060-701 is specified by its COMMON-mode inductance, so L + M = L_cm and
    the leakage L - M is what acts differentially. Solving those two gives the
    self and mutual terms. A parallel resistance across each winding stands in
    for core loss, without which the choke would show an unphysical, infinitely
    sharp resonance with the stray capacitance.
    """
    w = 2 * np.pi * f
    l_cm = config.CMC_L_CM
    l_dm = l_cm * config.CMC_L_DM_FRAC
    l_self = (l_cm + l_dm) / 2
    l_mut = (l_cm - l_dm) / 2

    # winding impedance matrix, then invert to admittance (2x2 per frequency)
    zw = np.empty((len(f), 2, 2), dtype=complex)
    zw[:, 0, 0] = zw[:, 1, 1] = 1j * w * l_self
    zw[:, 0, 1] = zw[:, 1, 0] = 1j * w * l_mut
    yw = np.linalg.inv(zw)
    yw[:, 0, 0] += 1 / config.CMC_RP  # core loss
    yw[:, 1, 1] += 1 / config.CMC_RP

    # map winding voltages (v_in - v_out) onto port nodes
    nodes = [p_l_in, p_l_out, p_n_in, p_n_out]
    a = np.array([[1, -1, 0, 0], [0, 0, 1, -1]], dtype=float)
    block = np.einsum("ji,fjk,kl->fil", a, yw, a)
    for i, pi in enumerate(nodes):
        for j, pj in enumerate(nodes):
            y[:, pi - 1, pj - 1] += block[:, i, j]


def lisn_admittance(f):
    """CISPR 16-1-2 V-network seen from the EUT terminal, and the fraction of
    that branch current which lands in the 50 ohm receiver.

    Two parallel paths to PE: the 0.1 uF + 50 ohm measuring branch, and the
    50 uH feed to the mains (taken as an AC short beyond the inductor).
    """
    w = 2 * np.pi * f
    z_meas = 1 / (1j * w * config.LISN_C) + config.LISN_RES
    z_feed = 1j * w * config.LISN_L
    return 1 / z_meas + 1 / z_feed, z_meas


def build_filter_network(f, s_pcb, with_filter=True):
    """PCB Y-matrix with the filter components and LISN stamped in.

    with_filter=False leaves the choke and capacitors out (the bare board plus
    LISN), which is the reference the filtered result is compared against.
    """
    y = s_to_y(s_pcb, config.PORT_IMPEDANCE).copy()

    if with_filter:
        stamp_series(y, 5, 6, 1 / z_cap(f, config.CX1_F, config.CX1_ESR, config.CX1_ESL))
        stamp_series(y, 7, 8, 1 / z_cap(f, config.CX2_F, config.CX2_ESR, config.CX2_ESL))
        stamp_shunt(y, 9, 1 / z_cap(f, config.CY_F, config.CY_ESR, config.CY_ESL))
        stamp_shunt(y, 10, 1 / z_cap(f, config.CY_F, config.CY_ESR, config.CY_ESL))
        stamp_cmc(y, f, 11, 12, 13, 14)
    else:
        # no choke: the line has to stay continuous or nothing reaches the LISN
        stamp_series(y, 11, 12, np.full_like(f, 1e6, dtype=complex))
        stamp_series(y, 13, 14, np.full_like(f, 1e6, dtype=complex))

    y_lisn, z_meas = lisn_admittance(f)
    stamp_shunt(y, 1, y_lisn)
    stamp_shunt(y, 2, y_lisn)
    return y, z_meas


def solve_lisn_voltage(f, s_pcb, i_cm, i_dm, with_filter=True, cm_shunt=True):
    """Receiver voltage on each LISN line, given noise currents at the EUT side.

    The source is injected as a current at ports 3 and 4: i_cm flows into both
    lines in phase (the switching-node-to-PE displacement current), i_dm flows
    into one and out of the other.

    cm_shunt adds the CM source's OWN admittance. The CM current is produced by
    a real capacitor between the switching node and the line, so its Norton
    equivalent is a current source in parallel with that capacitor -- omitting
    the parallel part treats the source as infinitely stiff and overstates how
    much of it survives to the LISN. This was found by cross-checking against
    LTspice, where the capacitor is present as a component and the transient
    answer differed by 5x; see reports/ltspice_vs_python.txt.
    """
    y, z_meas = build_filter_network(f, s_pcb, with_filter)
    if cm_shunt:
        half = 1j * 2 * np.pi * f * (config.SRC_CM_CPAR_F / 2)
        stamp_shunt(y, 3, half)
        stamp_shunt(y, 4, half)

    n = y.shape[1]
    i = np.zeros((len(f), n), dtype=complex)
    i[:, 2] = i_cm / 2 + i_dm / 2   # port 3, L_OUT
    i[:, 3] = i_cm / 2 - i_dm / 2   # port 4, N_OUT

    v = np.linalg.solve(y, i[:, :, None])[:, :, 0]

    # the receiver sees the voltage the terminal drives across its own branch
    v_l = v[:, 0] * config.LISN_RES / z_meas
    v_n = v[:, 1] * config.LISN_RES / z_meas
    return v_l, v_n


def dbuv(v):
    return 20 * np.log10(np.maximum(np.abs(v), 1e-18) / 1e-6)
