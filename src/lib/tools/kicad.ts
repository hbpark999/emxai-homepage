/**
 * kicad.ts
 * KiCad PCB 생성 MCP의 툴 정의 6종(pcb_ 접두어)을 한 곳에 모은다.
 * 계산/직렬화 로직은 전부 lib/kicad/*에 있고, 여기서는 zod 입력 스키마와
 * 사람이 읽는 응답 텍스트로 감싸기만 한다. 라우트는 registerKicadTools(server)
 * 하나만 호출해 등록한다 - 새 MCP가 추가돼도 이 분리는 유지한다.
 */

import { z } from "zod";
import type { BoardSpec, CouponSpec } from "@/lib/kicad/types";
import { buildBoard, summarizeBoard } from "@/lib/kicad/board";
import { buildCoupon2xThru } from "@/lib/kicad/coupon";
import { listPartsCatalogSummary } from "@/lib/kicad/parts";
import { listStackupPresets } from "@/lib/kicad/stackup";
import { validateSpec } from "@/lib/kicad/validate";

// ---- zod: BoardSpec ---------------------------------------------------------

const zPoint = z.object({ x: z.number(), y: z.number() });

const zBoardSpecPart = z.object({
  ref: z.string().describe('부품 참조번호. 예: "U1", "C1", "J1"'),
  type: z.string().describe("pcb_list_parts가 돌려주는 카탈로그 id"),
  x: z.number().describe("mm, 보드 좌하단 기준"),
  y: z.number().describe("mm, 보드 좌하단 기준"),
  rot: z.number().optional().describe("deg, 기본 0. 반시계 방향(CCW)이 양수"),
  layer: z.enum(["F", "B"]).optional().describe("실장 면. 기본 F(앞면)"),
});

const zBoardSpecNet = z.object({
  name: z.string().describe('넷 이름. 예: "GND", "VDD", "SIG_P"'),
  pins: z.array(z.string()).describe('"REF.PIN" 형식 목록. 예: ["U1.12","C3.1"]'),
  diff_pair: z
    .string()
    .optional()
    .describe("차동 라우팅 짝 넷 이름. 2단계 기능이라 이번 단계에서는 무시된다"),
});

const zBoardSpecRoute = z.object({
  net: z.string().describe("nets에 선언된 넷 이름"),
  layer: z.string().describe('"F.Cu", "In1.Cu", "B.Cu" 등'),
  width_mm: z.number().describe("트레이스 폭 [mm]"),
  points: z
    .array(zPoint)
    .min(2)
    .describe("꺾인 점들의 나열. 연속한 두 점마다 세그먼트 하나가 된다. 폭을 바꾸려면 route를 나눠 넣는다"),
});

const zBoardSpecVia = z.object({
  net: z.string(),
  x: z.number(),
  y: z.number(),
  type: z.enum(["through", "micro", "blind"]),
  from_layer: z.string(),
  to_layer: z.string(),
  drill_mm: z.number(),
  diameter_mm: z.number(),
});

const zBoardSpecZoneSlit = z.object({
  x: z.number(),
  y: z.number(),
  w_mm: z.number().describe("슬릿 폭 [mm]"),
  h_mm: z.number().describe("슬릿 높이 [mm]"),
  rot: z.number().optional().describe("deg, 기본 0"),
});

const zBoardSpecZone = z.object({
  net: z.string(),
  layer: z.string(),
  outline: z.array(zPoint).optional().describe("생략하면 보드 전체를 외곽선으로 쓴다"),
  slits: z.array(zBoardSpecZoneSlit).optional().describe("GND slit(카퍼 없는 구멍) 목록"),
});

const zBoardSpec = z.object({
  name: z.string(),
  stackup: z.enum(["2L", "4L"]),
  size_mm: z.object({ w: z.number(), h: z.number() }),
  parts: z.array(zBoardSpecPart),
  nets: z.array(zBoardSpecNet),
  routes: z.array(zBoardSpecRoute),
  vias: z.array(zBoardSpecVia),
  zones: z.array(zBoardSpecZone),
});

function numberedList(items: string[]): string {
  return items.map((s, i) => `${i + 1}. ${s}`).join("\n");
}

// ---- 툴 등록 -----------------------------------------------------------------

/** McpServer 대신 registerTool만 요구하는 최소 인터페이스. mcp-handler의 서버가 이를 만족한다. */
type ToolServer = {
  registerTool: (
    name: string,
    config: { title: string; description: string; inputSchema?: z.ZodTypeAny },
    handler: (args: unknown) => Promise<{ content: Array<{ type: "text"; text: string }> }>
  ) => void;
};

