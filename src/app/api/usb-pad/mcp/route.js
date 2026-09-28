/**
 * route.js - EMxAI USB AC Coupling Pad MCP 서버 (교육용)
 *
 * 위치   : src/app/api/usb-pad/mcp/route.js → 실제 주소 https://www.emxai.net/api/usb-pad/mcp
 * 용도   : 웹 데모(/web-tools/usb-ac-pad)와 같은 서로게이트를 Claude가 직접 호출하도록 노출한다.
 * 구분   : Z0·PDN은 /api/mcp, De-cap 병렬은 /api/decap/mcp, 차동 쌍 근사식은 /api/diffpair/mcp.
 * 실행   : Vercel 함수 안에서 계산한다. 모델 파일(16.5 MB)은 public 밖에 두어
 *          정적 파일로 내려받을 수 없고, 함수 번들에만 포함된다.
 * 한계   : 교육용 경향 모델이며 제조 판정·USB 규격 적합성 판단에 쓰지 않는다.
 */

import { createMcpHandler } from "mcp-handler";
import { registerUsbPadTools } from "@/lib/tools/usb-pad";

const handler = createMcpHandler(
  (server) => {
    registerUsbPadTools(server);
  },
  {
    serverInfo: { name: "EMxAI USB AC Pad Surrogate", version: "1.0.0" },
    instructions:
      "USB 차동 배선의 AC coupling 패드 구간을 HFSS 학습 서로게이트로 예측하는 교육용 도구다. " +
      "선폭 W, 간격 S, Void 크기와 직렬 부품(C·ESR·ESL)으로 Sdd11·Sdd21, 차동 TDR, impulse 폭을 계산한다. " +
      "학습 24 케이스·개발 평가 6 케이스이며 독립 최종 검증 전이다. DC는 외삽값이고, " +
      "제조 판정이나 USB 규격 적합성 판단에 쓰지 않는다. 예측 전에 usbpad_model_info로 적용 범위를 확인한다.",
  },
);

export { handler as GET, handler as POST, handler as DELETE };
