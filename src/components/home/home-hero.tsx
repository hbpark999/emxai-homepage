import Image from "next/image";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[calc(100vh-77px)] max-w-[105rem] items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full">
          <h1 className="mx-auto mb-8 max-w-6xl text-center text-2xl font-black leading-tight tracking-normal text-[#6f35b8] sm:text-3xl lg:text-4xl">
            전자파 설계·분석기술 AI 전환을 위한 Solution 개발, 자문 및 교육
          </h1>
          <Image
            src="/images/emxai-business-summary-revised.png"
            alt="전자파 설계/분석기술 AI 전환을 위한 Solution 개발, 자문 및 교육"
            width={3260}
            height={1023}
            className="h-auto w-full"
            priority
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
