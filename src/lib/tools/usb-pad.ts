/**
 * tools/usb-pad.ts
 * USB AC Coupling Pad 서로게이트를 Claude가 직접 호출하도록 노출하는 MCP 도구.
 *
 * 계산은 브라우저 데모와 같은 모듈(src/lib/usb-ac-pad/*)을 서버에서 그대로 돌린다.
 * 화면(/web-tools/usb-ac-pad)과 숫자가 일치한다.
 * 모델 파일은 public 밖에 있어 정적 파일로 내려받을 수 없다.
 *
 * 이 도구는 교육용 경향 모델이다. 제조 판정이나 USB 규격 적합성 판단에 쓰지 않는다.
 */

import { z } from "zod";
import { checkAndIncrementDailyUsage } from "@/lib/mcp-rate-limit";
import engineModule from "@/lib/usb-ac-pad/engine.js";

type CurvePoint = { f_hz: number; f_display: string; sdd11_db: number; sdd21_db: number };
type Zdiff = { min_ohm: number; max_ohm: number } | null;
type PredictOk = {
  ok: true;
  branch: string;
  parameters: Record<string, unknown>;
  component: Record<string, unknown>;
  curve: CurvePoint[];
  tdr: { zdiff: Zdiff; rise_ps: number; roi_ns: number[]; sample_interval_ps: number | null };
  trace_delay: unknown;
};
type PredictFail = { ok: false; error: string; details?: string[]; limits?: unknown };
type Engine = {
  predict: (p: Record<string, unknown>) => PredictOk | PredictFail;
  modelInfo: () => Record<string, unknown>;
};

const engine = engineModule as unknown as Engine;

type TextResult = { content: Array<{ type: "text"; text: string }> };
type ToolConfig = { title: string; description: string; inputSchema?: z.ZodTypeAny };
type ToolServer = {
  registerTool: (name: string, config: ToolConfig, handler: (args: unknown) => Promise<TextResult>) => void;
};

const ROUTE_NAME = "usb-pad";
const DAILY_LIMIT = 1000;

const NOTICE =
  "educational trend model; 제조 판정·USB 규격 적합성 판단에 쓰지 않는다. " +
  "HFSS 학습 24 케이스·개발 평가 6 케이스, 독립 최종 검증 전. DC는 외삽값이다.";

const asText = (value: unknown): TextResult => ({
  content: [{ type: "text", text: JSON.stringify(value, null, 1) }],
});

function registerLimited(
  server: ToolServer,
  name: string,
  config: ToolConfig,
  handler: (args: unknown) => Promise<TextResult>
) {
  server.registerTool(name, config, async (args) => {
    const { allowed, count } = await checkAndIncrementDailyUsage(ROUTE_NAME, DAILY_LIMIT);
    if (!allowed) return asText({ error: `Daily USB pad MCP limit (${DAILY_LIMIT}) reached`, count });
    try {
      return await handler(args);
    } catch (error) {
      return asText({ error: error instanceof Error ? error.message : "Unknown error", notice: NOTICE });
    }
  });
}

const geometry = {
  W: z.number().positive().describe("차동 선폭 W [mm]"),
  S: z.number().positive().describe("차동 간격 S [mm]"),
  Vx: z.number().nonnegative().optional().describe("Void 가로 Vx [mm]. void=false면 무시된다"),
  Vy: z.number().nonnegative().optional().describe("Void 세로 Vy [mm]. void=false면 무시된다"),
  void_enabled: z.boolean().default(true).describe("true=Void 있음(void 분기), false=Void 없음(control 분기)"),
};

const component = {
  mode: z.enum(["capacitor", "short"]).default("capacitor").describe("capacitor=직렬 RLC, short=이상 단락"),
  cap_nf: z.number().positive().default(220).describe("직렬 커패시터 용량 [nF]"),
  esr_ohm: z.number().nonnegative().default(0).describe("ESR [ohm]"),
  esl_nh: z.number().nonnegative().default(0).describe("ESL [nH]"),
  rise_ps: z.number().positive().default(200).describe("TDR 상승시간 [ps]"),
};

