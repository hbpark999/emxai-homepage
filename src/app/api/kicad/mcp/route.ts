/**
 * route.ts - EMxAI KiCad PCB 생성 MCP 서버 (개발·본인용)
 *
 * 위치   : src/app/api/kicad/mcp/route.ts → 실제 주소 https://www.emxai.net/api/kicad/mcp
 * 용도   : Claude가 자연어 지시로 .kicad_pcb를 생성/검증하도록 pcb_ 툴 6종을 노출
 * 도구   : lib/tools/kicad.ts의 registerKicadTools()가 보드 생성/측정 도구를,
 *          lib/tools/kicad-drc.ts의 registerKicadDrcTools()가 외부 DRC 기반 수정 도구를 등록한다.
 *          계산/직렬화 로직은 여기 없다 - lib/kicad/*를 조합해 등록만 한다.
 * 의존   : mcp-handler (기존 src/app/api/mcp/route.js와 동일한 방식)
 */

import { createMcpHandler } from "mcp-handler";
import { registerKicadTools } from "@/lib/tools/kicad";
import { registerKicadDrcTools } from "@/lib/tools/kicad-drc";

const handler = createMcpHandler((server) => {
  registerKicadTools(server);
  registerKicadDrcTools(server);
});

export { handler as GET, handler as POST, handler as DELETE };
