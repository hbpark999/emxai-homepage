"""Actual GUI button path + six LTspice runs; requires installed LTspice."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import tkinter as tk
import time
from mvp.cmc_surrogate_gui import CMCApp
root=tk.Tk();root.withdraw();app=CMCApp(root);app.open_circuit_workflow()
w=app.circuit_window;w.window.withdraw();w.start();deadline=time.monotonic()+180
try:
    while not w.future.done() and time.monotonic()<deadline:
        root.update();time.sleep(.1)
    assert w.future.done(), 'Workflow timeout'
    result=w.future.result();w.poll();root.update()
    assert w.progress['value']==100
    assert len(result['ce']['frequency_hz'])>200
    assert result['ce']['frequency_hz'][0]>=150e3
    assert result['ce']['frequency_hz'][-1]<=result['manifest']['frequency_stop']
    for i,c in enumerate(w.canvases):c.figure.savefig(Path('reports/charts')/f'cmc_integrated_gui_{i}.png',dpi=130)
    print('GUI_WORKFLOW_PASSED',result['manifest']['folder'],flush=True)
finally:
    app.executor.shutdown(wait=False);w.pool.shutdown(wait=False);root.destroy()
