from __future__ import annotations

import math
import io
import copy
import types
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import skrf as rf
from skrf.vectorFitting import VectorFitting

from .models import CandidateResult, CheckResult, TraceData


MAX_POINTS_FOR_PLOT = 401
DEFAULT_CANDIDATES = ((1, 0), (0, 1), (1, 2), (2, 3), (2, 4), (3, 5))


class _NamedStringIO(io.StringIO):
    def __init__(self, initial_value: str, name: str):
        super().__init__(initial_value)
        self.name = name


class _NonClosingStringIO(io.StringIO):
    def __exit__(self, *_args):
        return False

    def close(self):
        # scikit-rf writes through a context manager. Keep the buffer readable.
        pass


class AnalysisError(ValueError):
    pass


@dataclass
class FittingResult:
    network: rf.Network
    vector_fit: VectorFitting
    candidates: list[CandidateResult]
    input_checks: list[CheckResult]
    output_checks: list[CheckResult]
    traces: list[TraceData]
    warnings: list[str]
    spice_text: str


def _status(ok: bool, warning: bool = False) -> str:
    if ok:
        return "pass"
    return "warning" if warning else "fail"


def _max_singular_value(network: rf.Network) -> float:
    values = np.linalg.svd(network.s, compute_uv=False)
    return float(np.max(values))


def _reciprocity_error(network: rf.Network) -> float:
    return float(np.max(np.abs(network.s - np.swapaxes(network.s, 1, 2))))


def _causality_heuristic(network: rf.Network) -> tuple[str, float | None, str]:
    frequencies = network.f
    if len(frequencies) < 16:
        return "warning", None, "주파수 점이 적어 시간영역 인과성 경향을 평가하지 않았습니다."
    spacing = np.diff(frequencies)
    uniform = np.allclose(spacing, spacing[0], rtol=1e-3, atol=0.0)
    if not uniform:
        return "warning", None, "비균일 주파수 간격입니다. 인과성은 전문 도구로 추가 확인해야 합니다."
    try:
        time, impulse = network.impulse_response(window="hamming", pad=4)
        energy = np.abs(impulse) ** 2
        negative = float(np.sum(energy[time < 0]))
        total = float(np.sum(energy))
        ratio = negative / total if total > 0 else 0.0
        status = "pass" if ratio <= 0.01 else "warning"
        return status, ratio, "음의 시간 에너지 비율을 이용한 보조 지표입니다."
    except Exception:
        return "warning", None, "제한된 대역 데이터라 인과성 보조 계산을 완료하지 못했습니다."


def load_network(data: bytes, filename: str) -> rf.Network:
    suffix = Path(filename).suffix.lower()
    if suffix not in {".s2p", ".s4p"}:
        raise AnalysisError("MVP는 .s2p와 .s4p 파일만 지원합니다.")
    if not data:
        raise AnalysisError("파일이 비어 있습니다.")
    try:
        stream = _NamedStringIO(data.decode("utf-8-sig", errors="replace"), filename)
        network = rf.Network(stream)
    except Exception as exc:
        raise AnalysisError(f"Touchstone 파일을 읽을 수 없습니다: {exc}") from exc
    if network.nports != int(suffix[2]):
        raise AnalysisError("파일의 포트 수가 확장자와 일치하지 않습니다.")
    if len(network.f) < 8:
        raise AnalysisError("Vector Fitting에는 최소 8개의 주파수 점이 필요합니다.")
    if not np.all(np.isfinite(network.s)):
        raise AnalysisError("S-parameter에 NaN 또는 무한대가 포함되어 있습니다.")
    if not np.all(np.isfinite(network.f)) or np.any(network.f < 0) or np.any(np.diff(network.f) <= 0):
        raise AnalysisError("주파수는 유한한 비음수 값이며 중복 없이 증가해야 합니다.")
    if len(network.f) > 20001:
        raise AnalysisError("MVP는 파일당 최대 20,001개 주파수 점을 지원합니다.")
    if not np.all(np.isfinite(network.z0)) or np.any(np.real(network.z0) <= 0):
        raise AnalysisError("기준 임피던스는 유한하고 실수부가 양수여야 합니다.")
    return network


