const flowSteps = ["설계", "Proto", "Test", "양산"];

const roleItems = [
  {
    index: "1)",
    muted: "빠른 설계 최적화를 위한",
    strong: "전자파 AI Model 개발",
  },
  {
    index: "2)",
    muted: "고속·고주파",
    strong: "EMI/SI Design Rule개발",
  },
  {
    index: "3)",
    muted: "Simulation정확도 향상을 위한",
    strong: "형상·재료 모델링 기술",
  },
  {
    index: "4)",
    muted: "AX전환을 위한 개발자",
    strong: "교육 및 환경 구축 자문",
  },
];

export function EmxaiRoleDiagram() {
  return (
    <div className="rounded-lg border border-white/20 bg-slate-700/55 p-4 shadow-2xl shadow-black/30 sm:p-6">
      <div className="rounded-lg bg-white px-5 py-8 text-slate-950 sm:px-7 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr_1.15fr]">
          <section>
            <h2 className="text-lg font-semibold text-cyan-500">
              제품의 고속화(유선), 고주파화(무선)에 따른
            </h2>
            <ul className="mt-5 space-y-3 text-base leading-7 text-slate-800">
              <li>• 고속·고주파 대응 EMI/SI기술 필요</li>
              <li>• AX전환을 통한 경쟁력 향상 요구</li>
            </ul>
            <div className="mt-10 grid grid-cols-3 items-end gap-5">
              <div className="col-span-1">
                <div className="h-20 rounded-md bg-gradient-to-br from-sky-100 via-white to-cyan-200 shadow-inner ring-1 ring-slate-200" />
              </div>
              <div className="col-span-1">
                <div className="h-24 rounded-[1.6rem] bg-gradient-to-br from-slate-700 via-slate-200 to-slate-950 shadow-md" />
              </div>
              <div className="col-span-1">
                <div className="mx-auto size-20 rounded-full bg-gradient-to-br from-yellow-200 via-emerald-300 to-cyan-700 shadow-md" />
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-xl font-semibold text-fuchsia-500">개발 부서</h2>
            <div className="mt-8 flex items-center justify-center gap-5">
              <div className="space-y-3">
                {flowSteps.map((step, index) => (
                  <div key={step} className="relative">
                    <div className="grid h-9 w-28 place-items-center bg-cyan-100 text-sm font-bold text-white">
                      {step}
                    </div>
                    {index < flowSteps.length - 1 ? (
                      <div className="mx-auto h-4 w-px bg-slate-300" />
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="space-y-6 text-left text-base font-medium">
                <p className="text-cyan-500">Simulation</p>
                <p className="text-cyan-500">DRC</p>
                <p className="text-red-500">+ AX전환</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-fuchsia-500">EMxAI 역할</h2>
            <div className="mt-5 space-y-4 text-sm leading-7">
              {roleItems.map((item) => (
                <p key={item.index}>
                  <span className="font-semibold text-cyan-500">{item.index}</span>{" "}
                  <span className="text-slate-300">{item.muted} </span>
                  <span className="font-semibold text-cyan-500">{item.strong}</span>
                </p>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-[1.1fr_0.9fr_0.75fr] items-end gap-4">
              <div className="h-24 rounded-sm bg-gradient-to-br from-blue-700 via-white to-white ring-1 ring-slate-200" />
              <div className="h-20 rounded-sm bg-gradient-to-br from-sky-300 via-yellow-300 to-blue-600 ring-1 ring-slate-200" />
              <div className="h-16 rounded-sm bg-gradient-to-br from-yellow-200 via-orange-200 to-sky-200 ring-1 ring-slate-200" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
