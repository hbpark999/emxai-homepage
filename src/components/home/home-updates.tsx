import Image from "next/image";
import {
  educationSchedule,
  historyItems,
  postsAndTools,
  updateActivities,
} from "@/data/updates-content";

function ColumnTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid size-8 place-items-center rounded-md bg-slate-100 text-xs font-semibold text-slate-700">
        {label}
      </span>
      <h3 className="text-2xl font-medium tracking-normal text-slate-950">{title}</h3>
    </div>
  );
}

function HistoryList() {
  return (
    <div className="h-full overflow-y-auto border-l-2 border-lime-300 pl-5 pr-2">
      <div className="flex min-h-full flex-col-reverse justify-start gap-2.5">
        {historyItems.map((item) => (
          <article
            key={`${item.date}-${item.title}`}
            className="relative rounded-md border border-slate-100 bg-slate-50/90 px-3 py-2"
          >
            <span className="absolute -left-[1.66rem] top-3.5 size-3 rounded-full border-4 border-lime-300 bg-white" />
            <h4 className="text-base font-bold text-[#102947]">{item.date}</h4>
            <p className="mt-1 text-xs font-medium leading-4 text-[#536985]">{item.title}</p>
            {item.body ? (
              <p className="mt-0.5 text-xs font-medium leading-4 text-[#536985]">{item.body}</p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-[#00a9e8]">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-3xl font-medium tracking-normal text-slate-950 sm:text-4xl">
        {title}
      </h3>
      <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-lime-300" />
    </div>
  );
}

function CooperationAndHistory() {
  return (
    <section className="mt-16 border-t border-slate-100 pt-12">
      <div className="grid gap-8 xl:grid-cols-[0.32fr_0.68fr] xl:items-start">
        <div>
          <SectionHeading eyebrow="History" title="HISTORY" />
          <div className="h-[28rem] rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <HistoryList />
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Collaboration Network" title="협력 및 네트워크" />
          <div className="flex h-[28rem] items-center overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <Image
              src="/images/collaboration-network.png"
              alt="EMxAI 협력 및 네트워크"
              width={1200}
              height={680}
              className="h-auto w-full object-contain"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeUpdates() {
  return (
    <section className="border-t border-slate-100 bg-[#f5f8fb]">
      <div className="mx-auto w-full max-w-[94vw] px-6 pb-24 pt-16 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#2d95ff]">
            EMxAI Updates
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-normal text-slate-950 sm:text-4xl">
            Education · Posts · Activities
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-lime-300" />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <ColumnTitle label="EDU" title="외부 기관 교육" />
            <div className="mt-7 space-y-6">
              {educationSchedule.map((group) => (
                <div key={group.month} className="relative pl-6">
                  <span className="absolute left-0 top-2.5 size-2 rounded-full border-2 border-cyan-300" />
                  <h4 className="text-xl font-medium text-slate-950">{group.month}</h4>
                  <ul className="mt-3 space-y-2 text-sm font-normal leading-6 text-slate-700">
                    {group.items.map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <ColumnTitle label="NEW" title="최신 게시물 & 도구" />
            <div className="mt-7 space-y-6">
              {postsAndTools.map((post) => (
                <article key={post.title}>
                  <h4 className="text-xl font-normal leading-7 text-slate-950">
                    {post.title}
                  </h4>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-sm font-normal leading-5 text-slate-500 underline-offset-4 transition hover:text-[#2563eb] hover:underline"
                  >
                    {post.action}
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <ColumnTitle label="ACT" title="주요활동" />
            <div className="mt-7 space-y-6">
              {updateActivities.map((activity) => (
                <article key={activity.title}>
                  <h4 className="text-xl font-normal leading-7 text-slate-950">
                    {activity.title}
                  </h4>
                  <p className="mt-2 text-sm font-normal leading-6 text-slate-600">
                    {activity.body}
                  </p>
                  {activity.note && activity.href ? (
                    <a
                      href={activity.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-sm font-normal leading-5 text-slate-500 underline-offset-4 transition hover:text-[#2563eb] hover:underline"
                    >
                      {activity.note}
                    </a>
                  ) : activity.note ? (
                    <p className="mt-2 text-sm font-normal leading-5 text-slate-500">
                      {activity.note}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>

        <CooperationAndHistory />
      </div>
    </section>
  );
}