def check_input(network: rf.Network, selected: set[str] | None = None) -> tuple[list[CheckResult], list[str]]:
    checks: list[CheckResult] = []
    warnings: list[str] = []
    selected = {"reciprocity", "passivity", "causality_heuristic", "reference_impedance"} if selected is None else selected
    rec_error = _reciprocity_error(network) if "reciprocity" in selected else 0.0
    checks.append(CheckResult(
        name="reciprocity",
        status=_status(rec_error <= 1e-3, warning=True),
        value=rec_error,
        summary=f"max |Sij-Sji| = {rec_error:.3g}",
    ))
    sigma = _max_singular_value(network) if "passivity" in selected else 0.0
    passive = sigma <= 1.0 + 1e-6
    checks.append(CheckResult(
        name="passivity",
        status=_status(passive, warning=True),
        value=sigma,
        summary=f"최대 특이값 = {sigma:.6f}",
    ))
    c_status, c_ratio, c_summary = _causality_heuristic(network) if "causality_heuristic" in selected else ("skipped", None, "선택하지 않은 검사입니다.")
    checks.append(CheckResult(name="causality_heuristic", status=c_status, value=c_ratio, summary=c_summary))
    if "causality_heuristic" in selected:
        warnings.append("Causality 표시는 유한 대역 데이터에 대한 보조 지표이며 인증 시험이 아닙니다.")
    z0 = np.real(network.z0)
    z0_spread = float(np.max(z0) - np.min(z0))
    checks.append(CheckResult(
        name="reference_impedance",
        status=_status(z0_spread <= 1e-6, warning=True),
        value=float(np.mean(z0)),
        summary=f"평균 Z0 = {np.mean(z0):.3f} Ω, 편차 = {z0_spread:.3g} Ω",
    ))
    return [check for check in checks if check.name in selected], warnings


def _is_stable(vf: VectorFitting) -> bool:
    return bool(np.all(np.real(vf.poles) < 0.0))


def _fit_candidate(network: rf.Network, real_poles: int, complex_pairs: int) -> tuple[VectorFitting, CandidateResult]:
    vf = VectorFitting(network)
    vf.max_iterations = 60
    vf.vector_fit(
        n_poles_real=real_poles,
        n_poles_cmplx=complex_pairs,
        init_pole_spacing="log",
        parameter_type="s",
        fit_constant=True,
        fit_proportional=False,
    )
    error = float(vf.get_rms_error(parameter_type="s"))
    stable = _is_stable(vf)
    try:
        passive = bool(vf.is_passive(parameter_type="s"))
    except Exception:
        passive = False
    result = CandidateResult(
        real_poles=real_poles,
        complex_pole_pairs=complex_pairs,
        model_order=int(VectorFitting.get_model_order(vf.poles)),
        rms_error=error,
        stable=stable,
        passive=passive,
    )
    return vf, result


