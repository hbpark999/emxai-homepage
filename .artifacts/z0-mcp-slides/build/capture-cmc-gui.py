import sys
from pathlib import Path
import tkinter as tk
from PIL import ImageGrab

ROOT = Path(__file__).resolve().parents[3] / "projects" / "ce-cmf-filter-pcb-sim"
sys.path.insert(0, str(ROOT))
from mvp.cmc_surrogate_gui import CMCApp

out = Path(__file__).resolve().parents[3] / "deliverables" / "z0-mcp-slides" / "assets" / "cmc-gui-actual.png"
geometry_out = out.with_name("cmc-coil-geometry-actual.png")
root = tk.Tk()
app = CMCApp(root)
root.update_idletasks()
root.update()

def capture():
    root.lift()
    root.attributes('-topmost', True)
    root.update()
    x, y = root.winfo_rootx(), root.winfo_rooty()
    w, h = root.winfo_width(), root.winfo_height()
    ImageGrab.grab(bbox=(x, y, x + w, y + h), all_screens=True).save(out)
    app.geometry_figure.savefig(geometry_out, dpi=180, facecolor="white", bbox_inches="tight")
    root.destroy()

root.after(1800, capture)
root.mainloop()
print(out)
print(geometry_out)
