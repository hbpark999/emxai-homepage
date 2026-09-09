"""Mixed-mode conversion and case comparison.

The 4-port HFSS result is single-ended (L_IN, N_IN, L_OUT, N_OUT, all
referenced to the PE plane). CE margins are decided in CM/DM terms, so the
S-matrix is converted here rather than in HFSS: the Terminal solution type
that would give mixed-mode directly crashes AEDT 2026.1, which is why
CE_plan.md 12.3 routes the conversion through Python instead.

Port pairing follows config.PORTS: (1,2) = L_IN/N_IN is the input side,
(3,4) = L_OUT/N_OUT the output side.

No scikit-rf dependency -- the transform is one 4x4 matrix and writing it out
makes the port convention auditable, which matters more here than reusing a
library.
"""

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import config


def read_touchstone(path):
    """Minimal Touchstone reader for the N-port files written by hfss_ce_model.

    Assumes the '# Hz S RI R 50' header this project writes; it is not a
    general-purpose reader.
    """
    freqs, rows = [], []
    n = None
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.split("!")[0].strip()
            if not line:
                continue
            if line.startswith("#"):
                parts = line.split()
                if parts[1].lower() != "hz" or parts[3].upper() != "RI":
                    raise ValueError(f"unexpected Touchstone header: {line}")
                continue
            vals = [float(v) for v in line.split()]
            if len(vals) % 2 == 1:  # odd count -> this line starts a frequency block
                freqs.append(vals[0])
                vals = vals[1:]
                rows.append([])
            pairs = [complex(vals[i], vals[i + 1]) for i in range(0, len(vals), 2)]
            rows[-1].extend(pairs)
            n = n or len(pairs)

    s = np.array(rows, dtype=complex).reshape(len(freqs), n, n)
    return np.array(freqs), s


def to_mixed_mode(s):
    """Single-ended 4-port -> mixed-mode, with pairs (1,2) and (3,4).

    Returns Sdd, Sdc, Scd, Scc, each (nfreq, 2, 2). Sdd[:,1,0] is the
    differential through path, Scc[:,1,0] the common-mode one, and Scd[:,1,0]
    is the mode conversion the PE slot is expected to create.
    """
    r = 1 / np.sqrt(2)
    # rows: d1, d2, c1, c2 ; cols: se ports 1..4
    m = r * np.array([
        [1, -1, 0, 0],
        [0, 0, 1, -1],
        [1, 1, 0, 0],
        [0, 0, 1, 1],
    ], dtype=float)

    smm = np.einsum("ij,fjk,lk->fil", m, s, m)
    return smm[:, :2, :2], smm[:, :2, 2:], smm[:, 2:, :2], smm[:, 2:, 2:]


def db(x):
    return 20 * np.log10(np.maximum(np.abs(x), 1e-15))


def load_case(case_id):
    path = config.TOUCHSTONE_DIR / f"case{case_id}.s4p"
    if not path.exists():
        return None
    f, s = read_touchstone(path)
    sdd, sdc, scd, scc = to_mixed_mode(s)
    return {
        "case": case_id,
        "label": config.CASES[case_id]["label"],
        "freq_hz": f,
        "s": s,
        "dm_il_db": -db(sdd[:, 1, 0]),   # positive dB = attenuation
        "cm_il_db": -db(scc[:, 1, 0]),
        "cd_conv_db": db(scd[:, 1, 0]),  # DM in -> CM out, at the far side
        "dc_conv_db": db(sdc[:, 1, 0]),
    }


