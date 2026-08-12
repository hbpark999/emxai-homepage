import Image from "next/image";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-[#f6f9fc]">
      <div className="mx-auto px-6 py-6 sm:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[94vw] lg:max-w-[90vw] xl:max-w-[88vw]">
          <h1 className="mx-auto mb-4 max-w-6xl text-center text-2xl font-black leading-tight tracking-normal text-[#6f35b8] sm:text-3xl lg:text-4xl">
            전자파 설계·분석기술 AI 전환을 위한 Solution 개발, 자문 및 교육
          </h1>
          <Image
            src="/images/emxai-business-summary-revised.png"
            alt="전자파 설계·분석기술 AI 전환을 위한 Solution 개발, 자문 및 교육"
            width={3260}
            height={1023}
            className="mx-auto h-auto w-full"
            priority
            sizes="(min-width: 1280px) 88vw, (min-width: 1024px) 90vw, 94vw"
          />
        </div>
      </div>
    </section>
  );
}
