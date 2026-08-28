/**
 * route.js - EMxAI Z0 계산기 MCP 서버
 *
 * 위치   : src/app/api/mcp/route.js → 실제 주소 https://www.emxai.net/api/mcp
 * 용도   : Claude가 Z0 계산 엔진(lib/z0.js)을 직접 호출하도록 도구 3종을 노출
 * 도구   : calc_z0(정방향) / solve_width(역산) / sweep_z0(민감도)
 * 단위   : 모든 길이 mm, 임피던스 ohm
 * 의존   : npm i mcp-handler @modelcontextprotocol/server zod
 *          (mcp-handler 2.x는 registerTool + z.object() 입력 스키마를 사용한다.
 *          구버전 문서의 server.tool(...) 가변인자 형태는 2.x에서 제거되었다.)
 */

import sharp from "sharp";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { calcZ0, solveWidth, sweepZ0 } from "@/lib/z0";
import { buildDiagramSvg } from "@/lib/z0-diagram";

/** 단면도+수식 SVG를 PNG로 변환해 MCP 이미지 콘텐츠 블록으로 만든다. */
async function diagramImageContent(structure, params, result) {
  const svg = buildDiagramSvg(structure, params, result);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return { type: "image", data: png.toString("base64"), mimeType: "image/png" };
}

const geometry = {
  structure: z
    .enum(["microstrip", "stripline", "diff"])
    .default("microstrip")
    .describe("선로 구조. diff는 차동 마이크로스트립"),
  h: z.number().optional().describe("마이크로스트립 유전체 두께 [mm]"),
  b: z.number().optional().describe("스트립라인 기준면 간 유전체 두께 [mm]"),
  t: z.number().default(0.035).describe("도체 두께 [mm]. 1oz 동박이 0.035"),
  er: z.number().default(4.3).describe("비유전율. FR-4는 약 4.3"),
  s: z.number().optional().describe("차동 선로 간격 [mm]. structure=diff에서만 사용"),
};

const handler = createMcpHandler((server) => {
  server.registerTool(
    "calc_z0",
    {
      title: "Z0 계산",
      description: "주어진 형상에서 특성임피던스를 계산한다. 폭은 알고 Z0가 궁금할 때 사용",
      inputSchema: z.object({ ...geometry, w: z.number().describe("폭 [mm]") }),
    },
    async (a) => {
      const r = calcZ0(a);
      const zd = r.zdiff ? `, Zdiff=${r.zdiff.toFixed(2)}옴` : "";
      const image = await diagramImageContent(a.structure, a, r);
      return {
        content: [
          {
            type: "text",
            text: `구조 ${r.structure} / 폭 ${a.w}mm
Z0 = ${r.z0.toFixed(2)}옴${zd}
실효 유전율 eeff = ${r.eeff.toFixed(3)}`,
          },
          image,
        ],
      };
    }
  );

  server.registerTool(
    "solve_width",
    {
      title: "폭 역산",
      description: "목표 임피던스를 만족하는 폭을 역산한다. 50옴 매칭 조건을 물어볼 때 사용",
      inputSchema: z.object({
        ...geometry,
        target: z.number().default(50).describe("목표 임피던스 [ohm]"),
      }),
    },
    async (a) => {
      const r = solveWidth(a.target, a);
      if (!r.ok) {
        return { content: [{ type: "text", text: `역산 실패: ${r.reason}` }] };
      }
      const ref = a.structure === "stripline" ? a.b : a.h;
      const solvedParams = { ...a, w: r.w };
      const image = await diagramImageContent(a.structure, solvedParams, r);
      return {
        content: [
          {
            type: "text",
            text: `목표 ${a.target}옴 → 필요한 폭 w = ${r.w.toFixed(4)} mm
검증 Z0 = ${r.primary.toFixed(2)}옴 (오차 ${r.error.toFixed(3)}옴)
형상비 w/h = ${(r.w / ref).toFixed(3)}, eeff = ${r.eeff.toFixed(3)}

참고: 유전체 두께가 커지면 같은 임피던스를 위해 폭도 함께 커진다.`,
          },
          image,
        ],
      };
    }
  );

  server.registerTool(
    "sweep_z0",
    {
      title: "민감도 스윕",
      description: "변수 하나를 범위 내에서 변화시키며 Z0 추이를 본다. 민감도 설명에 사용",
      inputSchema: z.object({
        ...geometry,
        w: z.number().describe("폭 [mm]"),
        variable: z.enum(["w", "h", "b", "t", "er", "s"]).describe("탐색 변수"),
        from: z.number().describe("시작값"),
        to: z.number().describe("끝값"),
        steps: z.number().default(9).describe("스텝 개수 (2~25)"),
      }),
    },
    async (a) => {
      const rows = sweepZ0(a.variable, a.from, a.to, a.steps, a);
      const table = rows
        .map((d) => `${a.variable}=${d[a.variable]} → Z0=${d.z0}옴`)
        .join("\n");
      return { content: [{ type: "text", text: table }] };
    }
  );
});

export { handler as GET, handler as POST, handler as DELETE };
