"""Emits an LTspice netlist that actually runs, and runs it.

The first attempt handed LTspice the Touchstone file directly
(`.model PCB S filename="...s14p"`). LTspice rejects that outright --
"Expected model definition here" -- because it has no Touchstone n-port device.
The S-parameters have to become lumped elements first, which src/pcb_lumped.py
does.

Node naming: PCB port k is node `pk`, and node 0 is the PE plane, matching how
the HFSS ports were built (all referenced to the plane).
"""

import re
import subprocess
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import config
from src import pcb_lumped

LTSPICE = Path(r"C:\Program Files\ADI\LTspice\LTspice.exe")
WORKDIR = config.DATA_DIR / "ltspice"


def build(case_id="B2", analysis="both", pcb_caps=True):
    """pcb_caps=False drops the sub-pF PCB capacitances.

    They matter to nothing below 30 MHz -- 0.9 pF is 5.9 kOhm at 30 MHz against
    a 50 Ohm LISN -- but together with the nH trace inductance they place
    resonances near 3 GHz, and LTspice then refuses to take timesteps large
    enough to reach the ~2 ms this circuit needs to settle. A first attempt with
    them in covered 50 us of a 10 ms run in 60 seconds. They stay in for .ac,
    where they cost nothing.
    """
    m = pcb_lumped.extract(case_id)
    nets = m["nets"]

    l_cm, l_dm = config.CMC_L_CM, config.CMC_L_CM * config.CMC_L_DM_FRAC
    l_self = (l_cm + l_dm) / 2
    k_cmc = (l_cm - l_dm) / 2 / l_self

    n = [
        f"* CE EMI filter, case {case_id}: {config.CASES[case_id]['label']}",
        "* PCB = lumped reduction of the HFSS 14-port extraction (src/pcb_lumped.py).",
        "* Nodes p1..p14 are the HFSS ports; node 0 is the PE plane.",
        "* Ports: 1,2 = mains/LISN side   3,4 = EUT side   5..14 = component pads",
        "",
        "* ---------------- PCB: trace loop inductance (trace + PE return) ----",
    ]
    for k, (p, q) in enumerate(m["branches"]):
        r, l = m["rl"][(p, q)]
        n.append(f"L{k + 1} p{p} n{k + 1} {l:.6e}")
        n.append(f"R{k + 1} n{k + 1} p{q} {r:.6e}    ; {nets[p]}")

    cm = m["C"]
    if pcb_caps:
        n.append("")
        n.append("* ---------------- PCB: capacitance to the PE plane ------------------")
        for i in range(m["n"]):
            c_gnd = cm[i].sum()
            if c_gnd > 0:
                n.append(f"Cg{i + 1} p{i + 1} 0 {c_gnd:.6e}   ; {nets[i + 1]}")
        n.append("* ---------------- PCB: net-to-net coupling --------------------------")
        for i in range(m["n"]):
            for j in range(i + 1, m["n"]):
                if cm[i, j] < -1e-18:
                    n.append(f"Cc{i + 1}_{j + 1} p{i + 1} p{j + 1} {-cm[i, j]:.6e}")
    else:
        n.append("")
        n.append("* PCB capacitances omitted for the transient run -- see build() docstring")

    n += [
        "",
        "* ---------------- filter components ---------------------------------",
        f"CX1 p5 nx1 {config.CX1_F:.6e}",
        f"RX1 nx1 mx1 {config.CX1_ESR:g}",
        f"LX1 mx1 p6 {config.CX1_ESL:.6e}",
        f"CX2 p7 nx2 {config.CX2_F:.6e}",
        f"RX2 nx2 mx2 {config.CX2_ESR:g}",
        f"LX2 mx2 p8 {config.CX2_ESL:.6e}",
        f"CY1 p9 ny1 {config.CY_F:.6e}",
        f"RY1 ny1 my1 {config.CY_ESR:g}",
        f"LY1 my1 0 {config.CY_ESL:.6e}",
        f"CY2 p10 ny2 {config.CY_F:.6e}",
        f"RY2 ny2 my2 {config.CY_ESR:g}",
        f"LY2 my2 0 {config.CY_ESL:.6e}",
        "* common-mode choke: two coupled windings, specified by its CM inductance",
        f"LCM1 p11 p12 {l_self:.6e} Rpar={config.CMC_RP:g}",
        f"LCM2 p13 p14 {l_self:.6e} Rpar={config.CMC_RP:g}",
        f"K1 LCM1 LCM2 {k_cmc:.6f}",
        "",
        "* ---------------- LISN, both lines (CISPR 16-1-2) -------------------",
    ]
    for node, tag in (("p1", "L"), ("p2", "N")):
        n += [
            f"L{tag}F {node} 0 {config.LISN_L:.6e}",
            f"C{tag}M {node} m{tag} {config.LISN_C:.6e}",
            f"R{tag}M m{tag} 0 {config.LISN_RES:g}",
        ]

    # The Python solve injects noise as CURRENTS at ports 3 and 4, so the
    # netlist must do the same or the two are not comparable: a voltage source
    # would also impose the source impedance and change the answer.
    n += [
        "",
        "* ---------------- noise source: currents into ports 3 and 4 ---------",
        "* matches src/circuit.solve_lisn_voltage: i_cm splits evenly in phase,",
        "* i_dm flows into L and out of N.",
    ]
    if analysis in ("ac", "both"):
        n += [
            "* AC: unit CM and DM excitation, scaled in post-processing",
            "Icm3 0 p3 AC 0.5",
            "Icm4 0 p4 AC 0.5",
        ]
    if analysis in ("tran", "both"):
        tr = config.SRC_TRISE_S
        per = 1.0 / config.SRC_FSW_HZ
        n += [
            "* TRAN: the same trapezoidal switching node driving both paths.",
            "* The split has to mirror the Python injection exactly or the two",
            "* are not comparable: CM is HALF the parasitic capacitance into each",
            "* line (so the pair carries the full C*dV/dt, in phase), and DM is a",
            "* current pushed into p3 and pulled out of p4 by one floating source.",
            f"Vsw sw 0 PULSE(0 {config.SRC_VPP:g} 0 {tr:g} {tr:g} "
            f"{config.SRC_DUTY * per:g} {per:g})",
            f"Ccm3 sw p3 {config.SRC_CM_CPAR_F / 2:.6e}",
            f"Ccm4 sw p4 {config.SRC_CM_CPAR_F / 2:.6e}",
            # The DC term is removed: a DC-carrying DM source injects direct
            # current into the line, which is not noise and which Python's
            # harmonic series (n>=1) does not contain.
            #
            # The constant must be the TRAPEZOID's mean, not the rectangle's.
            # LTspice PULSE holds V2 for Ton and spends Trise+Tfall on the
            # edges, so the area per period is A*(Ton + Trise) and the mean is
            # A*(duty + Trise*fsw) = 176.8 V, not A*duty = 175 V. Subtracting
            # 175 left 1.8 V, i.e. 90 mA of DC into the line, and the LISN
            # capacitors charged on it -- the waveform's mean wandered between
            # -1.6 V and +2.6 V and never settled, while its Vpp was already
            # correct.
            f"Bdm p4 p3 I=0.5*(V(sw)-"
            f"{config.SRC_VPP * (config.SRC_DUTY + config.SRC_TRISE_S * config.SRC_FSW_HZ):.6g})"
            f"/{config.SRC_DM_Z:g}",
        ]

    n += ["", "* ---------------- analyses ------------------------------------------"]
    if analysis in ("ac", "both"):
        n.append(".ac dec 100 150k 30Meg")
    if analysis in ("tran", "both"):
        # Cx1 is 4.7 uF against the LISN's two 50 ohm branches in series, so the
        # differential settling constant is ~470 us. Saving from 200 us, as a
        # first attempt did, captures the start-up transient rather than the
        # steady state and inflates every harmonic. Run 20 tau, keep the last
        # few switching periods.
        # LTspice ignored the Tstart argument here and stopped early whatever
        # was asked for, so the run simply starts at 0 and the settled tail is
        # selected in post-processing after checking it is periodic.
        n.append(f".tran 0 {config.TRAN_STOP_S:g} 0 5n")
        n.append(".options plotwinsize=0")
    n += [".save V(mL) V(mN) V(p1) V(p2) V(p3)", ".end", ""]
    return "\n".join(n)