def _select_fit(network: rf.Network, target_error: float) -> tuple[VectorFitting, list[CandidateResult], list[str]]:
    fits: list[tuple[VectorFitting, CandidateResult]] = []
    warnings: list[str] = []
    for real_poles, complex_pairs in DEFAULT_CANDIDATES:
        try:
            fits.append(_fit_candidate(network, real_poles, complex_pairs))
        except Exception as exc:
            warnings.append(f"후보 {real_poles}+{complex_pairs}쌍 피팅 실패: {exc}")
    if not fits:
        raise AnalysisError("모든 Vector Fitting 후보가 실패했습니다.")
    eligible = [item for item in fits if item[1].stable and item[1].passive and item[1].rms_error <= target_error]
    if eligible:
        chosen = min(eligible, key=lambda item: (item[1].model_order, item[1].rms_error))
    else:
        stable = [item for item in fits if item[1].stable]
        if not stable:
            raise AnalysisError("안정적인 후보 모델이 없어 SPICE 생성을 중단했습니다.")
        accurate = [item for item in stable if item[1].rms_error <= target_error]
        chosen = min(accurate, key=lambda item: (item[1].model_order, item[1].rms_error)) if accurate else min(stable, key=lambda item: item[1].rms_error)
        warnings.append("목표 오차와 수동성을 동시에 만족한 후보가 없습니다. 목표 오차 내 최소 차수의 안정 모델을 우선 선택하고, 해당 후보가 없으면 최소 오차를 사용합니다.")
    vf, selected = chosen
    if not selected.passive:
        try:
            passivated = copy.deepcopy(vf)
            passivated.passivity_enforce(n_samples=400, f_max=float(network.f[-1]), parameter_type="s", preserve_dc=True)
            passivated_error = float(passivated.get_rms_error(parameter_type="s"))
            acceptable_error = max(target_error, selected.rms_error * 5.0)
            if passivated.is_passive(parameter_type="s") and passivated_error <= acceptable_error:
                vf = passivated
            else:
                warnings.append("수동성 보정 결과가 수동성 또는 허용 오차 조건을 충족하지 못해 원래의 안정 피팅 모델을 유지합니다.")
        except Exception as exc:
            warnings.append(f"수동성 보정을 완료하지 못했습니다: {exc}")
    return vf, [item[1] for item in fits], warnings


def _downsample_indices(count: int) -> np.ndarray:
    if count <= MAX_POINTS_FOR_PLOT:
        return np.arange(count)
    return np.unique(np.linspace(0, count - 1, MAX_POINTS_FOR_PLOT).astype(int))


def _db(values: np.ndarray) -> np.ndarray:
    return 20.0 * np.log10(np.maximum(np.abs(values), 1e-15))


def original_sparameter_traces(network: rf.Network) -> list[dict]:
    """Return downsampled original S-parameters for the pre-fit inspection plot."""
    idx = _downsample_indices(len(network.f))
    pairs = [(i, j, f"S{i+1}{j+1}") for j in range(network.nports) for i in range(network.nports)]
    return [{
        "frequency_hz": network.f[idx].astype(float).tolist(),
        "magnitude_db": _db(network.s[idx, i, j]).astype(float).tolist(),
        "phase_deg": np.angle(network.s[idx, i, j], deg=True).astype(float).tolist(),
        "label": label,
    } for i, j, label in pairs]


def _mixed_mode_network(network: rf.Network, pairing: str) -> rf.Network:
    if pairing == "adjacent":
        order = [0, 1, 2, 3]
    elif pairing == "split":
        order = [0, 2, 1, 3]
    else:
        raise AnalysisError("4-port pairing은 adjacent 또는 split이어야 합니다.")
    reordered = rf.Network(
        f=network.f,
        s=network.s[:, order, :][:, :, order],
        z0=network.z0[:, order],
        f_unit="hz",
    )
    reordered.se2gmm(p=2)
    return reordered


def _make_traces(network: rf.Network, vf: VectorFitting, pairing: str) -> list[TraceData]:
    idx = _downsample_indices(len(network.f))
    pairs = [(i, j, f"S{i+1}{j+1}") for j in range(network.nports) for i in range(network.nports)]
    traces: list[TraceData] = []
    for i, j, label in pairs:
        fitted = vf.get_model_response(i, j, network.f)
        traces.append(TraceData(
            frequency_hz=network.f[idx].astype(float).tolist(),
            original_db=_db(network.s[idx, i, j]).astype(float).tolist(),
            fitted_db=_db(fitted[idx]).astype(float).tolist(),
            label=label,
        ))
    if network.nports == 4:
        fitted_s = np.empty_like(network.s)
        for i in range(4):
            for j in range(4):
                fitted_s[:, i, j] = vf.get_model_response(i, j, network.f)
        fitted_network = rf.Network(f=network.f, s=fitted_s, z0=network.z0, f_unit="hz")
        original_mm = _mixed_mode_network(network, pairing)
        fitted_mm = _mixed_mode_network(fitted_network, pairing)
        mixed_pairs = [
            (1, 0, "Sdd21"),
            (3, 2, "Scc21"),
            (1, 2, "Sdc21"),
            (3, 0, "Scd21"),
        ]
        for i, j, label in mixed_pairs:
            traces.append(TraceData(
                frequency_hz=network.f[idx].astype(float).tolist(),
                original_db=_db(original_mm.s[idx, i, j]).astype(float).tolist(),
                fitted_db=_db(fitted_mm.s[idx, i, j]).astype(float).tolist(),
                label=label,
            ))
    return traces


