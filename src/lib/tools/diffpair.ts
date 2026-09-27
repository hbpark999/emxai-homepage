/**
 * tools/diffpair.ts — Microstrip differential pair Z0 MCP 도구
 *
 * 용도 : 공개 계산기(/web-tools/diff-pair)와 같은 IPC-2141 근사식으로 Zdiff를 계산한다.
 * 실행 : Vercel 함수 안에서 즉시 계산한다. 외부 서버, 모델 파일, 토큰을 쓰지 않는다.
 * 구분 : /api/mcp의 calc_z0(structure="diff")는 Hammerstad-Jensen 기반이라 값이 다르다.
 *        화면과 숫자를 맞춰야 하는 실습에는 이 파일의 diffpair_* 도구를 쓴다.
 * 대응 웹 도구 : https://www.emxai.net/web-tools/diff-pair
 */

import { z } from "zod";
import { checkAndIncrementDailyUsage } from "@/lib/mcp-rate-limit";
import {
  DEFAULT_INPUT,
  calcDiffPair,
  compareToTarget,
  round,
  solveForTarget,
  sweep,
  validate,
  type DiffPairInput,
  type SolveVariable,
  type SweepVariable,
} from "@/lib/diffpair";
import { diffMicrostripZ0 } from "@/lib/z0";
import {
  crossSectionAt,
  resolveLocation,
  summarizeBoard,
  type BoardJson,
  type LocationRequest,
} from "@/lib/board-geometry";

type TextResult = { content: Array<{ type: "text"; text: string }> };
type ToolServer = {
  registerTool: (
    name: string,
    config: { title: string; description: string; inputSchema?: z.ZodTypeAny },
    handler: (args: unknown) => Promise<TextResult>
  ) => void;
};

const ROUTE_NAME = "diffpair";
const DAILY_LIMIT = 2000;

const geometry = {
  er: z.number().gt(1).default(DEFAULT_INPUT.er).describe("Relative permittivity of the dielectric"),
  h_mm: z.number().positive().default(DEFAULT_INPUT.h_mm).describe("Dielectric height from trace to reference plane [mm]"),
  w_mm: z.number().positive().default(DEFAULT_INPUT.w_mm).describe("Width of one trace [mm]"),
  s_mm: z.number().positive().default(DEFAULT_INPUT.s_mm).describe("Edge-to-edge spacing between the two traces [mm]"),
  t_um: z.number().positive().default(DEFAULT_INPUT.t_um).describe("Finished copper thickness [µm]. 1 oz is about 35"),
  freq_ghz: z.number().positive().default(DEFAULT_INPUT.freq_ghz).describe("Frequency for guided wavelength [GHz]"),
};

const asText = (value: unknown): TextResult => ({
  content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
});

async function limited(run: () => Promise<TextResult>): Promise<TextResult> {
  const { allowed, count } = await checkAndIncrementDailyUsage(ROUTE_NAME, DAILY_LIMIT);
  if (!allowed) return asText({ error: `Daily diff-pair MCP limit (${DAILY_LIMIT}) reached`, count });
  return run();
}

function pack(v: DiffPairInput) {
  const r = calcDiffPair(v);
  return {
    input: v,
    zdiff_ohm: round(r.zdiff_ohm, 2),
    z0_single_ohm: round(r.z0_ohm, 2),
    zodd_ohm: round(r.zodd_ohm, 2),
    eeff: round(r.eeff, 3),
    coupling_reduction_percent: round(r.coupling_percent, 1),
    delay_ps_per_mm: round(r.delay_ps_per_mm, 2),
    lambda_mm: round(r.lambda_mm, 2),
    ratios: { w_over_h: round(r.w_over_h, 2), s_over_h: round(r.s_over_h, 2) },
    cautions: r.cautions,
  };
}

