import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated artifact validation output (not source).
    ".artifacts/**",
    // 브라우저 데모에서 그대로 복사한 계산 모듈(CommonJS). 수정 없이 쓰는 것이 목적이다.
    "src/lib/usb-ac-pad/**",
  ]),
]);

export default eslintConfig;
