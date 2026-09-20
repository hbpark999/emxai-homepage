"""HFSS-trained PDN surrogate inference service for Cloud Run.

The IC-pin impedance is evaluated by terminating the predicted complex two-port
Z matrix.  The PCB interconnect is therefore not replaced by a lumped R/L/C
network.  The separate educational De-cap curve is intentionally a series
C + ESR + ESL + Lpath definition.
"""
from __future__ import annotations

import hmac
import json
import math
import os
from pathlib import Path

import numpy as np
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator


ROOT = Path(__file__).resolve().parent
MODEL = json.loads((ROOT / "models/frequency_surrogate.json").read_text(encoding="utf-8"))
ACCURACY = json.loads((ROOT / "models/p90_accuracy.json").read_text(encoding="utf-8"))
FREQUENCY_HZ = np.asarray(MODEL["frequency_hz"], dtype=float)
FACTORS = MODEL["factors"]
API_TOKEN = os.getenv("PDN_API_TOKEN", "")

app = FastAPI(
    title="EMxAI PDN De-cap Surrogate",
    version="1.0.0",
    description="HFSS-trained complex two-port surrogate with exact De-cap termination.",
)

origins = [
    item.strip()
    for item in os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:3000,https://www.emxai.net"
    ).split(",")
    if item.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


def require_api_token(authorization: str | None = Header(default=None)) -> None:
    """Require the shared server token when it is configured in Cloud Run."""
    if not API_TOKEN:
        return
    expected = f"Bearer {API_TOKEN}"
    if authorization is None or not hmac.compare_digest(authorization, expected):
        raise HTTPException(status_code=401, detail="Invalid API token")


class Geometry(BaseModel):
    d_mm: float = Field(default=10.0, ge=2.0, le=24.0, allow_inf_nan=False)
    route_len_mm: float = Field(default=1.0, ge=0.1, le=4.0, allow_inf_nan=False)
    h_top_mm: float = Field(default=0.3, ge=0.1, le=1.0, allow_inf_nan=False)
    h_pg_mm: float = Field(default=0.2, ge=0.05, le=0.8, allow_inf_nan=False)

    @model_validator(mode="after")
    def check_stackup(self) -> "Geometry":
        if self.h_top_mm + self.h_pg_mm > 1.36 + 1e-12:
            raise ValueError("h_top_mm + h_pg_mm must be <= 1.36 mm")
        return self


class Component(BaseModel):
    capacitance_nf: float = Field(default=100.0, gt=0.0, allow_inf_nan=False)
    esr_mohm: float = Field(default=30.0, ge=0.0, allow_inf_nan=False)
    esl_nh: float = Field(default=0.5, ge=0.0, allow_inf_nan=False)


class PredictionRequest(BaseModel):
    geometry: Geometry = Field(default_factory=Geometry)
    component: Component = Field(default_factory=Component)
    include_curve: bool = True


class DistanceComparisonRequest(BaseModel):
    d_a_mm: float = Field(default=2.0, ge=2.0, le=24.0, allow_inf_nan=False)
    d_b_mm: float = Field(default=10.0, ge=2.0, le=24.0, allow_inf_nan=False)
    route_len_mm: float = Field(default=1.0, ge=0.1, le=4.0, allow_inf_nan=False)
    h_top_mm: float = Field(default=0.3, ge=0.1, le=1.0, allow_inf_nan=False)
    h_pg_mm: float = Field(default=0.2, ge=0.05, le=0.8, allow_inf_nan=False)
    component: Component = Field(default_factory=Component)
    include_curve: bool = False

    @model_validator(mode="after")
    def check_stackup(self) -> "DistanceComparisonRequest":
        if self.h_top_mm + self.h_pg_mm > 1.36 + 1e-12:
            raise ValueError("h_top_mm + h_pg_mm must be <= 1.36 mm")
        return self


def predict_twoport(geometry: Geometry) -> np.ndarray:
    values = geometry.model_dump()
    x = (
        np.log([values[name] for name in FACTORS])
        - np.asarray(MODEL["input_log_offset"])
    ) / np.asarray(MODEL["input_log_scale"])
    x_train = np.asarray(MODEL["x_train"])
    encoded = []
    for name in ["ar_asinh", "al_asinh", "br_asinh", "bl_asinh", "cr_asinh", "ci_scaled"]:
        channel = MODEL["channels"][name]
        length_scales = np.asarray(channel["length_scales"])
        distance = np.sum(((x_train - x) / length_scales) ** 2, axis=1)
        kernel = float(channel["amplitude"]) * np.exp(-0.5 * distance)
        normalized = kernel @ np.asarray(channel["alpha"])
        encoded.append(
            np.asarray(channel["y_mean"]) + np.asarray(channel["y_std"]) * normalized
        )

    v = np.asarray(encoded)
    omega = 2 * np.pi * FREQUENCY_HZ
    a = 0.01 * np.sinh(v[0]) + 1j * np.sinh(v[1]) * 1e-9 * omega
    b = 0.01 * np.sinh(v[2]) + 1j * np.sinh(v[3]) * 1e-9 * omega
    c = np.sinh(v[4]) * 1e8 / omega + 1j * v[5] * 1e9 / omega
    z = np.empty((len(FREQUENCY_HZ), 2, 2), dtype=complex)
    z[:, 0, 0], z[:, 1, 1] = a + c, b + c
    z[:, 0, 1] = z[:, 1, 0] = c

    # Same sample-wise reciprocal passivity projection used while validating
    # the shipped browser model.
    eigenvalues, eigenvectors = np.linalg.eigh(z.real)
    projected = np.einsum(
        "fij,fj,fkj->fik", eigenvectors, np.maximum(eigenvalues, 1e-10), eigenvectors
    )
    return projected + 1j * z.imag