export function registerDiffPairTools(server: ToolServer) {
  server.registerTool(
    "diffpair_zdiff",
    {
      title: "차동 임피던스 Zdiff 계산 (Vercel 내장 · 즉시 계산)",
      description:
        "Edge-coupled surface microstrip differential pair의 Zdiff를 IPC-2141 계열 근사식으로 계산한다. " +
        "단일 선로 Z0, Zodd, 유효 유전율, 결합에 의한 감소율, 전파 지연, 유도 파장, W/H·S/H를 함께 돌려준다. " +
        "target_zdiff_ohm을 주면 목표 대비 편차와 ±5%/±10% 판정을 붙인다. " +
        "공개 계산기 https://www.emxai.net/web-tools/diff-pair 와 같은 수식이라 화면 값과 일치한다.",
      inputSchema: z.object({
        ...geometry,
        target_zdiff_ohm: z.number().positive().optional().describe("Target differential impedance [ohm]"),
      }),
    },
    async (args) =>
      limited(async () => {
        const a = args as DiffPairInput & { target_zdiff_ohm?: number };
        const invalid = validate(a);
        if (invalid) return asText({ error: invalid, input: a });
        const out = pack(a);
        return asText({
          engine: "vercel-inline IPC-2141 approximation (no external solver)",
          formulas: {
            z0: "87/sqrt(er+1.41) * ln(5.98H / (0.8W + T))",
            zdiff: "2*Z0 * (1 - 0.48*exp(-0.96*S/H))",
            eeff: "0.475*er + 0.67",
          },
          ...out,
          ...(a.target_zdiff_ohm
            ? { target: compareToTarget(out.zdiff_ohm, a.target_zdiff_ohm) }
            : {}),
        });
      })
  );

  server.registerTool(
    "diffpair_solve",
    {
      title: "목표 Zdiff를 만족하는 치수 역산 (Vercel 내장 · 즉시 계산)",
      description:
        "목표 차동 임피던스를 만족하는 치수 하나(선폭 w_mm, 간격 s_mm, 기판 높이 h_mm 중 택1)를 이분법으로 역산한다. " +
        "나머지 치수는 입력값으로 고정한다. 목표가 해당 변수만으로 도달할 수 없으면 가능한 범위를 알려준다.",
      inputSchema: z.object({
        ...geometry,
        target_zdiff_ohm: z.number().positive().describe("Target differential impedance [ohm]"),
        solve_for: z
          .enum(["w_mm", "s_mm", "h_mm"])
          .default("w_mm")
          .describe("Which dimension to solve for. The others stay fixed."),
      }),
    },
    async (args) =>
      limited(async () => {
        const a = args as DiffPairInput & { target_zdiff_ohm: number; solve_for: SolveVariable };
        const solved = solveForTarget(a.target_zdiff_ohm, a.solve_for, a);
        if (!solved.ok) return asText({ error: solved.reason, input: a });
        const value = round(solved.value, 4);
        return asText({
          engine: "vercel-inline IPC-2141 approximation (no external solver)",
          solved: { variable: solved.variable, value_mm: value },
          ...pack({ ...a, [solved.variable]: value }),
          target: compareToTarget(round(solved.result.zdiff_ohm, 2), a.target_zdiff_ohm),
          note: "근사식 역산이므로 제조 전에는 PCB 업체 stackup 계산과 field solver로 확인한다.",
        });
      })
  );

  server.registerTool(
    "diffpair_sweep",
    {
      title: "치수 민감도 스윕 (Vercel 내장 · 즉시 계산)",
      description:
        "변수 하나(w_mm, s_mm, h_mm, er, t_um)를 범위 안에서 훑으며 Zdiff와 단일 선로 Z0의 변화를 돌려준다. " +
        "어떤 치수가 임피던스를 크게 움직이는지 보여줄 때 쓴다.",
      inputSchema: z.object({
        ...geometry,
        variable: z
          .enum(["w_mm", "s_mm", "h_mm", "er", "t_um"])
          .describe("Variable to sweep. Its geometry input is used as the baseline for the others."),
        from: z.number().positive().describe("Sweep start value, same unit as the variable"),
        to: z.number().positive().describe("Sweep end value"),
        steps: z.number().int().min(2).max(41).default(9).describe("Number of points (2-41)"),
      }),
    },
    async (args) =>
      limited(async () => {
        const a = args as DiffPairInput & {
          variable: SweepVariable;
          from: number;
          to: number;
          steps: number;
        };
        const points = sweep(a.variable, a.from, a.to, a.steps, a);
        const valid = points.filter((p) => p.zdiff_ohm !== null);
        return asText({
          engine: "vercel-inline IPC-2141 approximation (no external solver)",
          baseline: a,
          variable: a.variable,
          points,
          ...(valid.length
            ? {
                zdiff_range_ohm: [
                  Math.min(...valid.map((p) => p.zdiff_ohm as number)),
                  Math.max(...valid.map((p) => p.zdiff_ohm as number)),
                ],
              }
            : {}),
        });
      })
  );

  server.registerTool(
    "diffpair_model_info",
    {
      title: "차동 쌍 근사식의 수식과 적용 범위 (Vercel 내장)",
      description:
        "diffpair_* 도구가 쓰는 수식, 가정, 권장 기하 범위, 포함하지 않는 효과를 돌려준다. " +
        "계산 전에 어디까지 믿을 수 있는지 확인할 때 쓴다.",
    },
    async () =>
      limited(async () =>
        asText({
          engine: "Vercel 함수 내장. 외부 solver, 모델 파일, 인증 토큰 없음.",
          web_tool: "https://www.emxai.net/web-tools/diff-pair",
          structure: "외층 edge-coupled surface microstrip, 연속된 단일 기준면",
          formulas: {
            z0: "87/sqrt(er+1.41) * ln(5.98H / (0.8W + T))",
            zdiff: "2*Z0 * (1 - 0.48*exp(-0.96*S/H))",
            zodd: "Zdiff / 2",
            eeff: "0.475*er + 0.67",
            delay: "3.3356 * sqrt(eeff) [ps/mm]",
            lambda: "299.792458 / (f_GHz * sqrt(eeff)) [mm]",
          },
          units: { w_mm: "mm", s_mm: "mm", h_mm: "mm", t_um: "µm", freq_ghz: "GHz" },
          recommended_ranges: { w_over_h: "0.1 – 2", s_over_h: "0.1 – 3" },
          excluded: [
            "솔더마스크와 동박 표면 거칠기",
            "에칭 단면(사다리꼴) 형상",
            "유리섬유 직조 불균일과 주파수 분산",
            "인접 층·인접 배선과의 결합",
          ],
          related: {
            hammerstad_jensen: "/api/mcp의 calc_z0(structure='diff')는 다른 근사식이라 값이 조금 다르다",
            note: "제조 데이터는 PCB 업체 stackup 계산과 2D/3D field solver로 재검증할 것",
          },
        })
      ),
  );

  server.registerTool(
    "diffpair_board_summary",
    {
      title: "PCB 형상 JSON 요약 (Vercel 내장)",
      description:
        "PCB 형상 JSON에 들어 있는 차동 쌍, AC Capacitor, design_rules, 신호층과 기준면 목록을 돌려준다. " +
        "diffpair_from_board로 어느 쌍과 어느 위치를 계산할지 고르기 전에 쓴다.",
      inputSchema: z.object({
        board: z.object({}).passthrough().describe("KiCad에서 내보낸 PCB 형상 JSON 전체"),
      }),
    },
    async (args) =>
      limited(async () => {
        const a = args as { board: BoardJson };
        return asText({ engine: "vercel-inline", ...summarizeBoard(a.board) });
      })
  );

  server.registerTool(
    "diffpair_from_board",
    {
      title: "PCB 형상 JSON에서 단면을 뽑아 Zdiff 계산 (Vercel 내장 · 즉시 계산)",
      description:
        "PCB 형상 JSON(stackup·traces·components·design_rules)에서 지정한 위치의 차동 쌍 단면을 측정해 " +
        "선폭 W, 간격 S, 기준면까지 높이 H, 동박 두께 T, 유전율 er을 뽑고 그대로 Zdiff를 계산한다. " +
        "위치를 주지 않으면 AC Capacitor에서 부품(IC)쪽으로 1 mm 떨어진 지점을 기본으로 쓴다. " +
        "at.x_mm/at.y_mm으로 좌표를 주거나 at.ref·at.offset_mm·at.side로 기준 부품과 거리를 바꿀 수 있다. " +
        "design_rules의 diff_width/diff_gap으로 계산한 값도 함께 돌려주어 팬아웃 구간의 차이를 비교할 수 있다.",
      inputSchema: z.object({
        board: z.object({}).passthrough().describe("KiCad에서 내보낸 PCB 형상 JSON 전체"),
        at: z
          .object({
            ref: z.string().optional().describe("기준 부품 ref. 기본은 첫 번째 AC Capacitor"),
            offset_mm: z.number().min(0).max(50).optional().describe("기준 부품 패드에서 떨어진 거리 [mm]. 기본 1"),
            side: z.enum(["ic", "connector"]).optional().describe("ic=부품쪽(기본), connector=커넥터쪽"),
            x_mm: z.number().optional().describe("좌표로 직접 지정할 때의 x [mm]"),
            y_mm: z.number().optional().describe("좌표로 직접 지정할 때의 y [mm]"),
            pair: z.string().optional().describe("차동 쌍 이름(diff_pairs[].name) 또는 네트 이름"),
          })
          .optional()
          .describe("측정 위치. 생략하면 AC Cap에서 부품쪽 1 mm"),
        freq_ghz: z.number().positive().optional().describe("파장·지연 계산용 주파수 [GHz]"),
      }),
    },
    async (args) =>
      limited(async () => {
        const a = args as { board: BoardJson; at?: LocationRequest; freq_ghz?: number };
        const loc = resolveLocation(a.board, a.at ?? {});
        if ("error" in loc) return asText({ error: loc.error });

        const cs = crossSectionAt(a.board, loc, a.freq_ghz);
        if ("error" in cs) return asText({ error: cs.error, location: loc.description });

        const invalid = validate(cs.input);
        if (invalid) return asText({ error: invalid, cross_section: cs.input, location: loc.description });

        const dr = a.board.design_rules ?? {};
        const byRule =
          dr.diff_width && dr.diff_gap
            ? pack({ ...cs.input, w_mm: dr.diff_width, s_mm: dr.diff_gap })
            : null;

        const out = pack(cs.input);
        return asText({
          engine: "vercel-inline IPC-2141 approximation (no external solver)",
          board: a.board.meta?.name ?? null,
          location: {
            description: loc.description,
            point_mm: cs.point,
            layer: cs.layer,
            reference_layer: cs.reference_layer,
            nets: { p: cs.net_p, n: cs.net_n },
          },
          measured_cross_section: {
            ...cs.input,
            center_to_center_mm: cs.center_to_center_mm,
            width_n_mm: cs.width_n_mm,
            dielectric: cs.dielectric,
          },
          ...out,
          ...(dr.target_Zdiff_ohm ? { target: compareToTarget(out.zdiff_ohm, dr.target_Zdiff_ohm) } : {}),
          cross_check_hammerstad_jensen: (() => {
            const hj = diffMicrostripZ0({
              w: cs.input.w_mm,
              h: cs.input.h_mm,
              t: cs.input.t_um / 1000,
              s: cs.input.s_mm,
              er: cs.input.er,
            });
            return {
              zdiff_ohm: round(hj.zdiff, 2),
              z0_ohm: round(hj.z0, 2),
              note:
                "같은 단면을 /api/mcp의 calc_z0(structure='diff')와 같은 Hammerstad-Jensen 모델로 계산한 값. " +
                "근사식이 다르므로 IPC 결과와 몇 % 차이가 나는 것이 정상이다. 형상 JSON의 target_Zdiff_ohm이 " +
                "이 모델로 정해졌다면 이 값과 비교한다.",
            };
          })(),
          ...(byRule
            ? {
                design_rule_reference: {
                  diff_width_mm: dr.diff_width,
                  diff_gap_mm: dr.diff_gap,
                  zdiff_ohm: byRule.zdiff_ohm,
                  note: "등간격 구간(design_rules 기준)에서의 값. 측정값과 다르면 그 지점이 팬아웃·불연속 구간이다.",
                },
              }
            : {}),
          notes: cs.notes,
        });
      })
  );
}