type PredictArgs = {
  W: number;
  S: number;
  Vx?: number;
  Vy?: number;
  void_enabled?: boolean;
  mode?: "capacitor" | "short";
  cap_nf?: number;
  esr_ohm?: number;
  esl_nh?: number;
  rise_ps?: number;
  points?: number;
};

export function registerUsbPadTools(server: ToolServer) {
  registerLimited(
    server,
    "usbpad_model_info",
    {
      title: "USB AC pad 모델 범위와 한계",
      description:
        "서로게이트의 학습 변수와 범위, 주파수 대역, 등급, 경고를 돌려준다. 예측 전에 어디까지 믿을 수 있는지 확인할 때 쓴다.",
    },
    async () => asText({ ...engine.modelInfo(), notice: NOTICE })
  );

  registerLimited(
    server,
    "usbpad_predict",
    {
      title: "형상·부품 조건으로 S-parameter·TDR 예측",
      description:
        "선폭 W, 간격 S, Void 크기(Vx·Vy)와 직렬 부품(C·ESR·ESL)으로 Sdd11·Sdd21, 차동 TDR 임피던스, " +
        "band-pass impulse 폭, 배선 지연을 계산한다. 웹 화면 /web-tools/usb-ac-pad 와 같은 모듈을 쓰므로 값이 일치한다. " +
        "학습 범위를 벗어나면 계산하지 않고 범위를 알려준다.",
      inputSchema: z.object({
        ...geometry,
        ...component,
        points: z.number().int().min(5).max(40).default(15).describe("돌려줄 주파수 표본 수"),
      }),
    },
    async (args) => {
      const a = args as PredictArgs;
      const r = engine.predict(a);
      return asText({ ...r, notice: NOTICE });
    }
  );

  registerLimited(
    server,
    "usbpad_compare_void",
    {
      title: "Void 있음 / 없음 비교",
      description:
        "같은 선폭·간격·부품 조건에서 Void가 있는 경우와 없는 경우를 함께 계산해 Sdd21·Sdd11과 TDR 임피던스 차이를 돌려준다. " +
        "Void가 임피던스에 주는 영향을 보여줄 때 쓴다.",
      inputSchema: z.object({
        ...geometry,
        ...component,
        points: z.number().int().min(5).max(40).default(12).describe("돌려줄 주파수 표본 수"),
      }),
    },
    async (args) => {
      const a = args as PredictArgs;
      const withVoid = engine.predict({ ...a, void_enabled: true });
      const without = engine.predict({ ...a, void_enabled: false });
      if (!withVoid.ok || !without.ok) {
        return asText({ error: "두 조건 중 하나가 학습 범위를 벗어났다", with_void: withVoid, without_void: without, notice: NOTICE });
      }

      const byFreq = new Map<number, CurvePoint>(without.curve.map((c) => [c.f_hz, c]));
      const delta = withVoid.curve
        .filter((c) => byFreq.has(c.f_hz))
        .map((c) => {
          const o = byFreq.get(c.f_hz) as CurvePoint;
          return {
            f_display: c.f_display,
            sdd21_db: { with_void: c.sdd21_db, without_void: o.sdd21_db, delta: +(c.sdd21_db - o.sdd21_db).toFixed(3) },
            sdd11_db: { with_void: c.sdd11_db, without_void: o.sdd11_db, delta: +(c.sdd11_db - o.sdd11_db).toFixed(3) },
          };
        });

      return asText({
        parameters: withVoid.parameters,
        component: withVoid.component,
        comparison: delta,
        tdr_zdiff: { with_void: withVoid.tdr.zdiff, without_void: without.tdr.zdiff },
        trace_delay: { with_void: withVoid.trace_delay, without_void: without.trace_delay },
        notice: NOTICE,
      });
    }
  );
}
