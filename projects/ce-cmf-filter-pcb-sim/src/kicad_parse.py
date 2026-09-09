"""Parses emi_filter_demo.kicad_pcb into the primitives HFSS needs.

Deliberately NOT an ODB++/DXF import: this board is small (14 track segments,
1 zone, 7 footprints), so rebuilding it from coordinates in pyaedt is more
robust than an importer round-trip -- and it is what CE_plan.md section 12.5
names as the fallback path.

Two decisions worth recording:

1. The PE plane is taken from the zone's *outline* `(polygon ...)`, not its
   `(filled_polygon ...)`. The filled polygon carries hundreds of vertices of
   thermal-relief spokes around every pad, which would explode the HFSS mesh
   while contributing nothing to the CM return path question. The outline is
   8 points and already contains the intentional slot (x=19..22, y=1..22).
2. Track segments are centerlines with a width; HFSS gets them as rectangles
   swept along the centerline plus square caps at the joints, so an L-bend
   stays electrically continuous.
"""

import re
from dataclasses import dataclass, field
from pathlib import Path

BOARD = Path(__file__).resolve().parents[1] / "emi_filter_demo.kicad_pcb"


def _tokenize(text):
    return re.findall(r'\(|\)|"(?:[^"\\]|\\.)*"|[^\s()]+', text)


def _parse(tokens, i=0):
    """S-expression -> nested lists. Strings keep their quotes stripped."""
    out = []
    while i < len(tokens):
        t = tokens[i]
        if t == "(":
            sub, i = _parse(tokens, i + 1)
            out.append(sub)
        elif t == ")":
            return out, i + 1
        else:
            out.append(t[1:-1] if t.startswith('"') else t)
            i += 1
    return out, i


def _find_all(node, key):
    """Direct children of `node` whose head is `key`."""
    return [c for c in node if isinstance(c, list) and c and c[0] == key]


def _find(node, key):
    got = _find_all(node, key)
    return got[0] if got else None


def _fval(node, key, idx=1, default=None):
    got = _find(node, key)
    return float(got[idx]) if got else default


def _sval(node, key, idx=1, default=None):
    got = _find(node, key)
    return got[idx] if got else default


@dataclass
class Segment:
    net: str
    layer: str
    start: tuple
    end: tuple
    width: float


@dataclass
class Pad:
    ref: str
    number: str
    net: str
    at: tuple
    shape: str
    size: tuple
    kind: str  # thru_hole / smd
    drill: float = 0.0


@dataclass
class Board:
    thickness: float = 1.6
    outline: list = field(default_factory=list)   # [(x, y), ...]
    segments: list = field(default_factory=list)
    pads: list = field(default_factory=list)
    pe_polygon: list = field(default_factory=list)  # zone outline, includes the slot

    @property
    def extent(self):
        xs = [p[0] for p in self.outline]
        ys = [p[1] for p in self.outline]
        return min(xs), min(ys), max(xs), max(ys)

    def nets(self):
        return sorted({s.net for s in self.segments} | {p.net for p in self.pads})

    def pads_of(self, net):
        return [p for p in self.pads if p.net == net]

    def pad(self, ref, number):
        for p in self.pads:
            if p.ref == ref and p.number == number:
                return p
        raise KeyError(f"{ref}.{number}")


def load(path=BOARD):
    tree, _ = _parse(_tokenize(Path(path).read_text(encoding="utf-8")))
    root = tree[0]

    b = Board()
    general = _find(root, "general")
    if general:
        b.thickness = _fval(general, "thickness", default=1.6)

    # --- board outline: Edge.Cuts gr_line endpoints, deduped into a rectangle ---
    pts = []
    for gl in _find_all(root, "gr_line"):
        if _sval(gl, "layer") != "Edge.Cuts":
            continue
        for key in ("start", "end"):
            n = _find(gl, key)
            pts.append((float(n[1]), float(n[2])))
    b.outline = sorted(set(pts))

    # --- tracks ---
    for seg in _find_all(root, "segment"):
        s, e = _find(seg, "start"), _find(seg, "end")
        b.segments.append(
            Segment(
                net=_sval(seg, "net", default=""),
                layer=_sval(seg, "layer", default="F.Cu"),
                start=(float(s[1]), float(s[2])),
                end=(float(e[1]), float(e[2])),
                width=_fval(seg, "width", default=1.2),
            )
        )

    # --- pads (footprints in this board are placed at 0,0 so pad `at` is absolute) ---
    for fp in _find_all(root, "footprint"):
        ref = "?"
        for prop in _find_all(fp, "property"):
            if len(prop) > 2 and prop[1] == "Reference":
                ref = prop[2]
        fp_at = _find(fp, "at")
        ox, oy = (float(fp_at[1]), float(fp_at[2])) if fp_at else (0.0, 0.0)
        for pad in _find_all(fp, "pad"):
            at = _find(pad, "at")
            size = _find(pad, "size")
            drill = _find(pad, "drill")
            b.pads.append(
                Pad(
                    ref=ref,
                    number=pad[1],
                    net=_sval(pad, "net", default=""),
                    at=(ox + float(at[1]), oy + float(at[2])),
                    kind=pad[2],
                    shape=pad[3],
                    size=(float(size[1]), float(size[2])) if size else (1.0, 1.0),
                    drill=float(drill[1]) if drill else 0.0,
                )
            )

    # --- PE zone outline (the slot lives here) ---
    zone = _find(root, "zone")
    if zone:
        poly = _find(zone, "polygon")
        if poly:
            for xy in _find_all(_find(poly, "pts"), "xy"):
                b.pe_polygon.append((float(xy[1]), float(xy[2])))

    return b


def summary(b):
    x0, y0, x1, y1 = b.extent
    lines = [
        f"board       : {x1 - x0:.1f} x {y1 - y0:.1f} mm, thickness {b.thickness} mm",
        f"outline     : {b.outline}",
        f"nets        : {', '.join(b.nets())}",
        f"segments    : {len(b.segments)} (layers: {sorted({s.layer for s in b.segments})})",
        f"pads        : {len(b.pads)}",
        f"PE polygon  : {len(b.pe_polygon)} pts -> {b.pe_polygon}",
        "",
        "segments by net:",
    ]
    for net in b.nets():
        segs = [s for s in b.segments if s.net == net]
        if segs:
            lines.append(f"  {net:6s} {len(segs)} seg, width {sorted({s.width for s in segs})}")
            for s in segs:
                lines.append(f"         {s.start} -> {s.end}  ({s.layer})")
    lines.append("")
    lines.append("pads by ref:")
    for ref in sorted({p.ref for p in b.pads}):
        for p in sorted(b.pads_of_ref(ref) if hasattr(b, "pads_of_ref") else [q for q in b.pads if q.ref == ref],
                        key=lambda q: q.number):
            lines.append(f"  {p.ref:4s}.{p.number}  {p.net:6s} at {p.at}  {p.kind} {p.shape} {p.size} drill={p.drill}")
    return "\n".join(lines)


if __name__ == "__main__":
    print(summary(load()))
