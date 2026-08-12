import {
  educationSchedule,
  historyItems,
  postsAndTools,
  updateActivities,
} from "@/data/updates-content";

function ColumnTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-7 place-items-center rounded-md bg-slate-100 text-[10px] font-semibold text-slate-700">
        {label}
      </span>
      <h3 className="text-lg font-medium tracking-normal text-slate-950">{title}</h3>
    </div>
  );
}

function HistoryTrack() {
  const loopItems = [...historyItems, ...historyItems];

  return (
    <div className="relative mt-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
      <div className="flex w-max animate-[history-slide_45s_linear_infinite] gap-12 hover:[animation-play-state:paused]">
        {loopItems.map((item, index) => (
          <article
            key={`${item.date}-${item.title}-${index}`}
            className="relative w-44 shrink-0 pt-10"
          >
            <span className="absolute left-0 top-0 size-3 rounded-full border-4 border-lime-300 bg-white" />
            <h4 className="text-sm font-black text-[#102947]">{item.date}</h4>
            <p className="mt-5 text-sm font-semibold leading-6 text-[#536985]">{item.title}</p>
            {item.body ? (
              <p className="mt-1 text-sm font-semibold leading-6 text-[#536985]">{item.body}</p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

export function HomeUpdates() {
  return (
    <section className="border-t border-slate-100 bg-white">
      <style>{`
        @keyframes history-slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div className="mx-auto max-w-[1180px] px-6 py-20 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2d95ff]">
            EMxAI Updates
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-normal text-slate-950 sm:text-4xl">
            Education · Posts · Activities
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-lime-300" />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-3">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <ColumnTitle label="EDU" title="외부 기관 교육" />
            <div className="mt-7 space-y-7">
              {educationSchedule.map((group) => (
                <div key={group.month} className="relative pl-6">
                  <span className="absolute left-0 top-2 size-2 rounded-full border-2 border-cyan-300" />
                  <h4 className="text-sm font-medium text-slate-950">{group.month}</h4>
                  <ul className="mt-3 space-y-2 text-xs font-normal leading-6 text-slate-700">
                    {group.items.map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <ColumnTitle label="NEW" title="최신 게시물 & 도구" />
            <div className="mt-7 space-y-7">
              {postsAndTools.map((post) => (
                <article key={post.title}>
                  <h4 className="text-sm font-normal leading-6 text-slate-950">
                    {post.title}
                  </h4>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-xs font-normal text-slate-500 underline-offset-4 transition hover:text-[#2563eb] hover:underline"
                  >
                    {post.action}
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <ColumnTitle label="ACT" title="주요활동" />
            <div className="mt-7 space-y-7">
              {updateActivities.map((activity) => (
                <article key={activity.title}>
                  <h4 className="text-sm font-normal leading-6 text-slate-950">
                    {activity.title}
                  </h4>
                  <p className="mt-2 text-xs font-normal leading-5 text-slate-600">
                    {activity.body}
                  </p>
                  {activity.note && activity.href ? (
                    <a
                      href={activity.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-xs font-normal text-slate-500 underline-offset-4 transition hover:text-[#2563eb] hover:underline"
                    >
                      {activity.note}
                    </a>
                  ) : activity.note ? (
                    <p className="mt-2 text-xs font-normal text-slate-500">{activity.note}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-20 border-t border-slate-100 pt-14">
          <div className="text-center">
            <h3 className="text-3xl font-medium uppercase text-[#102947]">History</h3>
            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-lime-300" />
          </div>
          <HistoryTrack />
        </div>
      </div>
    </section>
  );
}
