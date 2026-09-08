from __future__ import annotations

from pydantic import BaseModel, Field


class CheckResult(BaseModel):
    name: str
    status: str
    summary: str
    value: float | bool | str | None = None


class CandidateResult(BaseModel):
    real_poles: int
    complex_pole_pairs: int
    model_order: int
    rms_error: float
    stable: bool
    passive: bool


class TraceData(BaseModel):
    frequency_hz: list[float]
    original_db: list[float]
    fitted_db: list[float]
    label: str


class AnalysisResponse(BaseModel):
    filename: str
    ports: int
    points: int
    frequency_start_hz: float
    frequency_stop_hz: float
    reference_impedance_ohm: float
    input_checks: list[CheckResult]
    candidates: list[CandidateResult]
    selected_model_order: int
    fitted_rms_error: float
    output_checks: list[CheckResult]
    traces: list[TraceData]
    spice_filename: str
    spice_subcircuit: str
    warnings: list[str] = Field(default_factory=list)


