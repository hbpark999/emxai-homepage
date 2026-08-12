import { EngineeringTools } from "@/components/web-tools/engineering-tools";

export default function WebToolsPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[92vw] px-6 py-14 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
            Web Tools
          </p>
          <h1 className="mt-4 text-3xl font-medium text-slate-950">
            전자파 설계·분석 도구
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            원본 사이트의 도구 흐름을 Next.js 내부에서 바로 실행할 수 있도록 우선 핵심 계산기와 S-parameter viewer부터 연결했습니다.
          </p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-[92vw] px-6 py-10 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
        <EngineeringTools />
      </section>
    </main>
  );
}
