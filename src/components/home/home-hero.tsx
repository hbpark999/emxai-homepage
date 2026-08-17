import Image from "next/image";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-[#f6f9fc]">
      <div className="mx-auto px-6 py-6 sm:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[94vw] lg:max-w-[76vw] xl:max-w-[70vw]">
          <h1 className="mx-auto mb-5 max-w-7xl text-center text-3xl font-black leading-tight tracking-normal text-blue-600 sm:text-4xl lg:text-5xl">
            <span className="block">
              전자파(EMI/EMC, SI, RF) 설계·분석 업무의 AI 전환을 위한
            </span>
            <span className="block">솔루션 개발, 자문 및 교육</span>
          </h1>
          <Image
            src="/images/emxai-business-summary-revised.png"
            alt="전자파(EMI/EMC, SI, RF) 설계·분석 업무의 AI 전환을 위한 솔루션 개발, 자문 및 교육"
            width={3260}
            height={1023}
            className="mx-auto h-auto w-full"
            priority
            sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 76vw, 94vw"
          />
        </div>
      </div>
    </section>
  );
}
