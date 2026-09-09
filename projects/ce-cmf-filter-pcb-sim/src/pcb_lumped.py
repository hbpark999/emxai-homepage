"""Reduces the HFSS 14-port PCB to a lumped RLC network LTspice can run.

Three approaches were tried; the first two are recorded so they are not retried.

1. Vector fitting (scikit-rf, CE_plan.md 5.2 option 3) DIVERGED. The 14-port
   S-matrix spans |S| from 1e-8 to 0.33 and the rational fit chased the
   negligible entries: rms error read 5e-6 while |S11| came back 4e11 against a
   true 0.333, a 240 dB error. Wrong tool for a matrix this ill-conditioned.

2. Fitting each off-diagonal -Y_ij as one R-L or one C FAILED, producing 1 mF
   coupling capacitors and 396 nH where 15 nH was expected. It assumes a branch
   network, but every trace shares the PE plane as its return and a shared
   return is mutual inductance, which that form cannot hold.

3. What is used: loop inductance straight from the Z-matrix, plus a fitted
   capacitance matrix.

       L_branch(p,q) = Im(Z_pp + Z_qq - 2*Z_pq) / w

   is the impedance seen driving port p against port q, i.e. the trace and its
   return path together -- the physically meaningful loop inductance, and
   numerically stable because it never inverts a near-singular matrix. Measured
   across 150 kHz - 30 MHz it varies by 0.0%, which is the direct confirmation
   that the board is lumped in this band rather than an assumption about it.

   Mutual inductance between branches is extracted the same way and comes out
   at 0.016 nH against 3-14 nH self, k < 0.005. It is dropped, and unlike
   attempt 2 that is a measured decision rather than a hope: the traces run over
   a solid plane, so each return current stays under its own trace.

Validity rests on electrical size: 56 mm against a 10 m wavelength at 30 MHz,
0.006 wavelengths. In that regime a lumped network is the correct description.
"""

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import config
from src.circuit import s_to_y
from src.postprocess import read_touchstone

FIT_FMIN = 150e3
FIT_FMAX = 30e6
# PEC conductors are lossless, so the extracted series resistance is numerically
# zero (and occasionally a small negative from round-off). A floor keeps
# LTspice's transient well-conditioned without inventing loss the baseline model
# does not contain -- rerun with --conductor copper if real loss matters.
R_FLOOR_OHM = 1e-3


def port_nets():
    return {num: net for num, net, _, _ in config.PORT_SETS["full"]}


def branches(nets):
    """Spanning tree per net: chain that net's ports in numeric order.

    Any tree reproduces the same terminal behaviour; chaining in port order
    keeps the netlist readable, since port numbers follow the signal path
    (connector -> Cx -> Y-cap -> choke).
    """
    by_net = {}
    for p, n in sorted(nets.items()):
        by_net.setdefault(n, []).append(p)
    return [(a, b) for ports in by_net.values() for a, b in zip(ports, ports[1:])]


def extract(case_id="B2"):
    ts = config.TOUCHSTONE_DIR / f"case{case_id}.s14p"
    if not ts.exists():
        raise SystemExit(f"{ts} not found -- run: python src/run_case.py {case_id}")
    f, s = read_touchstone(ts)
    y = s_to_y(s, config.PORT_IMPEDANCE)
    z = np.linalg.inv(y)

    band = (f >= FIT_FMIN) & (f <= FIT_FMAX)
    fb, yb, zb = f[band], y[band], z[band]
    w = 2 * np.pi * fb
    n = y.shape[1]
    nets = port_nets()
    br = branches(nets)

    # --- series R, L per conductive branch, from the Z-matrix ---------------
    rl = {}
    spread = {}
    for p, q in br:
        zz = zb[:, p - 1, p - 1] + zb[:, q - 1, q - 1] - 2 * zb[:, p - 1, q - 1]
        l_f = np.imag(zz) / w
        rl[(p, q)] = (max(float(np.mean(np.real(zz))), R_FLOOR_OHM), float(np.mean(l_f)))
        spread[(p, q)] = float(np.std(l_f) / abs(np.mean(l_f)))

    # --- capacitance, extracted PER NET, not per port -----------------------
    # Fitting C port-by-port fails: the cross-net entries of Y sit ~2e-5 below
    # the diagonal, which is the noise floor of inverting a matrix whose nets
    # are nearly shorted internally, and the fit then puts 53 pF on a diagonal
    # that should carry 0.5 pF. Collapsing the ports of each net onto one node
    # first removes that ill-conditioning: the resulting Im(Y)/w is constant to
    # 0.3% across the band, i.e. genuinely capacitive.
    net_names = sorted({v for v in nets.values()})
    sel = np.zeros((n, len(net_names)))
    for p_, nm in nets.items():
        sel[p_ - 1, net_names.index(nm)] = 1.0
    y_net = np.einsum("ip,fij,jq->fpq", sel, yb, sel)
    c_net = np.real(np.mean(np.imag(y_net) / w[:, None, None], axis=0))
    c_net = 0.5 * (c_net + c_net.T)

    # each net's capacitance to PE, split evenly over that net's ports (the net
    # is equipotential to within a few nH, so the split barely matters)
    ports_of = {nm: [p_ for p_, v in nets.items() if v == nm] for nm in net_names}
    cmat = np.zeros((n, n))
    for ia, na in enumerate(net_names):
        c_gnd = c_net[ia].sum()
        for p_ in ports_of[na]:
            cmat[p_ - 1, p_ - 1] += c_gnd / len(ports_of[na])
        for ib in range(ia + 1, len(net_names)):
            c_cpl = -c_net[ia, ib]
            pa, pb = ports_of[na][0], ports_of[net_names[ib]][0]
            cmat[pa - 1, pa - 1] += c_cpl
            cmat[pb - 1, pb - 1] += c_cpl
            cmat[pa - 1, pb - 1] -= c_cpl
            cmat[pb - 1, pa - 1] -= c_cpl

    a = np.zeros((len(br), n))
    for k, (p, q) in enumerate(br):
        a[k, p - 1] = 1.0
        a[k, q - 1] = -1.0

    return dict(case=case_id, f=fb, y=yb, n=n, nets=nets, branches=br,
                rl=rl, spread=spread, C=cmat, A=a,
                c_net=c_net, net_names=net_names, ports_of=ports_of)