def verify_results(res):
    """Physical sanity checks before any of this is shown to a customer.

    The through-path check is also what confirms the geometry was electrically
    continuous: with the choke bridged by a PEC strip, the low-frequency
    insertion loss of the PCB alone must be near 0 dB. A broken track or a
    disjoint unite would show up here as tens of dB.
    """
    out = []
    f = res["freq_hz"]
    lo = int(np.argmin(np.abs(f - config.TRUST_FLOOR_MHZ * 1e6)))

    dm_lo = res["dm_il_db"][lo]
    ok = abs(dm_lo) < 3.0
    out.append((ok, f"DM through at {f[lo] / 1e3:.0f} kHz = {dm_lo:+.2f} dB "
                    f"(bridged PCB should be ~0 dB){'' if ok else '  <-- check continuity'}"))

    passive = np.all(np.abs(res["s"]) < 1.05)
    out.append((passive, f"passivity: max |S| = {np.abs(res['s']).max():.3f}"))

    below = f < config.TRUST_FLOOR_MHZ * 1e6
    if below.any():
        out.append((True, f"{below.sum()} points below {config.TRUST_FLOOR_MHZ * 1e3:.0f} kHz "
                          f"are reported but outside the trusted band (CE_plan.md 3.3)"))
    return out


def compare(case_ids=("B", "C", "D")):
    cases = [c for c in (load_case(cid) for cid in case_ids) if c]
    if not cases:
        raise SystemExit("no solved cases found -- run src/run_case.py first")

    lines = []
    for res in cases:
        lines.append(f"\n=== Case {res['case']}: {res['label']} ===")
        for ok, msg in verify_results(res):
            lines.append(f"  [{'ok' if ok else '!!'}] {msg}")

    marks = [150e3, 500e3, 1e6, 5e6, 10e6, 30e6]
    lines.append("\n\nCM insertion loss of the PCB alone [dB, positive = attenuation]")
    header = f"{'freq':>10}" + "".join(f"{'case ' + c['case']:>10}" for c in cases)
    lines.append(header)
    for t in marks:
        row = f"{t / 1e6:>8.2f}M"
        for c in cases:
            i = int(np.argmin(np.abs(c["freq_hz"] - t)))
            row += f"{c['cm_il_db'][i]:>10.2f}"
        lines.append(row)

    if len(cases) > 1:
        lines.append("\nDM->CM mode conversion Scd21 [dB, higher = more conversion]")
        lines.append(header)
        for t in marks:
            row = f"{t / 1e6:>8.2f}M"
            for c in cases:
                i = int(np.argmin(np.abs(c["freq_hz"] - t)))
                row += f"{c['cd_conv_db'][i]:>10.2f}"
            lines.append(row)

        base = cases[0]
        for other in cases[1:]:
            lines.append(f"\nCase {other['case']} minus case {base['case']} "
                         f"(positive = {other['case']} attenuates more)")
            lines.append(f"{'freq':>10}{'dCM':>10}{'dDM':>10}{'dScd':>10}")
            for t in marks:
                i = int(np.argmin(np.abs(base["freq_hz"] - t)))
                j = int(np.argmin(np.abs(other["freq_hz"] - t)))
                lines.append(
                    f"{t / 1e6:>8.2f}M"
                    f"{other['cm_il_db'][j] - base['cm_il_db'][i]:>10.2f}"
                    f"{other['dm_il_db'][j] - base['dm_il_db'][i]:>10.2f}"
                    f"{other['cd_conv_db'][j] - base['cd_conv_db'][i]:>10.2f}"
                )
    return cases, "\n".join(lines)


# EN 55011 / CISPR 11 Class B conducted quasi-peak limit, mains port.
# 150-500 kHz falls linearly 66 -> 56 dBuV with log frequency.
def class_b_limit_dbuv(f):
    f = np.asarray(f, dtype=float)
    lim = np.full_like(f, np.nan)
    band1 = (f >= 150e3) & (f < 500e3)
    lim[band1] = 66 - 10 * np.log10(f[band1] / 150e3) / np.log10(500e3 / 150e3)
    lim[(f >= 500e3) & (f < 5e6)] = 56.0
    lim[(f >= 5e6) & (f <= 30e6)] = 60.0
    return lim


