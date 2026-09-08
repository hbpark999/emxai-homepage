# EMxAI S-parameter Modeler Cloud Run MVP

HFSS 또는 제조사 Touchstone `.s2p`/`.s4p` 파일을 검사하고 Vector Fitting 기반 SPICE subcircuit을 생성하는 교육용 MVP입니다.

## 현재 기능

- S2P/S4P 업로드와 기본 형식 검사
- reciprocity, passivity, 기준 임피던스 검사
- 유한 대역 impulse response 기반 causality 보조 지표
- 여러 pole 후보의 자동 Vector Fitting
- pole 안정성 및 피팅 모델 passivity 검사
- 필요한 경우 passivity enforcement 시도
- 원본과 fitted S-parameter 비교 그래프
- S4P 포트 pairing 선택과 Sdd21/Scc21/Sdc21/Scd21 비교
- LTspice/ngspice 호환 SPICE subcircuit 다운로드
- 업로드 파일을 영구 보관하지 않는 동기식 API

## 로컬 실행

```powershell
cd cloudrun-mvp
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8080
```

브라우저에서 `http://localhost:8080`을 엽니다. API 문서는 `http://localhost:8080/docs`입니다.

## 테스트

```powershell
python -m unittest discover -s tests -v
```

## Docker

```powershell
docker build -t emxai-sparameter-mvp .
docker run --rm -p 8080:8080 emxai-sparameter-mvp
```

## Cloud Run 배포

```powershell
gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT_ID/emxai/sparameter-mvp
gcloud run deploy emxai-sparameter-mvp `
  --image REGION-docker.pkg.dev/PROJECT_ID/emxai/sparameter-mvp `
  --region asia-northeast3 `
  --allow-unauthenticated `
  --memory 2Gi `
  --cpu 1 `
  --concurrency 1 `
  --max-instances 5 `
  --set-env-vars "ALLOWED_ORIGINS=https://www.emxai.net"
```

`PROJECT_ID`, `REGION`과 Artifact Registry 저장소는 실제 GCP 환경에 맞게 설정해야 합니다. 공개 배포 전에는 Cloud Armor 또는 애플리케이션 수준 rate limit을 추가하는 것을 권장합니다.

Google Cloud CLI가 준비된 Windows 환경에서는 배포 스크립트를 사용할 수 있습니다.

```powershell
.\scripts\deploy-cloudrun.ps1 -ProjectId "YOUR_PROJECT_ID"
```

## MVP 제한

- causality는 유한 대역 데이터에 대한 보조 지표이며 상용 도구의 광대역 인과성 보정을 대체하지 않습니다.
- 실제 ngspice netlist 재실행은 다음 단계에서 추가합니다. 현재는 rational model과 원본 S-parameter를 비교합니다.
- Cloud Run 로컬 파일시스템은 영속 저장소로 사용하지 않습니다.

