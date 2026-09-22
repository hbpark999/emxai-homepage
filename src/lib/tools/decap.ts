/**
 * tools/decap.ts — De-cap 병렬 합성 임피던스 MCP 도구
 *
 * 용도 : 여러 de-cap을 병렬로 붙였을 때의 합성 Z(f), SRF, 반공진을 Claude가 직접 계산.
 * 실행 : Vercel 함수 안에서 닫힌 형태 수식으로 즉시 계산한다. 외부 서버(Cloud Run),
 *        HFSS 모델 파일, 인증 토큰을 쓰지 않으므로 콜드스타트나 호출 실패가 없다.
 * 구분 : 형상 기반 PCB 구조 해석(HFSS surrogate)은 pdn_* 도구가 담당한다.
 *        이 파일의 decap_* 도구는 부품 조합과 실장 구간만 다룬다.
 * 대응 웹 도구 : https://www.emxai.net/web-tools/parallel-decap
 */

import { z } from "zod";
import { checkAndIncrementDailyUsage } from "@/lib/mcp-rate-limit";
import {
  DEFAULT_STRUCTURE,
  findExtrema,
  formatFreq,
  formatZ,
  mountNh,
  sweep,
  traceNhPerMm,
  viaNh,
  zAt,
  type DecapSpec,
  type MountStructure,
} from "@/lib/decap";

type TextResult = { content: Array<{ type: "text"; text: string }> };
type ToolServer = {
  registerTool: (
    name: string,
    config: { title: string; description: string; inputSchema?: z.ZodTypeAny },
    handler: (args: unknown) => Promise<TextResult>
  ) => void;
};

const ROUTE_NAME = "decap-composite";
const DAILY_LIMIT = 2000;

const capSchema = z.object({
  c_uf: z.number().positive().describe("Capacitance [µF]"),
  esr_mohm: z.number().nonnegative().default(10).describe("ESR [mOhm]"),
  esl_nh: z.number().nonnegative().default(0.5).describe("Package ESL [nH]"),
  qty: z.number().int().min(1).max(1000).default(1).describe("Number of identical parts in parallel"),
  len_vcc_mm: z.number().min(0).max(20).default(1).describe("VCC pad to VCC via trace length [mm]"),
  len_gnd_mm: z.number().min(0).max(20).default(1).describe("GND pad to GND via trace length [mm]"),
});

const structureSchema = z
  .object({
    w_mm: z.number().positive().default(0.5).describe("Mount trace width [mm]"),
    h_mm: z.number().positive().default(0.2).describe("VCC-to-GND plane spacing [mm]"),
    t_mm: z.number().positive().default(0.3).describe("Via length [mm]"),
    d_mm: z.number().positive().default(0.3).describe("Via drill diameter [mm]"),
  })
  .default(DEFAULT_STRUCTURE)
  .describe("Mounting geometry. Defaults model a 0.5 mm trace over a 0.2 mm plane pair.");

const asText = (value: unknown): TextResult => ({
  content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
});

async function limited(run: () => Promise<TextResult>): Promise<TextResult> {
  const { allowed, count } = await checkAndIncrementDailyUsage(ROUTE_NAME, DAILY_LIMIT);
  if (!allowed) return asText({ error: `Daily de-cap MCP limit (${DAILY_LIMIT}) reached`, count });
  return run();
}

const DECADES = [1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];

/** 곡선 전체 대신 decade 샘플 + 극점만 돌려줘 응답을 가볍게 유지한다. */
function summarize(caps: DecapSpec[], structure: MountStructure, includeMount: boolean) {
  const r = sweep({ caps, structure, includeMount });
  const extrema = findExtrema(r.freq, includeMount ? r.total : r.componentOnly);
  const active = includeMount ? r.total : r.componentOnly;
  return {
    mount_inductance_nh: caps.map((cap, i) => ({
      cap: i + 1,
      per_part: +r.mount_nh[i].toFixed(4),
      effective_with_qty: +(r.mount_nh[i] / Math.max(1, cap.qty)).toFixed(4),
      total_series_L_nh: +((cap.esl_nh + (includeMount ? r.mount_nh[i] : 0)) / Math.max(1, cap.qty)).toFixed(4),
    })),
    min_impedance: {
      z_ohm: +Math.min(...active).toFixed(6),
      display: formatZ(Math.min(...active)),
      note: "바닥은 ESR이 결정한다. 실장 인덕턴스는 공진 주파수와 반공진 크기를 바꾼다.",
    },
    extrema: extrema.map((p) => ({
      type: p.type === "srf" ? "SRF" : "anti-resonance",
      f_hz: +p.f_hz.toFixed(1),
      f_display: formatFreq(p.f_hz),
      z_ohm: +p.z_ohm.toFixed(6),
      z_display: formatZ(p.z_ohm),
      ...(includeMount
        ? { z_component_only_at_same_f: +zAt(r.freq, r.componentOnly, p.f_hz).toFixed(6) }
        : {}),
    })),
    decade_samples: DECADES.map((f) => ({
      f_display: formatFreq(f),
      z_ohm: +zAt(r.freq, active, f).toFixed(6),
      z_display: formatZ(zAt(r.freq, active, f)),
    })),
  };
}