def component_impedance(component: Component) -> np.ndarray:
    omega = 2 * np.pi * FREQUENCY_HZ
    return component.esr_mohm * 1e-3 + 1j * (
        omega * component.esl_nh * 1e-9
        - 1 / (omega * component.capacitance_nf * 1e-9)
    )


def terminate_at_ic(z: np.ndarray, z_cap: np.ndarray) -> np.ndarray:
    # Exact two-port termination in T coordinates, algebraically identical to
    # Z22 - Z21*Z12/(Z11 + Zcap), with lower cancellation error.
    c = z[:, 1, 0]
    a = z[:, 0, 0] - c
    b = z[:, 1, 1] - c
    return b + c * (a + z_cap) / (c + a + z_cap)


def lpath_henry(z: np.ndarray) -> float:
    index = int(np.argmin(np.abs(FREQUENCY_HZ - 1e7)))
    loop = z[index, 0, 0] + z[index, 1, 1] - z[index, 0, 1] - z[index, 1, 0]
    return float(loop.imag / (2 * np.pi * FREQUENCY_HZ[index]))


def interpolate_complex(values: np.ndarray, target_hz: float) -> complex:
    log_frequency = np.log10(FREQUENCY_HZ)
    x = math.log10(target_hz)
    return complex(
        np.interp(x, log_frequency, values.real),
        np.interp(x, log_frequency, values.imag),
    )


def complex_record(value: complex) -> dict[str, float]:
    return {
        "real_ohm": float(value.real),
        "imag_ohm": float(value.imag),
        "magnitude_ohm": float(abs(value)),
    }


def curve_record(values: np.ndarray) -> dict[str, list[float]]:
    return {
        "frequency_hz": FREQUENCY_HZ.tolist(),
        "real_ohm": values.real.tolist(),
        "imag_ohm": values.imag.tolist(),
        "magnitude_ohm": np.abs(values).tolist(),
    }


def prediction_payload(request: PredictionRequest) -> dict:
    z = predict_twoport(request.geometry)
    z_cap = component_impedance(request.component)
    z_ic = terminate_at_ic(z, z_cap)
    lpath = lpath_henry(z)
    omega = 2 * np.pi * FREQUENCY_HZ
    c_f = request.component.capacitance_nf * 1e-9
    educational = request.component.esr_mohm * 1e-3 + 1j * (
        omega * (request.component.esl_nh * 1e-9 + lpath) - 1 / (omega * c_f)
    )
    total_l = request.component.esl_nh * 1e-9 + lpath
    resonance_hz = 1 / (2 * np.pi * math.sqrt(c_f * total_l)) if total_l > 0 else None
    sampled_hz = [1e5, 1e6, 1e7, 1e8, 1e9]
    result = {
        "model": {
            "kind": MODEL["kind"],
            "training_cases": len(MODEL["training_cases"]),
            "validation_cases": len(MODEL["validation_cases"]),
            "scope": "HFSS-trained interpolation; this response is not a new HFSS solve.",
        },
        "geometry": request.geometry.model_dump(),
        "component": request.component.model_dump(),
        "lpath_nh": lpath * 1e9,
        "educational_decap": {
            "definition": "series C + ESR + ESL + Lpath(d, route, stackup)",
            "resonance_hz": resonance_hz,
            "samples": {
                str(int(f)): complex_record(interpolate_complex(educational, f))
                for f in sampled_hz
            },
        },
        "ic_pin_impedance": {
            "definition": "exact termination of the HFSS-trained complex two-port Z(f)",
            "equation": "Z22 - Z21*Z12/(Z11 + Zcap)",
            "samples": {
                str(int(f)): complex_record(interpolate_complex(z_ic, f)) for f in sampled_hz
            },
        },
        "accuracy": ACCURACY,
    }
    if request.include_curve:
        result["educational_decap"]["curve"] = curve_record(educational)
        result["ic_pin_impedance"]["curve"] = curve_record(z_ic)
    return result


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": app.version}


@app.get("/v1/model-info")
def model_info() -> dict:
    return {
        "kind": MODEL["kind"],
        "factors": FACTORS,
        "ranges": MODEL["ranges"],
        "sampled_ranges": MODEL["sampled_ranges"],
        "frequency_hz": [FREQUENCY_HZ[0], FREQUENCY_HZ[-1]],
        "frequency_points": len(FREQUENCY_HZ),
        "training_cases": len(MODEL["training_cases"]),
        "validation_cases": len(MODEL["validation_cases"]),
        "accuracy": ACCURACY,
        "passivity": MODEL["passivity"],
        "note": MODEL["note"],
    }


@app.post("/v1/predict", dependencies=[Depends(require_api_token)])
def predict(request: PredictionRequest) -> dict:
    return prediction_payload(request)


@app.post("/v1/compare-distance", dependencies=[Depends(require_api_token)])
def compare_distance(request: DistanceComparisonRequest) -> dict:
    common = {
        "route_len_mm": request.route_len_mm,
        "h_top_mm": request.h_top_mm,
        "h_pg_mm": request.h_pg_mm,
    }
    a = prediction_payload(
        PredictionRequest(
            geometry=Geometry(d_mm=request.d_a_mm, **common),
            component=request.component,
            include_curve=request.include_curve,
        )
    )
    b = prediction_payload(
        PredictionRequest(
            geometry=Geometry(d_mm=request.d_b_mm, **common),
            component=request.component,
            include_curve=request.include_curve,
        )
    )
    return {
        "case_a": a,
        "case_b": b,
        "difference": {
            "lpath_nh": b["lpath_nh"] - a["lpath_nh"],
            "interpretation": "case_b minus case_a; IC Z(f) remains the separately terminated HFSS-trained response.",
        },
    }
