# PDN De-cap HFSS Surrogate API

Cloud Run serves the numerical model; the Vercel homepage exposes it through
the remote MCP endpoint at `https://www.emxai.net/api/mcp`.

The two displayed impedances have different definitions:

- **Educational De-cap Z(f)**: series `C + ESR + ESL + Lpath`. `Lpath` is
  extracted at 10 MHz from the HFSS-trained complex two-port surrogate as
  `Im(Z11 + Z22 - Z12 - Z21) / (2*pi*f)` and therefore includes distance `d`.
- **IC-pin Z(f)**: exact termination of the HFSS-trained complex two-port using
  `Z22 - Z21*Z12/(Z11 + Zcap)`. No lumped PCB equivalent is substituted.

The model covers 100 kHz to 1 GHz and is an interpolation of completed HFSS
cases. An API prediction is not a new HFSS solve.

## Current Cloud Run deployment

- Project: `emxai-sparam-mvp`
- Region: `asia-northeast3`
- Service: `pdn-decap-surrogate`
- URL: `https://pdn-decap-surrogate-612006724841.asia-northeast3.run.app`
- Secret Manager secret: `pdn-api-token`

`GET /health` and `GET /v1/model-info` are public. Prediction routes require
the bearer token stored in Secret Manager and the matching Vercel environment
variable.

## Local run

```powershell
python -m pip install -r requirements.txt
$env:PDN_API_TOKEN = "local-development-token"
python -m uvicorn main:app --reload --port 8080
```

## Cloud Run deployment

Create an Artifact Registry repository and a Secret Manager secret named
`pdn-api-token`, then run from this directory:

```powershell
gcloud builds submit --tag asia-northeast3-docker.pkg.dev/PROJECT_ID/emxai/pdn-decap-surrogate
gcloud run deploy pdn-decap-surrogate `
  --image asia-northeast3-docker.pkg.dev/PROJECT_ID/emxai/pdn-decap-surrogate `
  --region asia-northeast3 `
  --allow-unauthenticated `
  --memory 1Gi `
  --cpu 1 `
  --max-instances 5 `
  --set-env-vars "ALLOWED_ORIGINS=https://www.emxai.net" `
  --set-secrets "PDN_API_TOKEN=pdn-api-token:latest"
```

`--allow-unauthenticated` permits the Vercel runtime to reach Cloud Run. The
application still requires the bearer token on prediction routes. Add these
server-only variables in Vercel for Preview and Production:

```text
PDN_SURROGATE_API_URL=https://YOUR-CLOUD-RUN-URL
PDN_SURROGATE_API_TOKEN=<same value as pdn-api-token>
```

Do not prefix the token with `NEXT_PUBLIC_`.
