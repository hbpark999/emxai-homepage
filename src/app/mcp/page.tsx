import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Claude MCP 연결",
  description: "EMxAI Vercel remote MCP 서버와 HFSS 기반 PDN surrogate 도구 연결 안내입니다.",
  alternates: { canonical: "/mcp" },
};

const endpoint = "https://www.emxai.net/api/mcp";

export default function McpPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
            Remote MCP Server
          </p>
          <h1 className="mt-4 text-3xl font-medium text-slate-950">Claude에서 EMxAI 도구 연결</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            Vercel의 MCP endpoint가 Claude 요청을 받고, PDN 수치 계산은 Cloud Run의
            HFSS 기반 surrogate API에서 수행합니다. 교육생 PC에는 Python을 설치할 필요가 없습니다.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-10 sm:px-8 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">Endpoint</p>
          <code className="mt-4 block overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-sky-200">
            {endpoint}
          </code>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Claude의 원격 MCP 커넥터에서 위 URL을 추가하면 홈페이지가 제공하는 도구 목록을 읽습니다.
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">PDN tools</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li><code>pdn_model_info</code> — 범위, 정의, p90 검증 정확도</li>
            <li><code>pdn_predict_impedance</code> — De-cap Z(f)와 IC 핀 Z(f)</li>
            <li><code>pdn_compare_distance</code> — 동일 조건의 d 두 값 비교</li>
          </ul>
          <Link
            href="/web-tools/pdn-decap"
            className="mt-6 inline-flex rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
          >
            웹 GUI 열기
          </Link>
        </article>
      </section>
    </main>
  );
}