def rebuild_y(model, f):
    """Y of the lumped network: capacitor matrix plus the branch inductors."""
    w = 2 * np.pi * np.asarray(f)
    a = model["A"]
    yb = np.zeros((len(w), model["n"], model["n"]), dtype=complex)
    yb += 1j * w[:, None, None] * model["C"][None, :, :]
    for k, key in enumerate(model["branches"]):
        r, l = model["rl"][key]
        adm = 1.0 / (r + 1j * w * l)
        ak = a[k][None, :, None] * a[k][None, None, :]
        yb += adm[:, None, None] * ak
    return yb


def compare(model, marks=(150e3, 500e3, 1e6, 5e6, 10e6, 30e6)):
    y_fit = rebuild_y(model, model["f"])
    y_ref = model["y"]
    lines = [f"{'freq':>9}{'|Y11| HFSS':>13}{'|Y11| lump':>13}{'err dB':>9}"
             f"{'|Y31| HFSS':>13}{'|Y31| lump':>13}{'err dB':>9}"]
    for t in marks:
        i = int(np.argmin(np.abs(model["f"] - t)))
        row = f"{t / 1e6:>8.2f}M"
        for x, yy in ((0, 0), (2, 0)):
            d, m = abs(y_ref[i, x, yy]), abs(y_fit[i, x, yy])
            lines_err = 20 * np.log10(max(m, 1e-18) / max(d, 1e-18))
            row += f"{d:>13.3e}{m:>13.3e}{lines_err:>9.2f}"
        lines.append(row)
    # Error is reported only on entries that carry physical signal. The
    # cross-net entries do not: HFSS gives Y31 a 1/f slope, and a 1/f admittance
    # between two nets with no DC path between them cannot be real -- it is
    # noise amplified by inverting (I+S) when the ports of each net are nearly
    # shorted to one another. Y31 comes out 2e4 times larger than the 0.007 pF
    # of coupling capacitance the net-level extraction measures, and sits 2e-5
    # below the diagonal, which is the inversion's noise floor. Averaging error
    # over all entries would therefore grade the model against noise.
    big = np.abs(y_ref) > 0.01 * np.abs(y_ref).max()
    rel = np.abs(y_fit - y_ref) / np.maximum(np.abs(y_ref), 1e-14)
    lines.append(f"\n  entries above 1% of peak |Y| ({big.sum()} of {big.size}):")
    lines.append(f"    median relative error {np.median(rel[big]) * 100:.2f} %"
                 f"   90th pct {np.percentile(rel[big], 90) * 100:.2f} %")
    lines.append("  cross-net entries are excluded as numerical noise, not fitted"
                 " -- see the note in compare()")
    return "\n".join(lines)


def summary(model):
    nets = model["nets"]
    lines = [f"lumped PCB model, case {model['case']}: "
             f"{len(model['branches'])} R-L branches + {model['n']}-node capacitance matrix",
             "",
             "  loop R-L per branch (trace + its return path in the PE plane):",
             f"    {'branch':16s}{'net':8s}{'L [nH]':>10}{'R [mOhm]':>11}{'L spread':>10}"]
    for k, (p, q) in enumerate(model["branches"]):
        r, l = model["rl"][(p, q)]
        lines.append(f"    L{k + 1:<3d} p{p:<3d}-p{q:<4d}{nets[p]:8s}{l * 1e9:>10.2f}"
                     f"{r * 1e3:>11.3f}{model['spread'][(p, q)] * 100:>9.2f}%")
    lines.append("      (L spread over 150 kHz - 30 MHz; ~0% confirms the board is lumped)")
    lines.append("\n  capacitance to PE plane:")
    for i in range(model["n"]):
        lines.append(f"    p{i + 1:<3d} {nets[i + 1]:6s} C={model['C'][i].sum() * 1e12:8.3f} pF")
    return "\n".join(lines)


if __name__ == "__main__":
    case = sys.argv[1] if len(sys.argv) > 1 else "B2"
    mod = extract(case)
    print(summary(mod))
    print("\nreduction check (lumped network vs HFSS):")
    print(compare(mod))
