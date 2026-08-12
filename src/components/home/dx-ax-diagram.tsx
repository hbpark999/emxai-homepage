import { dxAxDiagram } from "@/data/home-content";

const engineeringVisuals = ["Guide", "CAE", "VNA", "EMC"];
const aiVisuals = ["Claude", "GPT", "Custom", "Local"];

export function DxAxDiagram() {
  return (
    <div className="rounded-lg bg-slate-100 p-4 text-slate-950 shadow-2xl shadow-black/30 sm:p-5">
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-5 sm:px-6">
        <h2 className="text-center text-xl font-black italic text-violet-700 sm:text-2xl lg:text-3xl">
          {dxAxDiagram.title}
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_13rem] xl:grid-cols-[1fr_15rem]">
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {dxAxDiagram.engineeringSteps.map((step, index) => (
                <div key={step.title} className="text-center">
                  <div className="mx-auto grid aspect-[1.55] w-full max-w-[8.5rem] place-items-center rounded-sm bg-slate-100 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                    {engineeringVisuals[index]}
                  </div>
                  <p className="mt-3 text-sm font-semibold sm:text-base">{step.title}</p>
                  {step.note ? <p className="mt-1 text-xs text-slate-400">{step.note}</p> : null}
                </div>
              ))}
            </div>

            <div className="my-7 grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-3 sm:grid-cols-[4rem_1fr_4rem]">
              <span className="text-2xl font-black text-slate-500">DX</span>
              <div className="relative h-9 rounded-full bg-blue-100">
                <div className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[24px] border-l-[34px] border-y-transparent border-l-blue-100" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 text-2xl font-black text-blue-500 shadow-sm">
                  ↻
                </div>
              </div>
              <span className="text-2xl font-black text-violet-700">AX</span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {aiVisuals.map((item, index) => (
                <div key={item} className="text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-md bg-slate-950 text-xs font-bold text-white sm:size-20">
                    {item}
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {dxAxDiagram.aiTools[index] ?? item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col justify-center gap-4 border-l border-blue-200 pl-5">
            <span className="absolute -left-[7px] top-1/2 size-3 -translate-y-1/2 rounded-full bg-blue-500" />
            {dxAxDiagram.services.map((service, index) => (
              <div key={service.title}>
                <div className="rounded-sm border border-blue-700 bg-blue-500 px-4 py-2 text-base font-semibold text-white sm:text-lg">
                  {index + 1}. {service.title}
                </div>
                <p className="px-4 py-2 text-sm leading-6 text-slate-700">{service.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
