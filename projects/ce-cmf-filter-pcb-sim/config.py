"""Single source of configuration for the CE EMI filter / return-path PoC.

HFSS driving rules follow CE_plan.md section 12, which is itself lifted from the
validated setup in D:\\ansys_works\\working\\Z0_calculation_langgraph. The two
non-negotiables: attach to a user-launched AEDT gRPC server (never
new_desktop=True), and never call export_touchstone over gRPC.
"""

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
DATA_DIR = ROOT_DIR / "data"
RAW_SIM_DIR = DATA_DIR / "raw_sim"
TOUCHSTONE_DIR = DATA_DIR / "touchstone"
REPORTS_DIR = ROOT_DIR / "reports"
CHART_DIR = REPORTS_DIR / "charts"

for _d in (DATA_DIR, RAW_SIM_DIR, TOUCHSTONE_DIR, REPORTS_DIR, CHART_DIR):
    _d.mkdir(parents=True, exist_ok=True)

BOARD_FILE = ROOT_DIR / "emi_filter_demo.kicad_pcb"

# --- AEDT ---------------------------------------------------------------
AEDT_VERSION = "2026.1"
AEDT_GRPC_PORT = 50051
HFSS_NON_GRAPHICAL = False  # headless confirmed unstable on v261 in the reference project

# This project has no venv of its own; ansys-aedt-core 1.0.0 lives in this
# interpreter (same one the Z0 project dispatches to).
PYAEDT_PYTHON_EXE = r"C:\Users\hbpar\miniconda3\python.exe"
# CE-band sweeps are slower than the Z0 project's 1200 s microstrip runs.
PYAEDT_WORKER_TIMEOUT_SEC = 5400

# Claude API key for the optional reporting agent lives in the Z0 project's .env.
DOTENV_PATH = Path(r"D:\ansys_works\working\Z0_calculation_langgraph\.env")
CLAUDE_HFSS_MODEL = "claude-opus-5"
CLAUDE_CMC_RESEARCH_MODEL = "claude-sonnet-5"

# --- materials ----------------------------------------------------------
SUBSTRATE_MATERIAL = "FR4_epoxy"
COPPER_THICKNESS_MM = 0.035

# "pec" is lossless and fast; "copper" assigns a finite-conductivity boundary of
# COPPER_THICKNESS_MM of copper. The distinction is not cosmetic in the CE band:
# copper skin depth is 171 um at 150 kHz and 66 um at 1 MHz, both far THICKER
# than the 35 um foil, so current fills the whole cross-section and the sheet
# resistance (0.48 mOhm/sq) -- which PEC sets to zero -- is what damps
# resonances and sets part of the return-path impedance. Use run_case.py
# --conductor copper to quantify the difference on any case.
CONDUCTOR = "pec"

# --- air box ------------------------------------------------------------
# A quarter wavelength at 10 kHz is 7.5 km, so the usual radiation-box padding
# rule is meaningless here. At CE frequencies this board does not radiate; the
# box only has to enclose the near field, so it is sized off the board instead.
# Consequence to state in the report: these runs quantify parasitics and return
# paths, NOT radiated emission.
# Outer boundary type. "radiation" is a first-order absorbing condition, valid
# a quarter wavelength out -- 500 m at 150 kHz, so unmeetable here. "perfecte"
# instead models a grounded shield enclosure, which is a physically real
# situation and a hard bound on how much the outer boundary can matter: if the
# answer is the same with a perfect conductor and with an absorber, the
# boundary is not participating. Sweep it with run_case.py --boundary.
OUTER_BOUNDARY = "radiation"

AIRBOX_PAD_XY_MM = 8.0
AIRBOX_PAD_ABOVE_MM = 10.0
AIRBOX_PAD_BELOW_MM = 6.0

# --- frequency ----------------------------------------------------------
# Split into two interpolating sweeps: one linear sweep from 10 kHz to 100 MHz
# would put almost no points in the 150 kHz - 3 MHz range where CE margins are
# usually decided (CE_plan.md 3.3).
FREQ_BANDS = [
    ("SweepLow", 0.01, 1.0, 101),    # MHz: 10 kHz - 1 MHz
    ("SweepHigh", 1.0, 100.0, 199),  # MHz: 1 MHz - 100 MHz
]
ADAPTIVE_FREQ_MHZ = 100.0  # mesh is refined at the top of the band
MAX_PASSES = 12
MAX_DELTA_S = 0.02
MIN_CONVERGED_PASSES = 2

# Below this, HFSS results are reported but flagged as outside the trusted band
# (CE_plan.md 3.3 -- cross-check against Q3D or hand calculation instead).
TRUST_FLOOR_MHZ = 0.15

# --- mesh ---------------------------------------------------------------
TRACE_MESH_LEN_MM = 2.0
PLANE_MESH_LEN_MM = 6.0

