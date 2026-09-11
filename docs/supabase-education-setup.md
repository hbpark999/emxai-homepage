# Supabase 교육 실시간 기능 설정

## 1. 프로젝트와 스키마 생성

Supabase 프로젝트를 만든 뒤 SQL Editor에서 아래 파일 전체를 실행합니다.

`supabase/migrations/202609110001_education_live.sql`

이 SQL은 카운터, 타이머, HTML 슬롯, 학생별 완료 기록, 캡처 메타데이터와
비공개 `education-captures` Storage 버킷을 만듭니다.

## 2. 환경변수 설정

Supabase 프로젝트의 Settings > API에서 값을 확인해 로컬 `.env.local`과 배포
환경에 설정합니다.

```env
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=서버용_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=브라우저용_publishable_key
```

`SUPABASE_SERVICE_ROLE_KEY`는 모든 보안 정책을 우회할 수 있으므로 브라우저 코드,
Git 저장소 또는 학생에게 절대 공개하지 않습니다. 쓰기와 이미지 다운로드는 이
프로젝트의 Next.js Route Handler가 서버에서 수행합니다.

## 3. 배포와 확인

환경변수를 설정한 뒤 다시 빌드·배포합니다. `NEXT_PUBLIC_` 값은 빌드 시 브라우저
번들에 들어가므로 값을 바꾼 경우 반드시 재배포해야 합니다.

확인 순서:

1. 서로 다른 두 브라우저에서 수강생 화면을 엽니다.
2. 작업완료가 회차당 한 번만 증가하는지 확인합니다.
3. 타이머 설정 시 두 화면이 즉시 갱신되는지 확인합니다.
4. HTML 슬롯을 점유하고 코드 및 캡처 이미지를 올립니다.
5. 다른 화면에 코드와 이미지가 표시되는지 확인합니다.
6. 문의를 제출하고 Notion 저장과 이메일 도착을 각각 확인합니다.

Supabase 환경변수를 넣기 전에는 실시간 교육 API가 설정되지 않은 상태로 응답합니다.
문의와 Notion 게시판은 기존 환경변수로 계속 동작합니다.
