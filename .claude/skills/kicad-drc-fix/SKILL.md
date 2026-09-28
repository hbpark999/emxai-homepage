---
name: kicad-drc-fix
description: 외부 DRC 결과(Fail)를 받아 KiCad 보드를 고치는 절차. 사용 시점 - (1) cap_drc_result.json이나 KiCad DRC 리포트를 받아 "이 Fail을 고쳐줘"라는 요청을 받았을 때, (2) AC Cap 패드 아래 void(CAP-10) 같은 규칙 위반을 .kicad_pcb에 반영해야 할 때, (3) 수정 후 재검증을 안내해야 할 때. EMxAI KiCad MCP(/api/kicad/mcp)의 drc_* / fix_* 도구와 함께 쓴다.
---

# 외부 DRC 결과로 KiCad 보드 고치기

## 역할 경계 — 먼저 확인할 것

| 누가 | 무엇을 |
|---|---|
| 외부 DRC | Pass/Fail 판정. **절대 다시 판정하지 않는다** |
| 외부 DRC·Surrogate MCP | 어느 Fail을 어떤 템플릿·파라미터로 고칠지 판단 |
| **이 Skill(당신)** | 순서대로 도구를 부르고, 사람에게 묻고, 결과를 설명 |
| KiCad MCP | 좌표·형상 생성, 범위 검증, 승인 조건 강제, 수정본 텍스트 생성 |
| 사람 | 승인과 저장 방식 결정 |

당신이 판정하거나 치수를 지어내지 않는다. 값이 부족하면 부족하다고 말한다.

## 진행 순서

### 1. DRC 결과 읽기

`drc_import`에 외부 결과 JSON을 그대로 넘긴다. `format`은 `auto`로 둔다.

응답의 `integrity.verdict_unchanged`가 true인지 확인하고, Fail 개수를 사람에게 알린다.
판정값(status·measured·evidence)은 절대 바꿔 말하지 않는다.

### 2. Fail 위치 찾기

`drc_locate_fail`에 `fails`와 `.kicad_pcb` 텍스트를 넘긴다.
- `geometry_json`이 있으면 함께 넘겨 좌표를 교차 검증한다. `cross_check.match`가 false면 그 사실을 먼저 사람에게 알리고 진행을 멈춘다.
- evidence에 층이 없으면 `default_layers`(예: `["In1.Cu","In2.Cu"]`)를 준다.
- `unmapped`가 있으면 사유를 그대로 전한다. 임의로 끼워 맞추지 않는다.

### 3. 수정 지시 받기

무엇을 어떻게 고칠지는 **외부 DRC·Surrogate MCP**가 정한다. 그 결과를 `directive`로 옮긴다.

```json
{
  "rule_id": "CAP-10",
  "template_id": "cap_void_under_pad",
  "provider": "drc_mcp",
  "rationale": "CAP-10 Fail. AC Cap 패드 아래 내부 GND에 패드와 같은 크기의 void를 만든다.",
  "params": { "margin_mm": 0, "long_axis": "trace" },
  "targets": [{ "ref": "C1", "pin": "1", "layer": "In1.Cu", "drc_item_id": "CAP-10#C1.1 · In1.Cu: 0%" }]
}
```

- `targets`는 2단계의 `located`를 그대로 옮긴다.
- 외부 판단이 없으면 `provider: "rule_table"`로 두고 템플릿 기본값을 쓰되, **기본값을 썼다는 사실을 사람에게 말한다**.
- 사용할 수 있는 템플릿과 기본값은 `fix_templates`로 확인한다.

### 4. 미리보기와 승인 요청

`fix_preview`를 부른다. 파일은 바뀌지 않는다. 응답을 사람에게 이렇게 정리해 보여준다.

1. 변경표 — 항목 / 층 / 객체 / 수정 전 / 수정 후 / provider
2. `rationale`(판단 근거)와 `predicted`·`confidence`가 있으면 함께
3. `warnings` 전부 — 특히 템플릿 기본값 사용, 방향 fallback, 중복 zone 경고
4. `svg_before` / `svg_after` 두 장
5. 방향 근거 — 각 변경의 `orientation.note` (예: "net TX1_P의 trace 방향(세로)을 void 긴 변으로 삼았다")