def run(case_id="B2", analysis="ac"):
    WORKDIR.mkdir(parents=True, exist_ok=True)
    cir = WORKDIR / f"case{case_id}_{analysis}.cir"
    cir.write_text(build(case_id, analysis), encoding="utf-8")

    raw = cir.with_suffix(".raw")
    log = cir.with_suffix(".log")
    for p in (raw, log):
        p.unlink(missing_ok=True)

    proc = subprocess.run([str(LTSPICE), "-b", "-Run", str(cir)],
                          capture_output=True, text=True, timeout=1800)
    log_txt = log.read_text(encoding="latin-1") if log.exists() else ""
    if not raw.exists():
        raise RuntimeError(f"LTspice produced no .raw (rc={proc.returncode})\n{log_txt[-2000:]}")
    return raw, log_txt


# --------------------------------------------------------------- raw reader
def read_raw(path):
    """Minimal LTspice binary .raw reader (AC and transient).

    Written rather than pulled in as a dependency because the format is small
    and stable, and because a wrong reader would silently produce a plausible
    but wrong comparison, which is the one failure mode this whole exercise is
    meant to catch.
    """
    data = Path(path).read_bytes()
    # LTspice writes the header in UTF-16LE, so the ASCII marker is not present
    # as plain bytes; try the wide form first and fall back to ASCII.
    for marker, enc in ((b"B\x00i\x00n\x00a\x00r\x00y\x00:\x00\n\x00", "utf-16-le"),
                        (b"Binary:\n", "latin-1")):
        split = data.find(marker)
        if split >= 0:
            header = data[:split].decode(enc, errors="ignore")
            body = data[split + len(marker):]
            break
    else:
        raise ValueError("not a binary LTspice raw file")

    n_vars = int(re.search(r"No\. Variables:\s*(\d+)", header).group(1))
    n_pts = int(re.search(r"No\. Points:\s*(\d+)", header).group(1))
    flags = re.search(r"Flags:\s*(.*)", header).group(1).lower()
    complex_data = "complex" in flags

    names = []
    # split on the newline-anchored form: the header also contains
    # "No. Variables:", and splitting on the bare word lands in the wrong chunk
    for line in header.split("\nVariables:")[1].splitlines()[1:]:
        parts = line.split()
        if len(parts) >= 2 and parts[0].isdigit():
            names.append(parts[1])
        if len(names) == n_vars:
            break

    if complex_data:
        arr = np.frombuffer(body, dtype=np.complex128, count=n_pts * n_vars)
        arr = arr.reshape(n_pts, n_vars).T
    else:
        # transient: time is float64, the rest float32
        rec = np.dtype([("t", "<f8")] + [(f"v{i}", "<f4") for i in range(n_vars - 1)])
        raw = np.frombuffer(body, dtype=rec, count=n_pts)
        arr = np.vstack([raw["t"]] + [raw[f"v{i}"] for i in range(n_vars - 1)])
    return names, arr


if __name__ == "__main__":
    case = sys.argv[1] if len(sys.argv) > 1 else "B2"
    for an in ("ac", "tran"):
        print(f"running LTspice {an} for case {case} ...")
        raw, log = run(case, an)
        names, arr = read_raw(raw)
        print(f"  {raw.name}: {len(names)} vars, {arr.shape[1]} points")
        print(f"  vars: {', '.join(names[:8])}{' ...' if len(names) > 8 else ''}")
