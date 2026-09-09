"""80-case CMC continuous-curve surrogate and LTspice desktop GUI."""
from __future__ import annotations

import json
import math
import pickle
import re
from concurrent.futures import ThreadPoolExecutor
import subprocess
import sys
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

import numpy as np
from matplotlib import rcParams
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure

rcParams['font.family'] = 'Malgun Gothic'
rcParams['axes.unicode_minus'] = False
rcParams['axes.prop_cycle'] = __import__('cycler').cycler(color=['#087f8c', '#d48328', '#4361a0'])
rcParams['axes.spines.top'] = False
rcParams['axes.spines.right'] = False
rcParams['axes.labelcolor'] = '#334155'
rcParams['xtick.color'] = '#64748b'
rcParams['ytick.color'] = '#64748b'
rcParams['grid.color'] = '#dbe3eb'


def draw_geometry(ax, turns, inner, outer, height, wire, pitch):
    """Requested-dimension schematic; not the HFSS corrected CAD mesh."""
    ax.clear()
    theta = np.linspace(0, 2 * np.pi, 100)
    for radius in (inner / 2, outer / 2):
        t, z = np.meshgrid(theta, [-height / 2, height / 2])
        ax.plot_surface(radius * np.cos(t), radius * np.sin(t), z,
                        color='#555d68', alpha=0.65, linewidth=0)
    t, r = np.meshgrid(theta, [inner / 2, outer / 2])
    for z in (-height / 2, height / 2):
        ax.plot_surface(r * np.cos(t), r * np.sin(t), np.full_like(r, z),
                        color='#67717c', alpha=0.65, linewidth=0)
    # Continuous rectangular cross-section winding paths around the annular core.
    radii = [inner / 2 - wire, outer / 2 + wire,
             outer / 2 + wire, inner / 2 - wire, inner / 2 - wire]
    levels = [height / 2 + wire, height / 2 + wire,
              -height / 2 - wire, -height / 2 - wire, height / 2 + wire]
    for center, color, label in ((0, '#cf762f', '권선 L'), (np.pi, '#d6a34c', '권선 N')):
        points = []
        for n in range(int(turns)):
            for k in range(4):
                u = np.linspace(0, 1, 10, endpoint=False)
                rr = radii[k] + u * (radii[k + 1] - radii[k])
                zz = levels[k] + u * (levels[k + 1] - levels[k])
                angle = center + np.deg2rad(pitch) * (n + (k + u) / 4 - turns / 2)
                points.extend(zip(rr * np.cos(angle), rr * np.sin(angle), zz))
        pts = np.asarray(points)
        ax.plot(*pts.T, color=color, linewidth=2.5 * wire, label=label)
    limit = outer / 2 + 3
    ax.set(xlim=(-limit, limit), ylim=(-limit, limit),
           zlim=(-limit * 0.65, limit * 0.65))
    ax.set_box_aspect((1, 1, 0.65))
    ax.set_axis_off()
    ax.legend(loc='upper left', fontsize=9)
    ax.set_title(f'ID {inner:g} / OD {outer:g} / 높이 {height:g} mm\n'
                 f'{int(turns)} turns × 2 · 선경 {wire:g} mm · 피치 {pitch:g}°', fontsize=10)

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from src.netlist import read_raw

MODEL_PATH = ROOT / "mvp/cmc_curve_surrogate_80.pkl"
CARD_PATH = ROOT / "mvp/model_card_80.json"
GENERATED = ROOT / "mvp/generated"
LTSPICE = Path(r"C:\Program Files\ADI\LTspice\LTspice.exe")
FAMILIES = {
    "F1 소형·낮음 (16/28/6 mm)": (16.0, 28.0, 6.0),
    "F2 소형·높음 (16/28/12 mm)": (16.0, 28.0, 12.0),
    "F3 기준형 (20/32/8 mm)": (20.0, 32.0, 8.0),
    "F4 대형·낮음 (24/40/6 mm)": (24.0, 40.0, 6.0),
    "F5 대형·높음 (24/40/12 mm)": (24.0, 40.0, 12.0),
}
KEY_FREQUENCIES = np.asarray([150e3, 1e6, 10e6, 30e6])


def feature_vector(turns, family, wire_diameter, pitch):
    inner, outer, height = FAMILIES[family]
    return np.array([[float(turns), inner, outer, height, float(wire_diameter), float(pitch)]])


def load_artifacts():
    if not MODEL_PATH.exists() or not CARD_PATH.exists():
        raise FileNotFoundError("80-case 모델이 없습니다. src/train_cmc_surrogate_80.py를 실행하십시오.")
    with MODEL_PATH.open("rb") as stream:
        artifact = pickle.load(stream)
    return artifact, json.loads(CARD_PATH.read_text(encoding="utf-8"))


def predict_curves(artifact, x):
    db = artifact["model"].predict(x)[0].reshape(tuple(artifact["output_shape"]))
    return 10 ** (db / 20.0)


def key_values(frequency, curve):
    return np.interp(np.log10(KEY_FREQUENCIES), np.log10(frequency), curve)


