/**
 * fix/edit.ts
 * 템플릿이 만든 사각형을 .kicad_pcb 텍스트에 zone(keepout)으로 넣는다.
 *
 * 원본을 다시 직렬화하지 않고, 파일 맨 끝 닫는 괄호 앞에 zone 블록만 끼워
 * 넣는다. 나머지 바이트는 손대지 않으므로 KiCad가 저장한 서식·주석·uuid가
 * 그대로 남고, 되돌리기도 쉽다.
 */

import { createHash, randomUUID } from "node:crypto";
import type { RectZone } from "./templates";

export function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function fmt(n: number): string {
  // KiCad는 소수 6자리까지 쓴다. 불필요한 0은 없앤다.
  return String(Number(n.toFixed(6)));
}

/** keepout zone 한 개의 S-expression 블록. board.ts의 슬릿 발행 형식과 같다. */
export function zoneBlock(zone: RectZone, uuid = randomUUID()): string {
  const pts = zone.points.map((p) => `(xy ${fmt(p.x)} ${fmt(p.y)})`).join(" ");
  return `\t(zone
\t\t(net 0)
\t\t(net_name "")
\t\t(layer "${zone.layer}")
\t\t(uuid "${uuid}")
\t\t(name "${zone.name.replace(/"/g, '\\"')}")
\t\t(hatch edge 0.5)
\t\t(keepout
\t\t\t(copperpour not_allowed)
\t\t\t(footprints allowed)
\t\t\t(pads allowed)
\t\t\t(tracks allowed)
\t\t\t(vias allowed)
\t\t)
\t\t(polygon
\t\t\t(pts ${pts})
\t\t)
\t)`;
}

export type InsertResult =
  | { ok: true; text: string; inserted: number; at_index: number }
  | { ok: false; error: string };

/**
 * 파일 마지막 닫는 괄호 앞에 zone 블록들을 넣는다.
 * 닫는 괄호를 찾지 못하면 수정하지 않고 실패를 돌려준다.
 */
export function insertZones(originalText: string, zones: RectZone[]): InsertResult {
  if (!zones.length) return { ok: false, error: "넣을 zone이 없다." };

  const lastParen = originalText.lastIndexOf(")");
  if (lastParen < 0) return { ok: false, error: ".kicad_pcb에서 최상위 닫는 괄호를 찾지 못했다." };

  const blocks = zones.map((z) => zoneBlock(z)).join("\n");
  const head = originalText.slice(0, lastParen);
  const tail = originalText.slice(lastParen);
  const needsNewline = head.endsWith("\n") ? "" : "\n";

  return {
    ok: true,
    text: `${head}${needsNewline}${blocks}\n${tail}`,
    inserted: zones.length,
    at_index: lastParen,
  };
}

/** 이미 같은 이름의 zone이 있는지 본다. 같은 수정을 두 번 넣지 않기 위한 확인이다. */
export function findExistingZoneNames(text: string, names: string[]): string[] {
  return names.filter((n) => text.includes(`(name "${n}"`));
}

export function timestampTag(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}`;
}

export function fixedFileName(originalName: string, tag = timestampTag()): string {
  const base = originalName.replace(/\.kicad_pcb$/i, "");
  return `${base}_fixed_${tag}.kicad_pcb`;
}

export function backupFileName(originalName: string, tag = timestampTag()): string {
  return `${originalName}.bak_${tag}`;
}