def _write_spice(vf: VectorFitting) -> str:
    # Give the exporter its own globals; never replace process-wide builtins.open.
    target = _NonClosingStringIO()
    def memory_open(_file, mode="r", *args, **kwargs):
        if str(_file) == "memory.sp" and "w" in mode:
            return target
        raise AnalysisError("SPICE exporter requested an unexpected file operation.")
    method = VectorFitting.write_spice_subcircuit_s
    exporter = types.FunctionType(method.__code__, {**method.__globals__, "open": memory_open}, method.__name__, method.__defaults__, method.__closure__)
    exporter.__kwdefaults__ = method.__kwdefaults__
    exporter(vf, "memory.sp", fitted_model_name="EMXAI_SPARAM_MODEL", create_reference_pins=False)
    return target.getvalue()


def analyze(data: bytes, filename: str, target_error: float = 0.02, pairing: str = "split") -> FittingResult:
    if not math.isfinite(target_error) or not 1e-5 <= target_error <= 0.25:
        raise AnalysisError("목표 RMS 오차는 0.00001~0.25 범위여야 합니다.")
    network = load_network(data, filename)
    if pairing not in {"split", "adjacent"}:
        raise AnalysisError("지원하지 않는 differential pair 설정입니다.")
    if not np.allclose(network.z0.imag, 0, atol=1e-9) or not np.allclose(network.z0, network.z0[0:1], rtol=1e-9, atol=1e-9):
        raise AnalysisError("SPICE 생성에는 주파수에 무관한 실수 기준 임피던스가 필요합니다. 먼저 renormalization을 수행하십시오.")
    input_checks, warnings = check_input(network)
    if network.nports == 4:
        pair_label = "1-3 / 2-4" if pairing == "split" else "1-2 / 3-4"
        warnings.append(f"Mixed-mode 변환은 differential pair {pair_label} 포트 조합을 사용했습니다.")
    vf, candidates, fit_warnings = _select_fit(network, target_error)
    warnings.extend(fit_warnings)
    stable = _is_stable(vf)
    try:
        passive = bool(vf.is_passive(parameter_type="s"))
    except Exception:
        passive = False
    rms = float(vf.get_rms_error(parameter_type="s"))
    output_checks = [
        CheckResult(name="pole_stability", status=_status(stable), value=stable, summary="모든 pole의 실수부가 0보다 작습니다." if stable else "우반평면 pole이 남아 있습니다."),
        CheckResult(name="fitted_passivity", status=_status(passive), value=passive, summary="피팅 모델이 수동성 검사를 통과했습니다." if passive else "피팅 모델의 수동성 위반을 해결하지 못했습니다."),
        CheckResult(name="fit_accuracy", status=_status(rms <= target_error, warning=True), value=rms, summary=f"Complex RMS error = {rms:.6g}"),
    ]
    return FittingResult(
        network=network,
        vector_fit=vf,
        candidates=candidates,
        input_checks=input_checks,
        output_checks=output_checks,
        traces=_make_traces(network, vf, pairing),
        warnings=warnings,
        spice_text=_write_spice(vf),
    )

