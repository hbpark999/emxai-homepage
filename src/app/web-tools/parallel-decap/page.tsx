/**
 * page.tsx — /web-tools/parallel-decap
 *
 * 용도 : De-cap을 병렬로 붙였을 때의 합성 Z(f)와 반공진을 보여주는 교육용 계산기.
 *        실장 인덕턴스(VCC/GND 배선 + via)를 켜고 끄며 비교한다.
 * 대응 MCP : decap_composite_z / decap_compare_qty / decap_mount_l / decap_model_info
 * 계산 로직 : src/lib/decap.ts (웹과 MCP가 공유)
 */

import type { Metadata } from "next";
import Link from "next/link";
import ParallelDecapClient from "./parallel-decap-client";

export const metadata: Metadata = {
  title: "De-cap 병렬 임피던스 계산기",
  description:
    "여러 De-cap의 병렬 합성 Z(f), SRF, 반공진을 계산합니다. VCC/GND 실장 배선 길이로 실장 인덕턴스를 포함하거나 제외해 비교할 수 있습니다.",
  alternates: { canonical: "/web-tools/parallel-decap" },
};

export default function ParallelDecapPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[96vw] px-5 py-9 sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
            De-cap 실습
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium text-slate-950">
                De-cap 병렬 임피던스 계산기
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
                용량·개수·실장 배선 길이를 바꾸며 합성 Z(f)와 반공진을 확인합니다. De-cap의
                한쪽 pin은 VCC plane, 다른 pin은 GND plane으로 내려가므로 전류 루프가 두 경로를
                모두 지납니다. IC까지의 공통 경로는 포함하지 않는 교육용 lumped 모델입니다.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/web-tools/pdn-decap"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                HFSS 구조 해석 도구
              </Link>
              <Link
                href="/mcp"
                className="rounded-md border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100"
              >
                Claude MCP 연결 안내
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">
        <ParallelDecapClient />
      </section>
    </main>
  );
}