# --- ports --------------------------------------------------------------
# Every port is referenced to the PE plane, so the external circuit is free to
# connect any two ports together (a line-to-line Cx) or one port to PE (a Y-cap).
# Port numbering is fixed here because every downstream conversion depends on it.
#
# "ext" (stage 1): the four external terminals only. The PCB is extracted as a
# passive 4-port with the choke bridged; good for the slot/return-path question,
# useless for attaching real components.
#
# "full" (stage 2): every component terminal is a port as well, which is what
# lets the real Cx/Cy/CMC models be connected in circuit and the CE limit be
# evaluated with the filter actually present.
PORT_SETS = {
    "ext": [
        (1, "L_IN", "J1", "1"),
        (2, "N_IN", "J1", "2"),
        (3, "L_OUT", "J2", "1"),
        (4, "N_OUT", "J2", "2"),
    ],
    "full": [
        (1, "L_IN", "J1", "1"),      # LISN / mains side
        (2, "N_IN", "J1", "2"),
        (3, "L_OUT", "J2", "1"),     # EUT / converter side (noise source)
        (4, "N_OUT", "J2", "2"),
        (5, "L_IN", "CX1", "1"),     # Cx1 across the input pair
        (6, "N_IN", "CX1", "2"),
        (7, "L_OUT", "CX2", "1"),    # Cx2 across the output pair
        (8, "N_OUT", "CX2", "2"),
        (9, "L_OUT", "CY1", "1"),    # Y-caps: line terminal only, PE side is the plane
        (10, "N_OUT", "CY2", "1"),
        (11, "L_IN", "L1", "1"),     # choke, winding L: 11 -> 12
        (12, "L_OUT", "L1", "2"),
        (13, "N_IN", "L1", "3"),     # choke, winding N: 13 -> 14
        (14, "N_OUT", "L1", "4"),
    ],
}
PORTS = PORT_SETS["ext"]  # back-compat for the stage-1 postprocess path
PORT_IMPEDANCE = 50.0

# --- cases --------------------------------------------------------------
# bridge_cmc: short L_IN<->L_OUT and N_IN<->N_OUT across the L1 footprint with a
# PEC strip, i.e. treat the choke as an ideal wire. Only meaningful for the
# "ext" port set; with "full" the choke terminals are ports and the real choke
# is connected in circuit, so bridging them would short it out.
CASES = {
    "B": dict(label="Current PCB with PE slot", pe_slot=True, bridge_cmc=True, ports="ext"),
    "C": dict(label="No-slot PE plane", pe_slot=False, bridge_cmc=True, ports="ext"),
    "D": dict(label="No-slot + direct Y-cap PE return", pe_slot=False, bridge_cmc=True,
              improved_ycap=True, ports="ext"),
    # stage 2: same geometry, component terminals exposed
    "B2": dict(label="PCB with PE slot + real filter", pe_slot=True, bridge_cmc=False, ports="full"),
    "C2": dict(label="No-slot PE plane + real filter", pe_slot=False, bridge_cmc=False, ports="full"),
}

# --- LISN (CISPR 16-1-2, 50 uH / 50 ohm V-network) ----------------------
LISN_L = 50e-6
LISN_C = 0.1e-6
LISN_RES = 50.0

# --- noise source (stand-in for the converter, EUT side) ----------------
# A hard-switching SMPS: trapezoidal drain node, capacitively coupled to PE for
# the CM part. Numbers are typical for a few-hundred-watt PFC/LLC front end and
# are the one part of this model that a real measurement should replace.
SRC_FSW_HZ = 100e3
SRC_VPP = 400.0        # switching node swing
SRC_DUTY = 0.437   # deliberately not a simple fraction: a round duty puts an
                   # exact sinc null on every 1/D-th harmonic, which shows up in
                   # results as unphysical -240 dBuV notches
SRC_TRISE_S = 50e-9    # edge rate sets the high-frequency envelope
SRC_CM_CPAR_F = 100e-12  # switching node -> heatsink/PE parasitic capacitance
SRC_DM_Z = 10.0        # DM source impedance seen at the EUT terminals
TRAN_STOP_S = 4e-3     # LTspice transient length; Cx1 against the LISN settles with
                       # tau ~ 470 us, so the run must cover several ms before the
                       # tail is periodic. The settled tail is selected later.


# --- Case A (ideal circuit, no HFSS) ------------------------------------
CX1_F = 4.7e-6
CX1_ESR = 0.01
CX1_ESL = 15e-9
CX2_F = 1.5e-6
CX2_ESR = 0.015
CX2_ESL = 12e-9
CY_F = 100e-9
CY_ESR = 0.05
CY_ESL = 8e-9
CMC_L_CM = 700e-6      # ACM7060-701: 700 uH common-mode
CMC_L_DM_FRAC = 0.005  # leakage inductance as a fraction of L_cm
CMC_RP = 20e3          # parallel loss resistance (core loss), rough
LISN_R = 50.0