def spice_text(zcm, zdm):
    frequency = 150000.0
    lcm = zcm[0] / (2 * math.pi * frequency)
    ldm = zdm[0] / (2 * math.pi * frequency)
    lself = (lcm + ldm) / 2
    coupling = max(0.0, min(0.9999, (lcm - ldm) / (lcm + ldm)))
    return (
        "* CMC 80-case surrogate screening equivalent\n"
        f"* Approximation from |Z| at 150 kHz: Lcm={lcm:.9g} H Ldm={ldm:.9g} H\n"
        ".SUBCKT CMC_SELECTED L_IN N_IN L_OUT N_OUT\n"
        "R_L L_IN L1 0.05\n"
        f"L_L L1 L_OUT {lself:.9g}\n"
        "R_N N_IN N1 0.05\n"
        f"L_N N1 N_OUT {lself:.9g}\n"
        f"K_CMC L_L L_N {coupling:.9g}\n"
        ".ENDS CMC_SELECTED\n"
    )


def circuit_text():
    return """* CMC surrogate + simplified LISN LTspice demo
.include cmc_selected.lib
VCM_L SL 0 AC 0.5
VCM_N SN 0 AC 0.5
RSL SL L_IN 50
RSN SN N_IN 50
XCMC L_IN N_IN L_OUT N_OUT CMC_SELECTED
LLF L_OUT 0 50u
CLM L_OUT ML 0.1u
RLM ML 0 50
LNF N_OUT 0 50u
CNM N_OUT MN 0.1u
RNM MN 0 50
.ac dec 40 150k 30Meg
.save V(ML) V(MN)
.end
"""


def raw_trace(path, wanted):
    names, values = read_raw(path)
    lookup = {name.lower(): index for index, name in enumerate(names)}
    return values[0].real, values[lookup[wanted.lower()]]


def pcb_circuit_text(library, analysis='ac'):
    from src.netlist import build
    source = build('B2', analysis, pcb_caps=(analysis != 'tran'))
    source, count = re.subn(r'(?m)^(LCM1|LCM2|K1) .*\n', '', source)
    if count != 3:
        raise ValueError('Expected B2 coupled-inductor topology was not found')
    return source.replace('.end', f'.include "{library}"\nXCMC p11 p13 p12 p14 CMC_SELECTED\n.end')


