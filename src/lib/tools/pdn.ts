import { z } from "zod";
import { checkAndIncrementDailyUsage } from "@/lib/mcp-rate-limit";

type TextResult = { content: Array<{ type: "text"; text: string }> };
type ToolServer = {
  registerTool: (
    name: string,
    config: { title: string; description: string; inputSchema?: z.ZodTypeAny },
    handler: (args: unknown) => Promise<TextResult>
  ) => void;
};

type JsonRecord = Record<string, unknown>;

const ROUTE_NAME = "pdn-surrogate";
const DAILY_LIMIT = 500;

const geometryFields = {
  d_mm: z.number().min(2).max(24).default(10).describe("De-cap to IC distance [mm]"),
  route_len_mm: z.number().min(0.1).max(4).default(1).describe("Top VCC route length parameter [mm]"),
  h_top_mm: z.number().min(0.1).max(1).default(0.3).describe("Top-to-VCC-plane dielectric thickness [mm]"),
  h_pg_mm: z.number().min(0.05).max(0.8).default(0.2).describe("VCC-to-GND-plane dielectric thickness [mm]"),
};

const componentFields = {
  capacitance_nf: z.number().positive().default(100).describe("De-cap capacitance [nF]"),
  esr_mohm: z.number().nonnegative().default(30).describe("De-cap ESR [mOhm]"),
  esl_nh: z.number().nonnegative().default(0.5).describe("De-cap package ESL [nH]"),
};

function cloudRunUrl(): string {
  const value = process.env.PDN_SURROGATE_API_URL?.replace(/\/$/, "");
  if (!value) {
    throw new Error("PDN_SURROGATE_API_URL is not configured in Vercel.");
  }
  return value;
}

async function callCloudRun(path: string, body?: JsonRecord): Promise<JsonRecord> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = process.env.PDN_SURROGATE_API_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  const response = await fetch(`${cloudRunUrl()}${path}`, {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 600);
    throw new Error(`PDN Cloud Run API returned ${response.status}: ${detail}`);
  }
  return (await response.json()) as JsonRecord;
}

function compactPrediction(value: JsonRecord) {
  return {
    model: value.model,
    geometry: value.geometry,
    component: value.component,
    lpath_nh: value.lpath_nh,
    educational_decap: value.educational_decap,
    ic_pin_impedance: value.ic_pin_impedance,
    accuracy: value.accuracy,
  };
}

function asText(value: unknown): TextResult {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

async function limited(handler: () => Promise<TextResult>): Promise<TextResult> {
  const { allowed, count } = await checkAndIncrementDailyUsage(ROUTE_NAME, DAILY_LIMIT);
  if (!allowed) {
    return asText({ error: `Daily PDN MCP limit (${DAILY_LIMIT}) reached`, count });
  }
  try {
    return await handler();
  } catch (error) {
    return asText({ error: error instanceof Error ? error.message : "Unknown PDN API error" });
  }
}

export function registerPdnTools(server: ToolServer) {
  server.registerTool(
    "pdn_predict_impedance",
    {
      title: "PDN De-cap and IC impedance prediction",
      description:
        "Predicts two distinct Z(f) results: educational De-cap C+ESR+ESL+Lpath and IC-pin impedance from exact termination of an HFSS-trained complex two-port surrogate.",
      inputSchema: z.object({ ...geometryFields, ...componentFields }).refine(
        (value) => value.h_top_mm + value.h_pg_mm <= 1.36,
        { message: "h_top_mm + h_pg_mm must be <= 1.36 mm" }
      ),
    },
    async (args) =>
      limited(async () => {
        const value = args as Record<string, number>;
        const response = await callCloudRun("/v1/predict", {
          geometry: {
            d_mm: value.d_mm,
            route_len_mm: value.route_len_mm,
            h_top_mm: value.h_top_mm,
            h_pg_mm: value.h_pg_mm,
          },
          component: {
            capacitance_nf: value.capacitance_nf,
            esr_mohm: value.esr_mohm,
            esl_nh: value.esl_nh,
          },
          include_curve: false,
        });
        return asText(compactPrediction(response));
      })
  );

  server.registerTool(
    "pdn_compare_distance",
    {
      title: "Compare PDN distance cases",
      description:
        "Compares two De-cap-to-IC distances under identical routing, stackup, and component conditions. Returns both educational Lpath and separately terminated IC-pin Z(f) samples.",
      inputSchema: z
        .object({
          d_a_mm: z.number().min(2).max(24).default(2),
          d_b_mm: z.number().min(2).max(24).default(10),
          route_len_mm: geometryFields.route_len_mm,
          h_top_mm: geometryFields.h_top_mm,
          h_pg_mm: geometryFields.h_pg_mm,
          ...componentFields,
        })
        .refine((value) => value.h_top_mm + value.h_pg_mm <= 1.36, {
          message: "h_top_mm + h_pg_mm must be <= 1.36 mm",
        }),
    },
    async (args) =>
      limited(async () => {
        const value = args as Record<string, number>;
        const response = await callCloudRun("/v1/compare-distance", {
          d_a_mm: value.d_a_mm,
          d_b_mm: value.d_b_mm,
          route_len_mm: value.route_len_mm,
          h_top_mm: value.h_top_mm,
          h_pg_mm: value.h_pg_mm,
          component: {
            capacitance_nf: value.capacitance_nf,
            esr_mohm: value.esr_mohm,
            esl_nh: value.esl_nh,
          },
          include_curve: false,
        });
        const a = response.case_a as JsonRecord;
        const b = response.case_b as JsonRecord;
        return asText({
          case_a: compactPrediction(a),
          case_b: compactPrediction(b),
          difference: response.difference,
        });
      })
  );

  server.registerTool(
    "pdn_model_info",
    {
      title: "PDN surrogate model scope and accuracy",
      description:
        "Returns geometry ranges, frequency range, HFSS training/validation counts, definitions, and p90 validation accuracy before using the model.",
    },
    async () => limited(async () => asText(await callCloudRun("/v1/model-info")))
  );
}
