/**
 * route.js - EMxAI Microstrip Diff Pair MCP 서버 (교육용)
 *
 * 위치   : src/app/api/diffpair/mcp/route.js → 실제 주소 https://www.emxai.net/api/diffpair/mcp
 * 용도   : 차동 쌍 Zdiff 실습에서 diffpair_* 4종만 연결하도록 주소를 분리했다.
 * 구분   : Z0·PDN 도구는 /api/mcp, De-cap 병렬 합성은 /api/decap/mcp에 있다.
 *          한 도구가 두 커넥터에 중복되지 않도록 diffpair_*는 이 주소에만 등록한다.
 * 실행   : Vercel 함수 안에서 IPC-2141 근사식으로 즉시 계산한다. 외부 서버를 호출하지 않는다.
 * 이름   : serverInfo.name이 Claude 커넥터 목록에 표시된다.
 */

import { createMcpHandler } from "mcp-handler";
import { registerDiffPairTools } from "@/lib/tools/diffpair";

const handler = createMcpHandler(
  (server) => {
    registerDiffPairTools(server);
  },
  {
    serverInfo: { name: "EMxAI Microstrip Diff Pair", version: "1.0.0" },
    instructions:
      "Edge-coupled surface microstrip differential pair의 Zdiff를 IPC-2141 계열 근사식으로 계산하는 " +
      "교육용 도구다. 공개 계산기 /web-tools/diff-pair 와 같은 수식이라 화면 값과 답이 일치한다. " +
      "솔더마스크, 동박 거칠기, 에칭 단면, 유리섬유 직조, 주파수 분산은 포함하지 않으므로 제조 전에는 " +
      "PCB 업체 stackup 계산과 field solver로 재검증해야 한다.",
  },
);

export { handler as GET, handler as POST, handler as DELETE };
