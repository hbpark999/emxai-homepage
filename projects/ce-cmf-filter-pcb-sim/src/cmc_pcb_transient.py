"""Virtual switching waveform check for the selected CMC and reduced PCB."""
import json
import subprocess
from pathlib import Path

import numpy as np

import config
from mvp.cmc_surrogate_gui import LTSPICE, pcb_circuit_text, spice_text
from src.netlist import read_raw


def run_transient(zcm, zdm, folder, method='trap', stop_s=None):
    stop_s = config.TRAN_STOP_S if stop_s is None else float(stop_s)
    if not 0 < stop_s <= .1:
        raise ValueError('Transient duration must be within 0 to 100 ms')
    if method not in ('trap', 'gear'):
        raise ValueError('Unsupported integration method')
    folder = Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    library = folder / 'selected.lib'
    library.write_text(spice_text(zcm, zdm), encoding='utf-8')
    circuit = pcb_circuit_text(library, 'tran')
    circuit = circuit.replace('.save V(mL)', '.save V(sw) V(mL)')
    circuit = circuit.replace(f'.tran 0 {config.TRAN_STOP_S:g} 0 5n', f'.tran 0 {stop_s:g} 0 5n')
    circuit = circuit.replace('.options plotwinsize=0', f'.options plotwinsize=0 method={method}')
    path = folder / 'selected_transient.cir'
    path.write_text(circuit, encoding='utf-8')
    raw = path.with_suffix('.raw')
    raw.unlink(missing_ok=True)
    result = subprocess.run([str(LTSPICE), '-b', '-Run', str(path)], timeout=1800)
    if result.returncode or not raw.exists():
        raise RuntimeError(f'LTspice transient failed: {path}')
    names, values = read_raw(raw)
    lookup = {name.lower(): i for i, name in enumerate(names)}
    arrays = {'time_s': values[0].real}
    for key, name in [('source_v', 'v(sw)'), ('line_v', 'v(ml)'), ('neutral_v', 'v(mn)')]:
        arrays[key] = values[lookup[name]].real
    t = arrays['time_s']
    if not all(np.isfinite(a).all() for a in arrays.values()):
        raise ValueError('Non-finite transient data')
    if len(t) < 2 or np.any(np.diff(t) < 0) or t[-1] < stop_s * .999:
        raise ValueError('Incomplete transient time span')
    period = 1 / config.SRC_FSW_HZ
    grid = np.linspace(t[-1] - period, t[-1], 1001)
    periodicity = {}
    for key in ['line_v', 'neutral_v']:
        last = np.interp(grid, t, arrays[key])
        previous = np.interp(grid - period, t, arrays[key])
        periodicity[key] = float(np.sqrt(np.mean((last - previous)**2)) /
                                 max(np.sqrt(np.mean(last**2)), 1e-12))
    np.savez_compressed(folder / 'transient.npz', **arrays)
    manifest = dict(status='solver_complete_accuracy_pending', method=method,
        periodicity_screen_passed=all(v < .01 for v in periodicity.values()),
        points=len(t), stop_s=float(t[-1]),
        source=dict(frequency_hz=config.SRC_FSW_HZ, voltage_v=config.SRC_VPP,
                    duty=config.SRC_DUTY, rise_s=config.SRC_TRISE_S),
        last_period_relative_rms_difference=periodicity,
        limitations=['CMC uses magnitude-derived inductances at 150 kHz',
                     'PCB capacitances omitted for transient solver conditioning',
                     'Virtual source; no EMI receiver detector or compliance claim'])
    (folder / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    return arrays, manifest


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--method', choices=['trap', 'gear'], default='trap')
    parser.add_argument('--stop-ms', type=float, default=4)
    args = parser.parse_args()
    from mvp.cmc_surrogate_gui import load_artifacts, predict_curves
    artifact, _ = load_artifacts()
    z = predict_curves(artifact, np.array([[8, 20, 32, 8, .8, 3]]))
    _, manifest = run_transient(*z, Path(__file__).resolve().parents[1] /
                               f'mvp/generated/pcb_transient_{args.method}_{args.stop_ms:g}ms',
                               method=args.method, stop_s=args.stop_ms / 1000)
    print(json.dumps(manifest, indent=2))