export function registerDecapTools(server: ToolServer) {
  server.registerTool(
    "decap_composite_z",
    {
      title: "De-cap 합성 임피던스 (Vercel 내장 · 즉시 계산)",
      description:
        "여러 de-cap의 병렬 합성 Z(f)와 SRF·반공진 주파수를 계산한다. Vercel 함수 안에서 " +
        "닫힌 형태 수식으로 즉시 실행되며 외부 서버나 HFSS 모델을 호출하지 않는다. " +
        "실장 인덕턴스는 VCC/GND 배선 길이와 via로 산출해 선택적으로 포함한다. " +
        "PCB 형상(De-cap과 IC 사이 거리, 층 두께) 기반 해석이 필요하면 pdn_predict_impedance를 쓴다.",
      inputSchema: z.object({
        caps: z.array(capSchema).min(1).max(12).describe("병렬로 붙이는 de-cap 목록"),
        include_mount: z
          .boolean()
          .default(true)
          .describe("실장 인덕턴스 포함 여부. false면 부품 ESL만 사용"),
        structure: structureSchema,
      }),
    },
    async (args) =>
      limited(async () => {
        const a = args as { caps: DecapSpec[]; include_mount: boolean; structure: MountStructure };
        const structure = a.structure ?? DEFAULT_STRUCTURE;
        return asText({
          engine: "vercel-inline closed-form lumped model (no external solver)",
          model: "각 de-cap = C + ESR + ESL 직렬. 실장 포함 시 VCC 경로와 GND 경로가 직렬로 루프에 추가.",
          scope: "IC까지의 공통 plane 경로는 미포함. 부품과 실장 구간만.",
          include_mount: a.include_mount,
          structure,
          trace_coefficient_nh_per_mm: +traceNhPerMm(structure).toFixed(4),
          via_nh_each: +viaNh(structure).toFixed(4),
          ...summarize(a.caps, structure, a.include_mount),
        });
      })
  );

  server.registerTool(
    "decap_compare_qty",
    {
      title: "De-cap 개수 효과 비교 (Vercel 내장 · 즉시 계산)",
      description:
        "같은 de-cap 구성을 개수만 바꿔 두 경우를 비교한다. 실장 인덕턴스를 켠 경우와 끈 경우를 " +
        "함께 돌려주므로 '개수를 늘려도 더 내려가지 않는 지점'을 수치로 보여줄 수 있다. " +
        "Vercel 함수에서 즉시 계산한다.",
      inputSchema: z.object({
        caps: z.array(capSchema).min(1).max(12).describe("기준 구성. 각 항목의 qty가 A안이 된다"),
        qty_b: z.array(z.number().int().min(1).max(1000)).describe("B안의 개수 배열. caps와 길이가 같아야 한다"),
        structure: structureSchema,
      }),
    },
    async (args) =>
      limited(async () => {
        const a = args as { caps: DecapSpec[]; qty_b: number[]; structure: MountStructure };
        const structure = a.structure ?? DEFAULT_STRUCTURE;
        if (a.qty_b.length !== a.caps.length) {
          return asText({ error: `qty_b 길이(${a.qty_b.length})가 caps 길이(${a.caps.length})와 다릅니다.` });
        }
        const capsB = a.caps.map((c, i) => ({ ...c, qty: a.qty_b[i] }));
        const pack = (caps: DecapSpec[]) => ({
          qty: caps.map((c) => c.qty),
          with_mount: summarize(caps, structure, true),
          component_only: summarize(caps, structure, false),
        });
        return asText({
          engine: "vercel-inline closed-form lumped model (no external solver)",
          structure,
          case_a: pack(a.caps),
          case_b: pack(capsB),
          reading:
            "with_mount 쪽 반공진 z_ohm이 개수를 늘려도 잘 내려가지 않으면, 그 한계는 부품이 아니라 실장 경로가 만든 것이다.",
        });
      })
  );

  server.registerTool(
    "decap_mount_l",
    {
      title: "실장 인덕턴스 계산 (Vercel 내장 · 즉시 계산)",
      description:
        "VCC/GND 배선 길이와 via 치수에서 de-cap 실장 인덕턴스를 구한다. 부품 ESL과 비교해 " +
        "어느 쪽이 지배적인지 보여준다. Vercel 함수에서 즉시 계산한다.",
      inputSchema: z.object({
        len_vcc_mm: z.number().min(0).max(20).default(1).describe("VCC 배선 길이 [mm]"),
        len_gnd_mm: z.number().min(0).max(20).default(1).describe("GND 배선 길이 [mm]"),
        esl_nh: z.number().nonnegative().default(0.5).describe("비교할 부품 ESL [nH]"),
        structure: structureSchema,
      }),
    },
    async (args) =>
      limited(async () => {
        const a = args as {
          len_vcc_mm: number; len_gnd_mm: number; esl_nh: number; structure: MountStructure;
        };
        const s = a.structure ?? DEFAULT_STRUCTURE;
        const cap: DecapSpec = {
          c_uf: 1, esr_mohm: 10, esl_nh: a.esl_nh, qty: 1,
          len_vcc_mm: a.len_vcc_mm, len_gnd_mm: a.len_gnd_mm,
        };
        const lm = mountNh(cap, s);
        const k = traceNhPerMm(s);
        return asText({
          engine: "vercel-inline closed-form (no external solver)",
          formula: "L_mnt = (µ0·h/w)·(len_vcc + len_gnd) + 2·L_via,  L_via = (µ0/2π)·t·[ln(4t/d)+1]",
          structure: s,
          trace_coefficient_nh_per_mm: +k.toFixed(4),
          trace_nh: { vcc: +(k * a.len_vcc_mm).toFixed(4), gnd: +(k * a.len_gnd_mm).toFixed(4) },
          via_nh: { each: +viaNh(s).toFixed(4), total: +(2 * viaNh(s)).toFixed(4) },
          mount_total_nh: +lm.toFixed(4),
          component_esl_nh: a.esl_nh,
          ratio_mount_over_esl: a.esl_nh > 0 ? +(lm / a.esl_nh).toFixed(2) : null,
          verdict: a.esl_nh > 0 && lm > a.esl_nh ? "실장 인덕턴스가 부품 ESL보다 크다" : "부품 ESL이 더 크다",
        });
      })
  );

  server.registerTool(
    "decap_model_info",
    {
      title: "De-cap 모델 정의와 범위 (Vercel 내장)",
      description:
        "decap_* 도구가 쓰는 수식, 병렬 반영 방식, 포함·미포함 범위, 기본 실장 구조값을 돌려준다. " +
        "계산 전에 모델의 한계를 확인할 때 쓴다.",
    },
    async () =>
      limited(async () =>
        asText({
          engine: "Vercel 함수 내장. 외부 solver, 모델 파일, 인증 토큰 없음.",
          web_tool: "https://www.emxai.net/web-tools/parallel-decap",
          component_model: "Z = ESR + j(ωL − 1/ωC), L = ESL (+ 실장 L)",
          parallel_rule: "개수 n → C×n, ESR/n, ESL/n, L_mnt/n",
          mount_model: {
            path: "VCC 패드 → 배선 → via → VCC plane, GND 패드 → 배선 → via → GND plane (직렬로 루프 구성)",
            formula: "L_mnt = (µ0·h/w)·(len_vcc + len_gnd) + 2·L_via",
            via: "L_via = (µ0/2π)·t·[ln(4t/d)+1]",
            default_structure: DEFAULT_STRUCTURE,
            default_coefficient_nh_per_mm: +traceNhPerMm(DEFAULT_STRUCTURE).toFixed(4),
          },
          frequency_default: { start_hz: 100, end_hz: 1e9, points: 1400, spacing: "log" },
          excluded: [
            "IC까지의 공통 plane 확산 경로",
            "plane 공진, 유전 손실, 도체 표피효과",
            "MLCC의 DC 바이어스·온도에 따른 용량 감소",
            "부품 간 상호 인덕턴스",
          ],
          related: "PCB 형상 기반 HFSS surrogate 해석은 pdn_predict_impedance / pdn_compare_distance",
        })
      ),
  );
}
