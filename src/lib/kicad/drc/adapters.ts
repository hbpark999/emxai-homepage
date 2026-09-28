/**
 * drc/adapters.ts
 * 외부 DRC 산출물을 표준 DrcItem[]으로 옮기는 어댑터.
 *
 * 하는 일은 필드 이름을 맞추는 것뿐이다. status·measured·evidence 값은 손대지
 * 않는다(문자열을 숫자로 바꾸거나 반올림하지도 않는다). 어느 형식인지 모르면
 * 추측하지 말고 인식 실패를 돌려준다.
 */

import type { DrcItem } from "./schema";

export type DrcFormat = "cap_drc" | "kicad_json" | "generic";

type Json = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === "string" ? v : v === undefined || v === null ? "" : String(v));

function pick(obj: Json, keys: string[]): unknown {
  for (const k of keys) if (obj[k] !== undefined) return obj[k];
  return undefined;
}

/** 형식을 자동 판별한다. 확신이 없으면 generic으로 둔다. */
export function detectFormat(input: unknown): DrcFormat | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Json;
  if (Array.isArray(o.violations) && (o.$schema !== undefined || o.source !== undefined)) return "kicad_json";
  if (Array.isArray(o.checks) || Array.isArray(o.results) || Array.isArray(o.rules)) return "cap_drc";
  if (Array.isArray(o.items)) return "generic";
  return null;
}

/** EMxAI 규칙 DRC 산출물(cap_drc_result.json 계열). checks/results/rules 배열을 받는다. */
function fromCapDrc(input: Json, file?: string): DrcItem[] {
  const rows = (pick(input, ["checks", "results", "rules"]) as unknown[]) ?? [];
  const tool = str(pick(input, ["tool", "generator"]) ?? "external-drc");
  const out: DrcItem[] = [];

  rows.forEach((row, index) => {
    if (!row || typeof row !== "object") return;
    const r = row as Json;
    const rule_id = str(pick(r, ["rule_id", "rule", "id", "code"]) ?? `RULE-${index + 1}`);
    const status = pick(r, ["status", "result", "verdict"]);
    const measured = pick(r, ["measured", "value", "measurement", "actual"]);
    const details = pick(r, ["details", "evidences", "items", "points"]);

    // 한 규칙 안에 여러 지점이 있으면 지점마다 항목을 만든다.
    if (Array.isArray(details) && details.length) {
      details.forEach((d, j) => {
        const dd = (d && typeof d === "object" ? d : { evidence: d }) as Json;
        const evidence = str(pick(dd, ["evidence", "text", "label", "where"]) ?? d);
        out.push({
          rule_id,
          id: `${rule_id}#${evidence || j}`,
          status: str(pick(dd, ["status"]) ?? status),
          measured: pick(dd, ["measured", "value"]) ?? measured,
          evidence,
          source: { format: "cap_drc", tool, file },
          raw: d,
        });
      });
      return;
    }

    const evidence = str(pick(r, ["evidence", "message", "description", "where"]) ?? "");
    out.push({
      rule_id,
      id: `${rule_id}#${evidence || index}`,
      status: str(status),
      measured,
      evidence,
      source: { format: "cap_drc", tool, file },
      raw: row,
    });
  });

  return out;
}

/** KiCad가 내보낸 DRC JSON 리포트. violations 배열을 받는다. */
function fromKicadJson(input: Json, file?: string): DrcItem[] {
  const rows = (input.violations as unknown[]) ?? [];
  const out: DrcItem[] = [];

  rows.forEach((row, index) => {
    if (!row || typeof row !== "object") return;
    const r = row as Json;
    const rule_id = str(pick(r, ["type", "rule"]) ?? `VIOLATION-${index + 1}`);
    const description = str(r.description ?? "");
    const items = Array.isArray(r.items) ? (r.items as Json[]) : [];
    const where = items
      .map((it) => str(pick(it, ["description", "uuid"])))
      .filter(Boolean)
      .join(" / ");

    out.push({
      rule_id,
      id: `${rule_id}#${index + 1}`,
      // KiCad는 severity로 심각도를 준다. 판정 문자열을 그대로 옮긴다.
      status: str(pick(r, ["severity", "status"]) ?? ""),
      measured: pick(r, ["measured", "value"]),
      evidence: [description, where].filter(Boolean).join(" · "),
      source: { format: "kicad_json", tool: "kicad-drc", file },
      raw: row,
    });
  });

  return out;
}

/** 이미 표준 형태(items 배열)로 들어온 경우. 필드만 확인하고 그대로 둔다. */
function fromGeneric(input: Json, file?: string): DrcItem[] {
  const rows = (input.items as unknown[]) ?? [];
  return rows
    .filter((r): r is Json => Boolean(r) && typeof r === "object")
    .map((r, index) => ({
      rule_id: str(pick(r, ["rule_id", "rule"]) ?? `RULE-${index + 1}`),
      id: str(pick(r, ["id"]) ?? `ITEM-${index + 1}`),
      status: str(r.status),
      measured: r.measured,
      evidence: str(r.evidence ?? ""),
      source: { format: "generic", tool: str(pick(input, ["tool"]) ?? ""), file },
      raw: r,
    }));
}

export function adapt(
  input: unknown,
  format: DrcFormat | "auto",
  file?: string
): { ok: true; items: DrcItem[]; format: DrcFormat } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "drc_result는 객체여야 한다." };
  }
  const resolved = format === "auto" ? detectFormat(input) : format;
  if (!resolved) {
    return {
      ok: false,
      error:
        "DRC 결과 형식을 알 수 없다. checks/results/rules(cap_drc), violations(kicad_json), items(generic) 중 하나가 필요하다. " +
        "형식을 format으로 직접 지정할 수도 있다.",
    };
  }

  const o = input as Json;
  const items =
    resolved === "kicad_json" ? fromKicadJson(o, file) : resolved === "cap_drc" ? fromCapDrc(o, file) : fromGeneric(o, file);

  if (!items.length) return { ok: false, error: `${resolved} 형식으로 읽었지만 항목이 하나도 없다.` };
  return { ok: true, items, format: resolved };
}
