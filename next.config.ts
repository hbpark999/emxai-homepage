import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // USB AC pad MCP는 public 밖의 모델 파일을 런타임에 읽는다.
  // 서버리스 번들에 그 파일이 함께 들어가도록 명시한다.
  outputFileTracingIncludes: {
    "/api/usb-pad/mcp": ["./src/lib/usb-ac-pad/model.usbgp"],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.imweb.me",
      },
    ],
  },
};

export default nextConfig;