class CMCApp:
    def __init__(self, root):
        self.root = root
        root.title("CMC Surrogate / CE EMI SPICE MVP")
        root.geometry('1400x800')
        root.configure(background='#eef2f6')
        style = ttk.Style(root)
        style.theme_use('clam')
        style.configure('.', font=('Malgun Gothic', 10), background='#eef2f6', foreground='#243449')
        style.configure('TButton', padding=(12, 7), background='#ffffff', bordercolor='#cbd5e1')
        style.map('TButton', background=[('active', '#e1eef0')])
        style.configure('Primary.TButton', background='#1565c0', foreground='#ffffff',
                        bordercolor='#1565c0', padding=(14, 8), font=('Malgun Gothic',10,'bold'))
        style.map('Primary.TButton',
                  background=[('disabled','#7898bd'),('pressed','#0d47a1'),('active','#1976d2')],
                  foreground=[('disabled','#ffffff'),('pressed','#ffffff'),('active','#ffffff')])
        style.configure('TLabelframe', bordercolor='#d5dee8', relief='solid')
        style.configure('TLabelframe.Label', font=('Malgun Gothic', 11, 'bold'), foreground='#17304c')
        style.configure('TNotebook.Tab', padding=(15, 9), background='#e2e8f0')
        style.map('TNotebook.Tab', background=[('selected', '#ffffff')], foreground=[('selected', '#087f8c')])
        style.configure('Treeview', rowheight=27, fieldbackground='#ffffff', background='#ffffff')
        style.configure('Treeview.Heading', font=('Malgun Gothic', 10, 'bold'), background='#e2e8f0')
        banner = tk.Frame(root, bg='#14283f')
        banner.pack(fill='x')
        tk.Label(banner, text='EMxAI  /  CMC DESIGN LAB', bg='#14283f', fg='#ffffff',
                 font=('Segoe UI', 17, 'bold'), padx=18, pady=12).pack(side='left')
        tk.Label(banner, text='교육용 모델  ·  150 kHz–30 MHz  ·  80 HFSS cases',
                 bg='#14283f', fg='#c5d5e6', font=('Malgun Gothic', 10), padx=18).pack(side='right')
        self.artifact, self.card = load_artifacts()
        self.latest = None
        self.pcb_netlist = None
        self.executor = ThreadPoolExecutor(max_workers=1)
        self.comparison_job = None
        self.transient_job = None
        self.virtual_ce_job = None
        menu = tk.Menu(root)
        ce_menu = tk.Menu(menu, tearoff=False)
        ce_menu.add_command(label='CMC 선택 → 회로 실행 → CE Noise', command=self.open_circuit_workflow)
        ce_menu.add_command(label='대표 HFSS 4포트 · PCB/LISN 데모', command=self.show_fitted_demo)
        ce_menu.add_command(label='현재 PCB Layout / 포트 연결', command=self.show_pcb_layout)
        ce_menu.add_command(label='기존 PCB B2 + 선택 CMC · AC 실행', command=self.run_existing_pcb)
        ce_menu.add_command(label='CMC 적용/바이패스 · CM/DM 비교', command=self.compare_pcb)
        ce_menu.add_command(label='외부 PCB netlist 선택', command=self.select_pcb_spice)
        ce_menu.add_command(label='가상 스위칭 신호 · 시간영역 실행', command=self.run_pcb_transient)
        ce_menu.add_command(label='가상 CE EMI · 고조파 RMS 스펙트럼', command=self.run_virtual_ce)
        menu.add_cascade(label='CE EMI / PCB 회로', menu=ce_menu)
        root.config(menu=menu)

        controls = ttk.LabelFrame(root, text="CMC 설계 입력")
        controls.pack(fill="x", padx=10, pady=8)
        self.turns = tk.IntVar(value=8)
        self.family = tk.StringVar(value=list(FAMILIES)[2])
        self.wire = tk.DoubleVar(value=0.8)
        self.pitch = tk.DoubleVar(value=3.0)
        widgets = [
            ("권선 수", ttk.Spinbox(controls, from_=6, to=12, textvariable=self.turns, width=7)),
            ("코어 형상", ttk.Combobox(controls, values=list(FAMILIES), textvariable=self.family, width=29, state="readonly")),
            ("선경 (mm)", ttk.Spinbox(controls, from_=0.5, to=1.1, increment=0.1, textvariable=self.wire, width=7)),
            ("권선 피치 (°)", ttk.Spinbox(controls, from_=2.1, to=5.0, increment=0.1, textvariable=self.pitch, width=7)),
        ]
        for column, (label, widget) in enumerate(widgets):
            ttk.Label(controls, text=label).grid(row=0, column=2 * column, padx=4, pady=8)
            widget.grid(row=0, column=2 * column + 1, padx=4)
        for column, (label, command) in enumerate((
            ("특성 예측", self.predict), ("SPICE 생성", self.generate_spice),
            ("LTspice 실행", self.run_ltspice), ("PCB SPICE 선택", self.select_pcb_spice),
            ("PCB+CMC 실행", self.run_pcb_spice),
        )):
            ttk.Button(controls, text=label, command=command,
                       style='Primary.TButton' if column < 2 else 'TButton').grid(
                           row=1, column=column, padx=4, pady=6, sticky="ew")

        panels = ttk.Panedwindow(root, orient='horizontal')
        panels.pack(fill='both', expand=True, padx=10)
        left = ttk.LabelFrame(panels, text='CMC 형상 미리보기')
        right = ttk.Frame(panels)
        panels.add(left, weight=2)
        panels.add(right, weight=3)
        self.geometry_figure = Figure(figsize=(5, 4.5), dpi=100, layout='constrained')
        self.geometry_ax = self.geometry_figure.add_subplot(111, projection='3d')
        self.geometry_ax.view_init(elev=28, azim=-55)
        self.geometry_canvas = FigureCanvasTkAgg(self.geometry_figure, master=left)
        self.geometry_canvas.get_tk_widget().pack(fill='both', expand=True)
        ttk.Label(left, text='입력 치수 기반 개략 형상 · 마우스 드래그로 회전\nHFSS 자동 보정 및 리드·절연 상세는 미포함',
                  anchor='center').pack(fill='x', pady=8)
        tabs = ttk.Notebook(right)
        tabs.pack(fill='both', expand=True)
        curve_tab, surface_tab = ttk.Frame(tabs), ttk.Frame(tabs)
        tabs.add(curve_tab, text='특성 곡선 / 오차 참고 범위')
        tabs.add(surface_tab, text='응답표면 (GPR)')
        progress_tab = ttk.Frame(tabs)
        tabs.add(progress_tab, text='200 MHz 검증 / 제조편차')
        self.progress_text = tk.Text(progress_tab, wrap='word', font=('Malgun Gothic',11), height=16)
        self.progress_text.pack(fill='both',expand=True,padx=12,pady=12)
        ttk.Button(progress_tab,text='진행 상태 새로고침',command=self.refresh_progress).pack(pady=5)
        self.surface_figure = Figure(figsize=(7, 4.5), layout='constrained')
        self.surface_ax = self.surface_figure.add_subplot(111, projection='3d')
        self.surface_canvas = FigureCanvasTkAgg(self.surface_figure, master=surface_tab)
        self.surface_canvas.get_tk_widget().pack(fill='both', expand=True)
        ttk.Label(surface_tab, text='1 MHz |ZCM| · 선택 코어/선경 고정 · GPR 예측 표면\n2차 다항식 RSM 회귀 결과가 아니며, 격자 사이 표면은 시각적 보간입니다.').pack()
        self.figure = Figure(figsize=(8.8, 4.5), dpi=100, layout='constrained')
        self.ax = self.figure.add_subplot(111)
        self.canvas = FigureCanvasTkAgg(self.figure, master=curve_tab)
        self.canvas.get_tk_widget().pack(fill="both", expand=True, padx=10)
        self.table = ttk.Treeview(root, columns=("f", "cm", "dm"), show="headings", height=4)
        for key, label, width in (("f", "주파수", 130), ("cm", "|ZCM| (Ω)", 160), ("dm", "|ZDM| (Ω)", 160)):
            self.table.heading(key, text=label)
            self.table.column(key, width=width, anchor="center")
        self.table.pack(fill="x", padx=10, pady=6)
        self.status = ttk.Label(root, text="HFSS 기반 MVP: 부품 측정 및 CE 인증 결과와 동일함을 뜻하지 않습니다.")
        self.status.pack(pady=5)
        self.metrics = ttk.Label(root, justify='left')
        self.metrics.pack(fill='x', padx=12, pady=5)
        self._update_job = None
        self._surface_key = None
        self.predict()
        self.refresh_progress()
        for variable in (self.turns, self.family, self.wire, self.pitch):
            variable.trace_add('write', self.schedule_update)

    def refresh_progress(self):
        lines=['현재 배포 모델: 80건 / 150 kHz~30 MHz',
               '목표 대역: 200 MHz. 파일럿·수치 검증·재학습 전까지 고주파 예측은 제공하지 않습니다.', '']
        path=ROOT/'reports/cmc/six_hour_progress.json'
        if path.exists():
            try:
                state=json.loads(path.read_text(encoding='utf-8'))
                lines += [f"파일럿 기록: {len(state.get('runs',[]))}/{state.get('target',8)}건",
                          f"단계: {state.get('stage')}",f"기록 시각(UTC): {state.get('updated_utc')}",
                          '진행 기록은 파일 기준이며 현재 프로세스의 생존을 보장하지 않습니다.']
            except (OSError,ValueError):lines += ['진행 파일 갱신 중입니다. 다시 새로고침하십시오.']
        checks=ROOT/'reports/cmc/broadband_accuracy_checks.json'
        if checks.exists():
            try:
                validation=json.loads(checks.read_text())
                runs=validation.get('runs',[])
                lines += ['수치 비교 단계: '+validation['status'],
                          f'직접점·세밀 메시·큰 공기영역 해석 기록: {len(runs)}/3건',
                          '기본 수렴 통과는 광대역 정확도 확보와 다릅니다.']
                for run in runs:
                    lines.append(f"  {run['name']}: {run.get('audit',{}).get('status','미확인')}")
                for name,modes in validation.get('comparisons',{}).items():
                    for mode,metric in modes.items():
                        lines.append(f"  {name} {mode.upper()}: 최대 크기 차이 {metric['max_magnitude_percent']:.2f}% / "
                                     f"최대 위상 차이 {metric['max_phase_degree']:.2f}°")
            except (OSError,ValueError,KeyError):pass
        lines += ['', '제조편차 모델: 준비 단계',
                  '선정 변수: 평균 피치, 턴 간격 불균일도(CV)',
                  '현 모델에는 불균일도 입력이 없어 몬테카를로 실행은 아직 비활성입니다.',
                  '턴별 형상 HFSS 데이터와 공차 분포 확보 후 활성화합니다.', '',
                  'CE EMI / PCB 회로 메뉴: B2 PCB + 선택 CMC, CM/DM 적용/바이패스 비교',
                  '현재 회로는 150 kHz CMC 근사와 단위 AC 입력이며 규격 검파 결과가 아닙니다.']
        self.progress_text.config(state='normal')
        self.progress_text.delete('1.0','end');self.progress_text.insert('1.0','\n'.join(lines))
        self.progress_text.config(state='disabled')

    def schedule_update(self, *_):
        if self._update_job is not None:
            self.root.after_cancel(self._update_job)
        self._update_job = self.root.after(400, self.auto_update)

    def auto_update(self):
        self._update_job = None
        try:
            self.predict()
        except (ValueError, tk.TclError) as exc:
            self.latest = None
            self.status.config(text=f'입력값 확인 필요: {exc}')

    def update_surface(self, x):
        key = (self.family.get(), self.wire.get())
        if key != self._surface_key:
            turns, pitch = np.meshgrid(np.arange(6, 13), np.linspace(2.1, 5, 25))
            inputs = np.repeat(x, turns.size, axis=0)
            inputs[:, 0], inputs[:, 5] = turns.ravel(), pitch.ravel()
            curves = self.artifact['model'].predict(inputs).reshape(-1, 2, 201)
            logf = np.log10(self.artifact['frequency_hz'])
            z = np.asarray([10 ** (np.interp(6, logf, c[0]) / 20) for c in curves])
            self._surface_data = turns, pitch, z.reshape(turns.shape)
            self._surface_key = key
        ax = self.surface_ax
        ax.clear()
        ax.plot_surface(*self._surface_data, cmap='viridis', alpha=0.8)
        z = key_values(self.artifact['frequency_hz'], self.latest[0])[1]
        ax.scatter([x[0, 0]], [x[0, 5]], [z], color='red', s=50, label='현재 설계')
        ax.set(xlabel='권선 수', ylabel='피치 (°)', zlabel='|ZCM| (Ω)', title='1 MHz 응답표면')
        ax.legend()
        self.surface_canvas.draw_idle()

    def predict(self):
        x = feature_vector(self.turns.get(), self.family.get(), self.wire.get(), self.pitch.get())
        for name, value in zip(self.artifact['feature_names'], x[0]):
            low, high = self.card['input_ranges'][name]
            if not np.isfinite(value) or not low <= value <= high:
                raise ValueError(f'{name}: {low:g}~{high:g} 범위만 허용')
        draw_geometry(self.geometry_ax, *x[0])
        # Legacy training uses requested inputs; do not silently change the
        # prediction vector when warning about the CAD factory's correction.
        inner_radius = x[0][1] / 2 - 1.1 * x[0][4] / 2
        minimum_pitch = math.degrees(math.asin(1.1 * x[0][4] / 2 / inner_radius))
        if x[0][5] < minimum_pitch:
            corrected_pitch = math.ceil(minimum_pitch * 1000) / 1000
            self.geometry_ax.text2D(
                0.02, 0.02,
                f'요청 피치 {x[0][5]:g}° · HFSS 보정 예상 {corrected_pitch:g}°\n'
                '그림은 요청 형상이며 실제 CAD와 다를 수 있습니다.',
                transform=self.geometry_ax.transAxes, fontsize=9, color='darkred')
        self.geometry_canvas.draw_idle()
        zcm, zdm = predict_curves(self.artifact, x)
        frequency = np.asarray(self.artifact["frequency_hz"])
        self.latest = (zcm, zdm)
        self.ax.clear()
        self.ax.loglog(frequency, zcm, label="|ZCM|")
        self.ax.loglog(frequency, zdm, label="|ZDM|")
        p90 = self.card["validation"]["confirmation_holdout"]["p90_relative_error_percent"] / 100
        for z, color in ((zcm, '#087f8c'), (zdm, '#d48328')):
            self.ax.fill_between(frequency, z / (1 + p90), z / (1 - p90), color=color, alpha=0.15)
        self.ax.plot([], [], color='gray', linewidth=8, alpha=0.2, label='검증 P90 오차 참고 범위 (신뢰구간 아님)')
        self.ax.set_xlabel("주파수 (Hz)")
        self.ax.set_ylabel("임피던스 (Ω)")
        self.ax.grid(True, which="both", alpha=0.3)
        self.ax.legend()
        self.canvas.draw()
        for item in self.table.get_children():
            self.table.delete(item)
        cm_key, dm_key = key_values(frequency, zcm), key_values(frequency, zdm)
        for f, cm, dm in zip(KEY_FREQUENCIES, cm_key, dm_key):
            label = f"{f / 1e6:g} MHz" if f >= 1e6 else f"{f / 1e3:g} kHz"
            self.table.insert("", "end", values=(label, f"{cm:.4g}", f"{dm:.4g}"))
        val = self.card["validation"]["confirmation_holdout"]
        self.status.config(text=f"{self.card['algorithm']} · 80 HFSS cases · 확인군 RMSE {val['db_rmse']:.2f} dB / 평균 상대오차 {val['mean_relative_error_percent']:.1f}%")
        locked = self.card['validation']['locked_holdout']
        self.metrics.config(text=f"신규 확인 4건: RMSE {val['db_rmse']:.3f} dB / P90 {100*p90:.2f}%    "
            f"기존 holdout 12건: RMSE {locked['db_rmse']:.3f} dB / P90 {locked['p90_relative_error_percent']:.2f}%\n"
            '통계는 검증군 전체 기준이며 현재 설계의 오차 보장이 아닙니다. 150 kHz~30 MHz / 범위 내 예측만 허용')
        self.update_surface(x)

    def generate_spice(self):
        self.predict()
        GENERATED.mkdir(parents=True, exist_ok=True)
        library = GENERATED / "cmc_selected.lib"
        library.write_text(spice_text(*self.latest), encoding="utf-8")
        (GENERATED / "cmc_selected_demo.cir").write_text(circuit_text(), encoding="utf-8")
        messagebox.showinfo("SPICE 생성", str(library))

    def run_existing_pcb(self):
        """Reuse the existing B2 PCB extraction and its documented pad mapping."""
        try:
            from src.netlist import build
            self.predict()
            GENERATED.mkdir(parents=True, exist_ok=True)
            lib = GENERATED / 'cmc_selected.lib'
            lib.write_text(spice_text(*self.latest), encoding='utf-8')
            source = pcb_circuit_text(lib)
            target = GENERATED / 'pcb_B2_selected_cmc_ac.cir'
            target.write_text(source, encoding='utf-8')
            self._run_and_plot(target)
            self.ax.set_ylabel('LISN 응답 (dBV / 총 CM 전류 1 A)')
            self.canvas.draw_idle()
            self.status.config(text='PCB B2 + 선택 CMC: 150 kHz~30 MHz · 단위 CM AC 응답 / 규격 검파 미적용 / CMC는 150 kHz 근사')
        except Exception as exc:
            messagebox.showerror('PCB B2 해석', str(exc))

    def compare_pcb(self):
        if self.comparison_job is not None and not self.comparison_job.done():
            return
        self.predict()
        from src.cmc_pcb_comparison import run_comparison
        self.comparison_job = self.executor.submit(run_comparison, *self.latest,
                                                   GENERATED/'pcb_comparison')
        self.status.config(text='PCB CM/DM 비교 계산 중: 선택 시점의 설계값 사용')
        self.root.after(200, self.poll_comparison)

    def run_virtual_ce(self):
        if self.virtual_ce_job is not None and not self.virtual_ce_job.done():
            return
        try:
            self.predict()
            from src.cmc_virtual_ce import run_virtual_ce
            self.virtual_ce_job=self.executor.submit(run_virtual_ce,*self.latest,GENERATED/'virtual_ce_gui')
            self.status.config(text='가상 CE 고조파 계산 중 · 선택 시점 설계값 사용')
            self.root.after(200,self.poll_virtual_ce)
        except Exception as exc:
            messagebox.showerror('가상 CE 해석',str(exc))

    def poll_virtual_ce(self):
        if not self.virtual_ce_job.done():
            self.root.after(200,self.poll_virtual_ce);return
        try:
            data,manifest=self.virtual_ce_job.result()
            self.show_virtual_ce_result(data,manifest)
        except Exception as exc:
            messagebox.showerror('가상 CE 해석',str(exc))

    def show_virtual_ce_result(self,data,manifest):
        window=tk.Toplevel(self.root);window.title('가상 CE EMI · 고조파별 RMS 전압')
        fig=Figure(figsize=(11,5),layout='constrained');axes=fig.subplots(1,2)
        f=data['frequency_hz'];mask=(f>=150e3)&(f<=30e6)
        for ax,line in zip(axes,['l','n']):
            for topology,label in [('selected','CMC 적용'),('bypass','CMC 바이패스')]:
                ax.plot(f[mask]/1e6,data[f'{topology}_{line}_rms_dbuv'][mask],'.',markersize=3,label=label)
            ax.set(xscale='log',xlabel='고조파 주파수 (MHz)',ylabel='고조파별 RMS 전압 (dBµV)',title=f'LISN {line.upper()}')
            ax.grid(True,which='both',alpha=.3);ax.legend()
        canvas=FigureCanvasTkAgg(fig,master=window);canvas.get_tk_widget().pack(fill='both',expand=True)
        canvas.draw();window.virtual_ce_canvas=canvas
        source=manifest['source']
        ttk.Label(window,text=f"가상 입력 {source['frequency_hz']/1e3:g} kHz / {source['voltage_v']:g} V / duty {source['duty']:g}\n"
            '150 kHz CMC 인덕터 근사 · PCB 기생용량 포함 · 고조파별 RMS 선 스펙트럼\n'
            '준첨두/평균 규격 검출기 결과가 아니며 규격 합격 판정은 제공하지 않습니다.').pack(pady=6)
        self.status.config(text='가상 CE 고조파 계산 완료 · 규격 검출기 미적용')

    def run_pcb_transient(self):
        if self.transient_job is not None and not self.transient_job.done():
            return
        try:
            self.predict()
            from src.cmc_pcb_transient import run_transient
            self.transient_job = self.executor.submit(
                run_transient, *self.latest, GENERATED/'pcb_transient_gui',
                method='gear', stop_s=.04)
            self.status.config(text='시간영역 계산 중 · 100 kHz / 400 V 가상 입력 · 40 ms · 선택 시점 설계값')
            self.root.after(200, self.poll_transient)
        except Exception as exc:
            messagebox.showerror('시간영역 해석', str(exc))

    def poll_transient(self):
        if not self.transient_job.done():
            self.root.after(200, self.poll_transient)
            return
        try:
            data, manifest = self.transient_job.result()
            self.show_transient_result(data, manifest)
        except Exception as exc:
            messagebox.showerror('시간영역 해석', str(exc))

    def show_transient_result(self, data, manifest):
        window = tk.Toplevel(self.root)
        window.title('PCB + CMC · 가상 신호 시간영역')
        fig = Figure(figsize=(11,6), layout='constrained')
        source, response = fig.subplots(2,1)
        t = data['time_s']
        tail = t >= t[-1] - 5 / manifest['source']['frequency_hz']
        source.plot(t[tail]*1e6, data['source_v'][tail], color='gray')
        source.set(ylabel='가상 입력 (V)')
        for key, label in [('line_v','LISN L'), ('neutral_v','LISN N')]:
            response.plot(t[tail]*1e6, data[key][tail], label=label)
        response.set(xlabel='시간 (µs)', ylabel='수신 전압 (V)')
        response.legend()
        for ax in [source, response]: ax.grid(True, alpha=.3)
        canvas = FigureCanvasTkAgg(fig, master=window)
        canvas.get_tk_widget().pack(fill='both', expand=True)
        canvas.draw(); window.transient_canvas = canvas
        error = max(manifest['last_period_relative_rms_difference'].values())*100
        state = '통과' if manifest['periodicity_screen_passed'] else '미통과'
        ttk.Label(window, text=f'마지막 두 주기 차이 최대 {error:.2f}% · 1% 정착 선별 {state}\n'
                  '150 kHz CMC 인덕터 근사 / PCB 기생용량 생략 / 가상 입력 / 규격 검출기 미적용\n'
                  '정착 선별은 정확도 검증과 다릅니다.').pack(pady=6)
        self.status.config(text=f'시간영역 계산 완료 · 정착 선별 {state} · 정확도 검증 대기')

    def open_circuit_workflow(self):
        from mvp.cmc_circuit_window import CircuitWindow
        if getattr(self,'circuit_window',None) and not self.circuit_window.closed:
            self.circuit_window.window.lift();return
        self.circuit_window=CircuitWindow(self.root,layout_callback=self.show_pcb_layout)

    def show_fitted_demo(self):
        folder=ROOT/'mvp/generated/cmc_spice_demo'
        try:
            data=np.load(folder/'pcb/comparison.npz')
            validation=json.loads((folder/'ltspice_validation.json').read_text())
        except (OSError,ValueError) as exc:
            messagebox.showerror('대표 설계 데모',str(exc));return
        window=tk.Toplevel(self.root)
        window.title('EMxAI | HFSS → SPICE → PCB / LISN')
        window.geometry('1120x760')
        ttk.Label(window,text='대표 CMC · PCB/LISN 주파수 응답',font=('Malgun Gothic',17,'bold')).pack(pady=(16,4))
        ttk.Label(window,text='8 turns × 2 · ID/OD/H 20/32/8 mm · 선경 0.8 mm · 피치 3°\n'
                  '현재 입력과 별개인 사전 계산 예제 · PCB B2 · X/Y capacitor 유지').pack(pady=4)
        fig=Figure(figsize=(10,5.5),layout='constrained')
        axes=fig.subplots(2,2)
        f=data['frequency_hz']/1e6
        for col,mode in enumerate(['cm','dm']):
            for topology,label,color in [('bypass','CMC bypass','#94a3b8'),('selected','CMC 적용','#087f8c')]:
                axes[0,col].semilogx(f,20*np.log10(np.maximum(abs(data[f'{topology}_{mode}_l']),1e-30)),label=label,color=color)
            axes[0,col].set(title=f'{mode.upper()} · L측 LISN',ylabel='전달 임피던스 (dBΩ)')
            axes[0,col].legend()
            for line,label in [('l','L'),('n','N')]:
                axes[1,col].semilogx(f,data[f'insertion_{mode}_{line}_db'],label=label)
            axes[1,col].set(xlabel='주파수 (MHz)',ylabel='CMC 적용 감쇠 (dB)')
            axes[1,col].axhline(0,color='#94a3b8',lw=.8);axes[1,col].legend()
        for ax in axes.flat:ax.grid(True,alpha=.4)
        canvas=FigureCanvasTkAgg(fig,master=window);canvas.get_tk_widget().pack(fill='both',expand=True)
        canvas.draw();window.result_canvas=canvas
        error=max(x['max_magnitude_percent'] for x in validation['modal'].values())
        ttk.Label(window,text=f'대표 CMC 단독 SPICE 변환 오차 ≤ {error:.4f}% (검사 지점)\n'
                  '150 kHz–29.63 MHz · CM 총전류 1 A / DM 전류 1 A · 검파 미적용\n'
                  'PCB 결합 원본 네트워크 교차검증 대기 · 실제 CE 측정/인증 결과 아님').pack(pady=10)

    def show_pcb_layout(self):
        from src.kicad_parse import load
        from matplotlib.patches import Rectangle, Polygon, Circle
        board=load()
        window=tk.Toplevel(self.root);window.title('PCB Layout / 회로 포트')
        fig=Figure(figsize=(9,6),layout='constrained');ax=fig.add_subplot(111)
        x0,y0,x1,y1=board.extent
        ax.add_patch(Rectangle((x0,y0),x1-x0,y1-y0,facecolor='#e7eee5',edgecolor='black'))
        if board.pe_polygon:
            ax.add_patch(Polygon(board.pe_polygon,facecolor='#93ad94',alpha=.45,label='PE 영역 외곽'))
        for s in board.segments:
            a,b=np.array(s.start),np.array(s.end);delta=b-a
            unit=np.array([-delta[1],delta[0]])/np.linalg.norm(delta)*s.width/2
            ax.add_patch(Polygon([a+unit,b+unit,b-unit,a-unit],facecolor='#b97435'))
        for pad in board.pads:
            px,py=pad.at;w,h=pad.size
            ax.add_patch(Rectangle((px-w/2,py-h/2),w,h,facecolor='#d9a24f',edgecolor='#5c4527'))
            if pad.drill:ax.add_patch(Circle((px,py),pad.drill/2,color='white'))
            ax.text(px,py+1.8,f'{pad.ref}.{pad.number}',fontsize=8,ha='center')
        ax.set(xlim=(x0-3,x1+3),ylim=(y1+4,y0-4),xlabel='X (mm)',ylabel='Y (mm)',
               title='emi_filter_demo.kicad_pcb · 저장 좌표 기반 배치도')
        ax.set_aspect('equal');ax.legend(loc='upper right')
        canvas=FigureCanvasTkAgg(fig,master=window);canvas.get_tk_widget().pack(fill='both',expand=True)
        canvas.draw();window.layout_canvas=canvas
        ttk.Label(window,text='회로 연결: LISN p1/p2 ← PCB·필터 ← 노이즈원 p3/p4\n'
            '선택 CMC: L 권선 p11–p12 / N 권선 p13–p14, 공통 기준 PE\n'
            '선택 CMC의 실장 적합성 및 PCB+CMC 통합 3D 해석을 의미하지 않습니다.').pack(pady=8)

    def poll_comparison(self):
        if not self.comparison_job.done():
            self.root.after(200, self.poll_comparison)
            return
        try:
            data = self.comparison_job.result()
            window = tk.Toplevel(self.root)
            window.title('PCB B2 · CMC 적용/바이패스 비교')
            fig = Figure(figsize=(11,5), layout='constrained')
            ax, gain = fig.subplots(1,2)
            f = data['frequency_hz']
            for mode,color in [('cm','tab:blue'),('dm','tab:orange')]:
                for topo,style in [('selected','-'),('bypass','--')]:
                    ax.semilogx(f,20*np.log10(np.maximum(abs(data[f'{topo}_{mode}_l']),1e-30)),
                                style,color=color,label=f'{mode.upper()} {topo} (L)')
                gain.semilogx(f,data[f'insertion_{mode}_l_db'],color=color,label=mode.upper())
            ax.set(xlabel='주파수 (Hz)',ylabel='LISN L 응답 (dBV / 모드 전류 1 A)')
            gain.set(xlabel='주파수 (Hz)',ylabel='CMC 삽입 감쇠 (dB)')
            for a in [ax,gain]:a.grid(True,which='both',alpha=.3);a.legend()
            canvas=FigureCanvasTkAgg(fig,master=window)
            canvas.get_tk_widget().pack(fill='both',expand=True)
            canvas.draw();window.comparison_canvas=canvas
            ttk.Label(window,text='바이패스는 CMC만 단락, X/Y 커패시터 유지 · 단위 입력 AC 응답 · 규격 검파 미적용\nCMC는 150 kHz 근사이며 200 MHz 검증 모델이 아닙니다.').pack(pady=6)
            self.status.config(text='PCB CM/DM 비교 완료 · 결과 창 및 mvp/generated/pcb_comparison 저장')
        except Exception as exc:
            messagebox.showerror('PCB 비교',str(exc))

    def _run_and_plot(self, circuit):
        if not LTSPICE.exists():
            raise FileNotFoundError("LTspice 실행 파일을 찾을 수 없습니다.")
        raw, log = circuit.with_suffix(".raw"), circuit.with_suffix(".log")
        raw.unlink(missing_ok=True)
        result = subprocess.run([str(LTSPICE), "-b", "-Run", str(circuit)], capture_output=True, text=True, timeout=1800)
        if result.returncode != 0 or not raw.exists():
            detail = log.read_text(encoding="latin-1", errors="replace")[-2000:] if log.exists() else result.stderr
            raise RuntimeError(detail or "LTspice RAW 결과가 생성되지 않았습니다.")
        frequency, ml = raw_trace(raw, "V(ml)")
        _, mn = raw_trace(raw, "V(mn)")
        self.ax.clear()
        self.ax.semilogx(frequency, 20 * np.log10(np.maximum(np.abs(ml), 1e-30)), label="LISN L")
        self.ax.semilogx(frequency, 20 * np.log10(np.maximum(np.abs(mn), 1e-30)), label="LISN N")
        self.ax.set_xlabel("주파수 (Hz)")
        self.ax.set_ylabel("수신기 전압 (dBV)")
        self.ax.grid(True, which="both", alpha=0.3)
        self.ax.legend()
        self.canvas.draw()
        self.status.config(text=f"LTspice 완료: {raw}")
        return raw

    def run_ltspice(self):
        try:
            self.generate_spice()
            messagebox.showinfo("LTspice", f"해석 완료\n{self._run_and_plot(GENERATED / 'cmc_selected_demo.cir')}")
        except Exception as exc:
            messagebox.showerror("LTspice", str(exc))

    def select_pcb_spice(self):
        self.open_circuit_workflow()
        self.circuit_window.open_spice()

    def run_pcb_spice(self):
        self.open_circuit_workflow()
        self.circuit_window.start()


def main():
    root = tk.Tk()
    try:
        CMCApp(root)
    except Exception as exc:
        messagebox.showerror("CMC GUI", str(exc))
        root.destroy()
        return
    root.mainloop()


if __name__ == "__main__":
    main()