그리고 **반드시 두 가지를 묻는다.**

> ① 이 수정안을 적용할까요? (승인 / 수정 요청 / 취소)
>
> ② 저장 방식을 선택해 주세요.
> **A) 새 파일로 저장** (권장) — 기존 파일은 그대로 두고 `<제안된 new_file 이름>`으로 저장
> **B) 기존 파일 수정** — 적용 직전 `<제안된 backup 이름>`으로 백업을 만든 뒤 덮어쓰기

파일 이름은 응답의 `gate.suggested_file_names`를 그대로 쓴다.
사람이 답하기 전에는 `fix_apply`를 부르지 않는다. "승인하시면 진행하겠습니다" 같은 말로 넘어가지 않는다.

### 5. 적용

승인을 받으면 `fix_apply`에 `plan`(preview 응답의 plan 그대로), `kicad_pcb`(preview 때와 같은 텍스트), `approved: true`, `save_mode`를 넘긴다.

- `applied: false`가 오면 `reasons`를 그대로 전한다. 대표적 사유는 승인 누락, save_mode 누락, **preview 이후 원본이 바뀜**이다. 마지막 경우는 2단계부터 다시 한다.
- `write[]`의 파일을 **순서대로** 저장한다. overwrite면 `write_order`대로 백업을 먼저 저장한 뒤 원본을 덮어쓴다.
- 파일 저장은 MCP가 하지 않는다. 파일 접근 권한이 있는 쪽(당신 또는 사람)이 한다. 권한이 없으면 내용을 보여주고 사람이 저장하게 한다.

### 6. 재검증 안내

적용 후 사람에게 이 절차를 안내한다. MCP는 재판정하지 않는다.

1. KiCad에서 수정본 `.kicad_pcb`를 연다
2. 보드 편집기에서 **Zone Refill**을 실행한다 (단축키 `B`) — keepout이 실제 pour에 반영된다
3. 파일을 저장한다
4. 외부 DRC를 다시 실행한다 (예: `run_cap_drc.mjs`, 또는 KiCad DRC 리포트 내보내기)
5. 새 결과를 `drc_import`로 읽고, 이전 결과와 함께 `fix_verify_compare`에 넘긴다

비교표를 보여줄 때도 판정은 외부 결과 그대로 전한다. "고쳐졌습니다"라고 단정하지 말고 "외부 DRC 결과가 Fail → Pass로 바뀌었습니다"처럼 출처를 밝힌다.

## 항상 덧붙일 고지

결과를 보고할 때 한 번은 이 취지를 말한다.

> 교육용 도구입니다. 실제 KiCad DRC, 제조 검증, SI/EM 해석을 대체하지 않습니다. 판정은 외부 DRC 결과를 그대로 전달한 것이며 이 도구가 다시 판정하지 않습니다.

## 하지 말 것

- 판정값(status·measured·evidence)을 바꾸거나 반올림해 말하기
- 부족한 치수를 추정해 채우기 — 부족하면 부족하다고 말한다
- 승인 전에 `fix_apply` 부르기
- 저장 방식을 묻지 않고 기본값으로 진행하기
- 자유 폴리곤 좌표를 만들어 보내기 — 형상은 템플릿만 만든다
- `unmapped` 항목을 임의로 대상에 끼워 넣기

## 참고

- 서버: `https://www.emxai.net/api/kicad/mcp`
- 도구: `drc_import` · `drc_locate_fail` · `fix_templates` · `fix_preview` · `fix_apply` · `fix_verify_compare`
- 서버는 상태를 저장하지 않는다. `plan`은 당신이 대화에 들고 있다가 `fix_apply`에 그대로 돌려준다.
- 무결성은 `plan.source.sha256`으로 확인한다. 원본 텍스트를 중간에 손대면 적용이 거부된다.