def ce_impact(cases, dm_source_dbuv=120.0):
    """First-order CE margin driven by mode conversion in the PCB.

    The PCB alone does not attenuate -- cases B/C/D all show ~0 dB insertion
    loss, because with the choke bridged the board is just copper. What the
    layout changes is how much DIFFERENTIAL noise it turns into COMMON-mode
    noise, and CM is what the LISN sees against PE. So the quantity that
    actually decides a CE result here is

        CM at LISN [dBuV] = DM source [dBuV] + Scd21 [dB]

    dm_source_dbuv is a stand-in for a measured or assumed converter noise
    level; only the DIFFERENCE between cases is a simulation result, the
    absolute margin scales one-for-one with whatever source level is used.
    This is a screening estimate, not a compliance prediction: it ignores the
    filter's own CM attenuation acting on the converted product, which is what
    the full component-terminal port model in stage 2 would capture.
    """
    lines = ["\n\nCE screening: CM at LISN from PCB mode conversion",
             f"(assumed DM source {dm_source_dbuv:.0f} dBuV, flat; "
             "only case-to-case differences are simulation output)",
             f"{'freq':>10}{'limit':>8}" + "".join(f"{'case ' + c['case']:>12}" for c in cases)]
    for t in (150e3, 500e3, 1e6, 5e6, 10e6, 30e6):
        lim = float(class_b_limit_dbuv([t])[0])
        row = f"{t / 1e6:>8.2f}M{lim:>8.1f}"
        for c in cases:
            i = int(np.argmin(np.abs(c["freq_hz"] - t)))
            emission = dm_source_dbuv + c["cd_conv_db"][i]
            row += f"{emission:>7.1f}({emission - lim:+5.1f})"
        lines.append(row)
    lines.append("  value = emission dBuV, (margin vs Class B limit; negative = passes)")
    return "\n".join(lines)


def plot(cases, path=None):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    from src import case_a_ideal

    path = path or (config.CHART_DIR / "case_comparison.png")
    ideal = case_a_ideal.run()

    fig, axes = plt.subplots(1, 3, figsize=(16, 4.8))
    for ax, key, title in (
        (axes[0], "cm_il_db", "CM insertion loss"),
        (axes[1], "dm_il_db", "DM insertion loss"),
        (axes[2], "cd_conv_db", "DM->CM conversion (Scd21)"),
    ):
        if key != "cd_conv_db":
            ax.semilogx(ideal["freq_hz"], ideal["cm_il_db" if key == "cm_il_db" else "dm_il_db"],
                        "k--", lw=1.2, label="Case A ideal filter")
        for c in cases:
            ax.semilogx(c["freq_hz"], c[key], lw=1.4, label=f"Case {c['case']}")
        ax.axvspan(1e4, config.TRUST_FLOOR_MHZ * 1e6, color="0.9", zorder=0)
        ax.axvline(150e3, color="0.6", ls=":", lw=1)
        ax.axvline(30e6, color="0.6", ls=":", lw=1)
        ax.set_title(title)
        ax.set_xlabel("Frequency [Hz]")
        ax.set_ylabel("dB")
        ax.grid(True, which="both", alpha=0.3)
        ax.legend(fontsize=8)
    axes[0].text(1.1e4, axes[0].get_ylim()[1] * 0.92, "below trusted band", fontsize=7, color="0.4")
    fig.suptitle("CE EMI filter: PCB return-path effect (shaded = outside HFSS trusted band; "
                 "dotted = CE band 150 kHz - 30 MHz)", fontsize=10)
    fig.tight_layout()
    fig.savefig(path, dpi=140)
    return path


if __name__ == "__main__":
    cases, report = compare()
    report += ce_impact(cases)
    print(report)
    p = plot(cases)
    print(f"\nchart -> {p}")
    (config.REPORTS_DIR / "comparison.txt").write_text(report, encoding="utf-8")
