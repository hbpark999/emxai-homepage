# CE-CMF-Filter-PCB Sim — 다른 PC 인계

## 최신 파일과 경로

| 용도 | 경로 |
|---|---|
| Solutions 페이지 | `src/app/solution/ce-cmf-filter-pcb-sim/page.tsx` |
| 웹 입력·예측 그래프·SPICE 다운로드 | `src/components/web-tools/cmc-demo.tsx` |
| Vercel → Cloud Run proxy | `src/app/api/cmc/predict/route.ts` |
| Cloud Run FastAPI | `services/ce-cmf-filter-pcb-sim/main.py` |
| 모델·모델 카드 | `services/ce-cmf-filter-pcb-sim/models/` |
| 컨테이너 | `services/ce-cmf-filter-pcb-sim/Dockerfile`, `requirements.txt` |
| 최신 데스크톱/회로 실행 snapshot | `projects/ce-cmf-filter-pcb-sim/` |
| 대표 다운로드/회로도 | `public/ce-cmf/` |

실제 URL은 기존 홈페이지 라우팅에 맞춘 `/solution/ce-cmf-filter-pcb-sim`이다.
`/solution` 목록에서 접근한다. 이번 변경은 GitHub 인계이며 Cloud Run/Vercel production 배포를 실행하지 않는다.

## 다른 PC에서 시작

```powershell
git clone https://github.com/hbpark999/emxai-homepage.git
cd emxai-homepage
git switch feat/ce-cmf-filter-pcb-sim
npm ci
npm run dev
```

Python 3.13 환경에서:

```powershell
cd services/ce-cmf-filter-pcb-sim
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn main:app --port 8080
```

홈페이지 루트 `.env.local`에 `CMC_API_URL=http://127.0.0.1:8080`을 넣고 Next 개발 서버를 다시 시작한다. `/solution/ce-cmf-filter-pcb-sim`에서 예측 버튼을 확인한다. 환경파일은 커밋하지 않는다.

## Cloud Run / Vercel 연결 (다음 PC에서 실행)

`services/ce-cmf-filter-pcb-sim`을 build context로 사용한다. 기존 S-parameter 서비스의 `services/sparam-modeler`와 같은 서비스 디렉터리 규칙을 따른다. 기본 python:3.13-slim과 학습 시 패키지 버전을 맞췄다. 첫 Docker build/Cloud Run 배포는 별도 검증이 필요하다.

```powershell
gcloud run deploy ce-cmf-filter-pcb-sim --source services/ce-cmf-filter-pcb-sim --region asia-northeast3 --allow-unauthenticated --memory 1Gi --cpu 1 --concurrency 4 --max-instances 2
```

위 명령은 인증된 GCP 프로젝트 및 비용 설정 확인 후 실행한다. 예제는 공개 예측 API다. 운영에 접근 제한이 필요하면 private Cloud Run 인증과 Vercel 토큰 교환을 별도로 구현한다. API URL만 설정하는 현재 proxy는 private IAM 인증을 구현하지 않는다.

Vercel 프로젝트 환경변수 `CMC_API_URL=https://배포된-서비스.run.app`를 설정하고 재배포한다. 브라우저는 같은 도메인 `/api/cmc/predict`를 사용하므로 Cloud Run CORS를 직접 열 필요는 없다. API 미설정 시 페이지가 명시적인 연결 전 메시지를 표시한다.

## 제공 범위와 남은 작업

웹은 자유 입력의 **크기 예측**과 **대표 SPICE 다운로드**를 구분한다. SPICE 다운로드는 현재 입력과 무관한 CMC-01이며 생성 완료로 가장하지 않는다. PCB 회로 재계산은 Windows 데스크톱 snapshot에서 가능하다. Cloud Run에서 LTspice를 실행하는 코드는 없다.

데스크톱 최신 기능을 보존했지만 웹의 3D 형상, PCB 편집, 서버 회로 계산·시간파형은 아직 이식하지 않았다. 추가 8~12건 학습은 제외했다. 다음 PC에서 같은 모델의 예측 일치, API 오류 표시, 모바일 레이아웃, 다운로드를 확인하고 공개한다.

모델 검증 기록은 확인군 4건 평균 상대오차 5.48%/P90 21.43%이며, 전체 정확도 보증으로 표현하지 않는다. 기존 holdout이 과거 AL 선정에 쓰인 이력은 모델 카드에 남겨둔다. 정적 ferrite·HFSS 기반 교육용 모델이다.

후속 8~12건 해석·재학습·평가가 필요합니다.
