# CE-CMF-Filter-PCB Sim — desktop snapshot

최신 모델: **80-case-2026-09-09**, GPR/PCA8, 150 kHz–30 MHz, 201점 CM/DM 크기.
현재 GUI와 대표 4포트 SPICE, PCB B2 S14P, RLC 예제를 이 폴더에 독립 복사했다.
환경 키, HFSS 프로젝트, 대용량 solver/RAW 결과는 포함하지 않았다. `snapshot.json`에서 원본 파일 hash를 확인한다.

## Windows에서 실행

Python 3.13 (Tkinter 포함), LTspice를 준비하고 이 폴더에서 실행한다.

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python scripts/launch_circuit_gui.py
```

LTspice 기본 경로는 `C:\Program Files\ADI\LTspice\LTspice.exe`다.
다르면 `src/netlist.py`와 `mvp/cmc_surrogate_gui.py`의 `LTSPICE` 경로를 수정한다.
특성 예측·기본 예제 해석에는 HFSS나 Claude API 키가 필요하지 않다.
`config.py`에 남은 기존 PC의 HFSS/환경파일 경로는 이 데모에서 사용하지 않으며 새 해석 자동화 전에 재설정한다.

`scripts/verify_circuit_gui.py`는 실제 LTspice 6건을 실행한다. 먼저 `reports/charts` 폴더를 만든다.
모델은 포함된 신뢰 가능한 pickle만 읽는다. 사용자 pickle 업로드를 허용하지 않는다.

## 범위

- 특성 예측, SPICE 예제, PCB/필터 RLC 편집, 회로도, 대표 모델 CE 고조파 RMS 비교.
- 현재 대표 SPICE는 1종이며 임의 surrogate 입력의 위상/4포트 모델이 아니다.
- SPICE 변환 CM 최대 1.814%, DM 0.058%는 검사 지점의 변환 오차이며 surrogate 일반화 오차가 아니다.
- QP/AVG 검파·CE 인증, DC/시간영역 검증 완료로 표현하지 않는다.
- 예제 `.cir`는 단독 실행 전체 netlist가 아니라 앱이 CMC/LISN/소스를 붙이는 회로 조각이다.

웹 작업은 저장소 루트 `docs/ce-cmf-filter-pcb-sim-handoff.md`를 따른다.
후속 8~12건 해석·재학습·평가가 필요하며 이번 버전에는 포함하지 않았다.
