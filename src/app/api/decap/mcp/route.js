/**
 * route.js - EMxAI De-cap 병렬 임피던스 MCP 서버 (교육용)
 *
 * 위치   : src/app/api/decap/mcp/route.js → 실제 주소 https://www.emxai.net/api/decap/mcp
 * 용도   : 수강생이 De-cap 도구만 연결하도록 decap_* 4종만 노출한다.
 *          Z0·PDN 도구가 함께 보이면 실습 중 혼선이 생기므로 주소를 분리했다.
 * 구분   : 전체 도구(Z0 3종 + PDN 3종)는 /api/mcp에 그대로 둔다.
 *          decap_* 도구는 이 주소에만 등록한다 - 한 도구가 두 커넥터에 중복되지 않는다.
 * 실행   : Vercel 함수 안에서 닫힌 형태 수식으로 즉시 계산한다. Cloud Run, 모델 파일,
 *          환경변수를 쓰지 않으므로 콜드스타트나 외부 호출 실패가 없다.
 * 이름   : serverInfo.name이 Claude 커넥터 목록에 표시된다.
 */

import { createMcpHandler } from "mcp-handler";
import { registerDecapTools } from "@/lib/tools/decap";

const handler = createMcpHandler(
  (server) => {
    registerDecapTools(server);
  },
  {
    serverInfo: { name: "EMxAI De-cap 병렬 임피던스", version: "1.0.0" },
    instructions:
      "De-cap을 병렬로 붙였을 때의 합성 Z(f), SRF, 반공진을 계산하는 교육용 도구다. " +
      "부품(C·ESR·ESL·개수)과 실장 경로(VCC/GND 배선, via)만 다루며, IC까지의 공통 " +
      "plane 경로는 포함하지 않는다. PCB 형상 기반 HFSS surrogate 해석이 필요하면 " +
      "별도 서버(EMxAI 전자파 도구)의 pdn_* 도구를 쓴다.",
  },
);

export { handler as GET, handler as POST, handler as DELETE };
