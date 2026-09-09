"""Launch the CMC desktop GUI directly at the integrated circuit workflow."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import tkinter as tk
from mvp.cmc_surrogate_gui import CMCApp
root=tk.Tk()
app=CMCApp(root)
app.open_circuit_workflow()
root.mainloop()