export function registerKicadTools(server: ToolServer) {
  server.registerTool(
    "pcb_list_parts",
    {
      title: "부품 카탈로그",
      description: "생성 가능한 부품 카탈로그를 나열한다. BoardSpec.parts[].type에 쓸 수 있는 id 목록",
    },
    async () => {
      const items = listPartsCatalogSummary().map(
        (p) => `${p.id} - ${p.label} (${p.category}, ref=${p.refPrefix}, 패드 ${p.padCount}개)`
      );
      return { content: [{ type: "text", text: items.join("\n") }] };
    }
  );

  server.registerTool(
    "pcb_stackup_presets",
    {
      title: "스택업 프리셋",
      description: "지원하는 2층/4층 스택업과 각 층 두께·유전율, 허용 via 종류를 반환한다",
    },
    async () => {
      const text = listStackupPresets()
        .map((preset) => {
          const layers = preset.layers
            .map((l) => `  ${l.name} (${l.role}) 두께 ${l.thickness_mm}mm, εr ${l.er}`)
            .join("\n");
          return `${preset.id} - ${preset.label}\n${layers}\n  허용 via: ${preset.allowedVias.join(", ")}`;
        })
        .join("\n\n");
      return { content: [{ type: "text", text }] };
    }
  );

  server.registerTool(
    "pcb_validate_spec",
    {
      title: "spec 검증",
      description:
        ".kicad_pcb를 만들지 않고 BoardSpec만 검증한다. 미연결 넷, 존재하지 않는 부품/핀, 외곽 이탈, 패드 겹침을 확인",
      inputSchema: z.object({ spec: zBoardSpec }),
    },
    async (args) => {
      const { spec } = args as { spec: BoardSpec };
      const result = validateSpec(spec);
      const text = result.ok
        ? "이상 없음: 이 spec으로 .kicad_pcb를 만들 수 있다."
        : `문제 ${result.errors.length}건:\n${numberedList(result.errors)}`;
      return { content: [{ type: "text", text }] };
    }
  );

  server.registerTool(
    "pcb_build_board",
    {
      title: "보드 생성",
      description:
        "BoardSpec으로 .kicad_pcb 전체 텍스트를 생성한다. 내부적으로 먼저 검증하고, 치명적 오류가 있으면 파일 없이 오류만 반환한다",
      inputSchema: z.object({ spec: zBoardSpec }),
    },
    async (args) => {
      const { spec } = args as { spec: BoardSpec };
      const result = buildBoard(spec);
      if (!result.ok) {
        return {
          content: [{ type: "text", text: `빌드 실패, 먼저 이 문제를 고쳐야 한다:\n${numberedList(result.errors)}` }],
        };
      }
      const s = result.value.summary;
      const summaryText = `부품 ${s.partCount}개 / 넷 ${s.netCount}개 / 트레이스 총 길이 ${s.totalTraceLength_mm}mm / 비아 ${s.viaCount}개`;
      return {
        content: [
          { type: "text", text: summaryText },
          { type: "text", text: result.value.kicad_pcb },
        ],
      };
    }
  );

  server.registerTool(
    "pcb_coupon_2xthru",
    {
      title: "2x-thru 쿠폰 생성",
      description:
        "IEEE P370 2x-thru de-embedding용 구조 2개(FIX-DUT-FIX, 2x-thru)를 생성한다. 두 보드는 같은 fixture 생성 함수를 공유해 런치·트레이스 폭·레이어·via 구조가 항상 같다",
      inputSchema: z.object({
        name: z.string().describe("쿠폰 이름. 파일 이름/보드 이름에 쓰인다"),
        stackup: z.enum(["2L", "4L"]),
        fixture_len_mm: z.number().describe("커넥터에서 DUT 경계까지 fixture 트레이스 길이 [mm]"),
        dut_len_mm: z.number().describe("DUT 구간 트레이스 길이 [mm]. 2x-thru 보드에서는 자동으로 0으로 처리된다"),
        trace_width_mm: z.number().describe("시그널 트레이스 폭 [mm]"),
        gnd_slit: z
          .object({
            w_mm: z.number().describe("슬릿 폭(트레이스 방향) [mm]"),
            offset_from_launch_mm: z.number().describe("런치 중심에서 슬릿 중심까지 거리 [mm]"),
          })
          .optional()
          .describe("생략하면 GND에 slit을 넣지 않는다"),
        launch: z
          .enum(["edge-sma-2.92mm", "edge-sma-sub-mini"])
          .describe("SMA 커넥터 종류. 신호 패드 폭 프리셋을 결정한다"),
      }),
    },
    async (args) => {
      const spec = args as CouponSpec;
      const result = buildCoupon2xThru(spec);
      if (!result.ok) {
        return {
          content: [{ type: "text", text: `생성 실패, 먼저 이 문제를 고쳐야 한다:\n${numberedList(result.errors)}` }],
        };
      }
      const { summary, fixtureDutFixture, twoXThru } = result.value;
      return {
        content: [
          {
            type: "text",
            text: `FIX-DUT-FIX 총 길이 ${summary.total_len_fixture_dut_fixture_mm}mm (fixture ${summary.fixture_len_mm}mm x2 + DUT ${summary.dut_len_mm}mm)\n2x-thru 총 길이 ${summary.total_len_2xthru_mm}mm (fixture ${summary.fixture_len_mm}mm x2)`,
          },
          { type: "text", text: `--- ${spec.name}-FIX-DUT-FIX.kicad_pcb ---\n${fixtureDutFixture}` },
          { type: "text", text: `--- ${spec.name}-2xTHRU.kicad_pcb ---\n${twoXThru}` },
        ],
      };
    }
  );

  server.registerTool(
    "pcb_board_summary",
    {
      title: "보드 요약",
      description: ".kicad_pcb 텍스트를 넣으면 넷 목록, 트레이스별 길이·폭·층, 비아 종류별 개수를 요약한다",
      inputSchema: z.object({ kicad_pcb: z.string().describe(".kicad_pcb 파일 전체 텍스트") }),
    },
    async (args) => {
      const { kicad_pcb } = args as { kicad_pcb: string };
      const result = summarizeBoard(kicad_pcb);
      if (!result.ok) {
        return { content: [{ type: "text", text: numberedList(result.errors) }] };
      }
      const { nets, traces, vias } = result.value;
      const traceLines = traces
        .map((t) => `  ${t.net} (${t.layer}): ${t.length_mm}mm, 폭 ${t.width_mm}mm`)
        .join("\n");
      const text = `넷 (${nets.length}개): ${nets.join(", ")}
트레이스 (${traces.length}개):
${traceLines || "  없음"}
비아: through ${vias.through} / micro ${vias.micro} / blind ${vias.blind}`;
      return { content: [{ type: "text", text }] };
    }
  );
}
