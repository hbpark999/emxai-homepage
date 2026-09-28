/**
 * drc/schema.ts
 * 외부에서 판정한 DRC 결과를 표준 형태로 담는 타입과, 판정값이 변형되지
 * 않았음을 스스로 증명하는 검사를 둔다.
 *
 * 이 MCP는 Pass/Fail을 판정하지 않는다. status·measured·evidence는 입력에서
 * 받은 값을 그대로 옮기고, 옮기는 과정에서 바뀌지 않았는지 해시로 확인한다.
 */

import { createHash } from "node:crypto";

export type DrcStatus = string;

/** 표준화된 DRC 항목 하나. 판정 관련 필드는 외부 입력 그대로다. */
export type DrcItem = {
  /** 규칙 id. 예: "CAP-10" */
  rule_id: string;
  /** 항목 고유 id. 규칙 + 대상으로 만든다. 예: "CAP-10#C1.1@In1.Cu" */
  id: string;
  /** 외부 판정 결과 문자열. 변형하지 않는다. */
  status: DrcStatus;
  /** 외부 측정값. 숫자든 문자열이든 받은 그대로 둔다. */
  measured: unknown;
  /** 근거 문자열. 예: "C1.1 · In1.Cu: 0%" */
  evidence: string;
  /** 어느 파일/도구에서 왔는지 */
  source: { format: string; tool?: string; file?: string };
  /** 어댑터가 건드리지 않은 원본 항목 */
  raw: unknown;
};

export type ImportedDrc = {
  items: DrcItem[];
  fails: DrcItem[];
  summary: { total: number; by_status: Record<string, number> };
  /** 판정값 무변형 증명 */
  integrity: {
    input_sha256: string;
    verdict_sha256: string;
    verdict_unchanged: boolean;
    note: string;
  };
  notice: string;
};

/**
 * 응답에 붙는 한 줄 고지. 절차 안내와 대화 문구는 Skill이 담당하고, 여기에는
 * 데이터가 다른 도구로 흘러가도 사라지면 안 되는 성격 표시만 남긴다.
 */
export const NOTICE = "educational; not a substitute for KiCad DRC, 제조 검증, SI/EM 해석";

export function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/** 판정에 해당하는 필드만 모아 해시한다. 입력과 출력이 같은지 비교하는 데 쓴다. */
export function verdictFingerprint(items: Array<Pick<DrcItem, "id" | "status" | "measured" | "evidence">>): string {
  const canonical = items
    .map((i) => ({ id: i.id, status: i.status, measured: i.measured, evidence: i.evidence }))
    .sort((a, b) => a.id.localeCompare(b.id));
  return sha256(JSON.stringify(canonical));
}

/** status가 Fail 계열인지 문자열로만 판단한다. 값 자체는 바꾸지 않는다. */
export function isFail(status: DrcStatus): boolean {
  return /^(fail|failed|error|violation|ng)$/i.test(String(status).trim());
}

export function summarize(items: DrcItem[]) {
  const by_status: Record<string, number> = {};
  for (const item of items) {
    const key = String(item.status);
    by_status[key] = (by_status[key] ?? 0) + 1;
  }
  return { total: items.length, by_status };
}
