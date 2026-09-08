from __future__ import annotations

import os
import re
from pathlib import Path

import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.responses import Response
from starlette.concurrency import run_in_threadpool

from .analysis import AnalysisError, analyze, check_input, load_network, original_sparameter_traces
from .models import AnalysisResponse


MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(10 * 1024 * 1024)))
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

app = FastAPI(
    title="EMxAI S-parameter Modeler",
    version="0.3.0",
    description="Touchstone validity checks and passive SPICE macromodel generation.",
)

origins = [value.strip() for value in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",") if value.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": app.version}


@app.get("/", include_in_schema=False)
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.post("/api/inspect")
async def inspect_touchstone(file: UploadFile = File(...), checks: str = Form("reciprocity,passivity,causality_heuristic,reference_impedance")) -> dict:
    """Parse and inspect the measured/simulated Touchstone file before fitting."""
    filename = Path(file.filename or "upload.s2p").name
    if not re.fullmatch(r"[\w.()\- ]+\.s[24]p", filename, flags=re.IGNORECASE):
        raise HTTPException(status_code=400, detail="안전한 .s2p 또는 .s4p 파일명만 허용합니다.")
    data = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail=f"파일은 {MAX_UPLOAD_BYTES // (1024 * 1024)}MB 이하여야 합니다.")
    try:
        network = load_network(data, filename)
        selected = set(filter(None, checks.split(",")))
        if selected - {"reciprocity", "passivity", "causality_heuristic", "reference_impedance"}:
            raise AnalysisError("지원하지 않는 검사 항목입니다.")
        checks, warnings = check_input(network, selected)
    except AnalysisError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return {
        "filename": filename,
        "ports": network.nports,
        "points": len(network.f),
        "frequency_start_hz": float(network.f[0]),
        "frequency_stop_hz": float(network.f[-1]),
        "reference_impedance_ohm": float(np.mean(np.real(network.z0))),
        "input_checks": [item.model_dump() for item in checks],
        "traces": original_sparameter_traces(network),
        "warnings": warnings,
    }


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_touchstone(
    file: UploadFile = File(...),
    target_error: float = Form(0.02),
    pairing: str = Form("split"),
) -> AnalysisResponse:
    filename = Path(file.filename or "upload.s2p").name
    if not re.fullmatch(r"[\w.()\- ]+\.s[24]p", filename, flags=re.IGNORECASE):
        raise HTTPException(status_code=400, detail="안전한 .s2p 또는 .s4p 파일명만 허용합니다.")
    data = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail=f"파일은 {MAX_UPLOAD_BYTES // (1024 * 1024)}MB 이하여야 합니다.")
    try:
        result = await run_in_threadpool(analyze, data, filename, target_error=target_error, pairing=pairing)
    except AnalysisError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="분석을 완료하지 못했습니다. 파일 형식과 설정을 확인하십시오.") from exc

    network = result.network
    z0_mean = float(np.mean(np.real(network.z0)))
    selected_order = int(result.vector_fit.get_model_order(result.vector_fit.poles))
    rms = float(result.vector_fit.get_rms_error(parameter_type="s"))
    return AnalysisResponse(
        filename=filename,
        ports=network.nports,
        points=len(network.f),
        frequency_start_hz=float(network.f[0]),
        frequency_stop_hz=float(network.f[-1]),
        reference_impedance_ohm=z0_mean,
        input_checks=result.input_checks,
        candidates=result.candidates,
        selected_model_order=selected_order,
        fitted_rms_error=rms,
        output_checks=result.output_checks,
        traces=result.traces,
        spice_filename=f"{Path(filename).stem}_emxai_model.lib",
        spice_subcircuit=result.spice_text,
        warnings=result.warnings,
    )


@app.get("/api/example")
def example_touchstone() -> Response:
    """Synthetic series R-L fixture, not vendor or measured data."""
    lines = ["! EMxAI synthetic example: series 5 ohm + 22 nH; not measured", "# Hz S RI R 50"]
    for f in np.logspace(6, 9, 121):
        z = 5 + 1j * 2 * np.pi * f * 22e-9
        reflection, transmission = z / (100 + z), 100 / (100 + z)
        row = [f]
        for s in (reflection, transmission, transmission, reflection):
            row.extend([s.real, s.imag])
        lines.append(" ".join(f"{value:.12e}" for value in row))
    return Response("\n".join(lines), media_type="text/plain", headers={"Content-Disposition": 'attachment; filename="example_series_rl.s2p"'})

