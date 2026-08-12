import Image from "next/image";

const workChanges = [
  {
    number: "01",
    title: "엔지니어 역할의 변화",
    body: "How, 즉 도구를 어떻게 실행할 것인가에 집중하던 방식에서 What, 즉 무엇을 풀어야 하고 어떻게 정의할 것인가를 중심으로 문제 정의와 기획 역량이 더욱 중요해집니다.",
    image: "/about/about-image-2.png",
    imageAlt: "How 중심에서 What 중심으로 변화하는 AI Coding 업무 방식",
  },
  {
    number: "02",
    title: "업무 수행 방식의 변화",
    body: "AI를 활용하면 도메인 전문가가 더 넓은 범위의 업무를 직접 수행할 수 있습니다. 분석, 자동화, 검증, 보고까지 연결되면서 개인의 업무 범위와 실행 역량이 확장됩니다.",
    image: "/about/about-image-3.png",
    imageAlt: "도메인 전문가와 AI 기반 업무 수행 방식 변화",
  },
  {
    number: "03",
    title: "업무 환경의 변화",
    body: "기존에는 개별 Tools 안에 AI가 들어가는 흐름이었다면, 앞으로는 AI가 중심이 되고 그 안에서 Simulation, Measurement, Report 도구들이 연결되는 Tools in AI 환경으로 변화합니다.",
    image: "/about/about-image-4.png",
    imageAlt: "AI in Tools와 Tools in AI 업무 환경 비교",
  },
];

const activities = [
  "1990년대 중반, 기존 Trial & Error 중심의 EMC 대응 방식에서 Design Rule 및 Simulation 기반 EMC 설계 방법론으로 전환을 시작했습니다.",
  "LG전자와 삼성전자에서 국내외 연구기관과의 협력 및 자체 연구를 통해 신제품 개발에 필요한 EMC/SI 설계·분석 방법론을 개발하고 제품 개발 부서를 지원했습니다.",
  "고속신호 EMI/SI 설계 방법, Simulation 방법론, Design Rule 개발을 수행했습니다.",
  "고감도 Near Field Probe, Near Field 기반 EMI 분석, Array Antenna Near-to-Far Field 변환, Deep Learning 기반 평가 방법 등 전자파 정밀 측정·분석 방법을 개발했습니다.",
  "내외부 전문가가 참여하는 수백 명 규모의 전자파 기술 워크숍을 약 10년간 기획·운영했습니다.",
  "2010년대 후반부터 AI 기반 전자파 설계·분석 방법 및 솔루션 개발을 추진했고, 2024년 10월 EMxAI를 설립했습니다.",
];

const academicActivities = [
  "IEEE EMC Society Senior Member ('15~)",
  "EMC Compo TPC 활동 ('12~'24)",
  "APEMC 등 국제 학술 활동 참여",
  "한국전자파학회 EMC 연구회, 전파교육연구회, Interconnect Package 연구회 활동",
  "한국전자파학회 전파교육연구회 위원장 ('23, '24)",
  "한국전자파학회 전자파AI연구반 위원장(현재)",
  "한국전자파학회 워크숍, 대학원 특강, RAPA·TTA 재직자 교육",
  "AI 특화 공동교육센터 산업계 전문가 참여",
];

function NumberMark({ value }: { value: string }) {
  return (
    <div className="grid size-14 shrink-0 place-items-center rounded-full bg-[#55deda] text-base font-black text-white sm:size-16">
      {value}
    </div>
  );
}

function WorkChangeSection({ item }: { item: (typeof workChanges)[number] }) {
  const textBlock = (
    <div className="flex gap-4 sm:gap-5">
      <NumberMark value={item.number} />
      <div className="pt-1">
        <h3 className="text-2xl font-black tracking-normal text-[#243149] sm:text-3xl">
          {item.title}
        </h3>
        <p className="mt-5 max-w-[24rem] text-base font-medium leading-[1.85] tracking-normal text-[#3f6f9f]">
          {item.body}
        </p>
      </div>
    </div>
  );

  const imageBlock = (
    <div className="relative min-h-[11rem] w-full">
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        className="object-contain"
        sizes="(min-width: 1280px) 25rem, 100vw"
      />
    </div>
  );

  return (
    <section className="grid items-center gap-7 lg:grid-cols-2 lg:gap-9">
      {textBlock}
      {imageBlock}
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[980px] px-6 pb-16 pt-7 sm:px-8">
        <section className="min-h-[16rem] border-b border-slate-100 pb-10">
          <p className="text-2xl font-black uppercase leading-none tracking-[0.04em] text-[#b748f0] sm:text-[1.65rem]">
            ABOUT EMXAI
          </p>
          <h1 className="mt-6 text-xl font-medium leading-tight tracking-normal text-[#1f7fe5] sm:text-2xl">
            EMI/SI 설계·분석 업무의 AI 전환을 지원하는 전문 기술기업
          </h1>
          <p className="mt-6 max-w-[56rem] text-base font-black leading-[1.7] tracking-normal text-[#102947] sm:text-lg">
            EMxAI는 30년 이상의 EMC/SI 실무 경험을 바탕으로, EMI/SI 설계·분석 업무의
            AI 전환과 엔지니어 교육을 지원하는 전문 기술기업입니다.
          </p>
        </section>

        <section className="pt-8">
          <p className="text-base font-black uppercase tracking-[0.14em] text-[#39d8d3] sm:text-lg">
            CHANGES IN EMI/SI WORK METHODS IN THE AI ERA
          </p>
          <h2 className="mt-5 text-2xl font-black leading-tight tracking-normal text-[#2b394f] sm:text-3xl">
            EMxAI가 생각하는 AI 시대 EMI/SI 업무 방식의 변화
          </h2>
          <div className="mt-14 space-y-20">
            {workChanges.map((item) => (
              <WorkChangeSection key={item.number} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-slate-100 pt-10">
          <p className="text-base font-black uppercase tracking-[0.14em] text-[#39d8d3]">
            EVOLUTION OF EMI/SI TECHNOLOGY
          </p>
          <h2 className="mt-5 text-2xl font-black leading-tight text-[#2b394f]">
            AI 시대를 향한 EMI/SI 기술의 진화
          </h2>
          <p className="mt-6 max-w-[50rem] text-base font-medium leading-[1.8] text-[#3f6f9f]">
            전자제품의 EMI/SI 기술은 Trial & Error 중심의 대응 방식에서 출발했습니다.
            1990년대 중반부터 Simulation과 Design Rule Check 기반의 설계 방법론으로
            발전해 왔으며, 이제 약 30년 만에 AI를 중심으로 한 자동화·자율화 단계로
            진화가 시작되고 있습니다.
          </p>
          <div className="relative mt-7 aspect-[1114/298] w-full">
            <Image
              src="/about/about-image-5.png"
              alt="EMI/SI 기술 진화 단계"
              fill
              className="object-contain"
              sizes="(min-width: 1280px) 58rem, 100vw"
            />
          </div>
        </section>

        <section className="mt-20 grid gap-8 border-t border-slate-100 pt-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-base font-black uppercase tracking-[0.14em] text-[#39d8d3]">
              MOTIVATION FOR FOUNDING
            </p>
            <h2 className="mt-5 text-2xl font-black leading-tight text-[#2b394f]">
              EMxAI의 창업 동기
            </h2>
            <div className="mt-7 space-y-6">
              <div>
                <p className="text-base font-black text-[#1f7fe5]">01</p>
                <h3 className="mt-2 text-xl font-black text-[#2b394f]">
                  EMI/SI 설계·분석의 AX 전환
                </h3>
                <p className="mt-4 text-base font-medium leading-[1.75] text-[#3f6f9f]">
                  EMI/SI 특화 AI 솔루션과 기술 자문을 통해 설계·분석 업무의 AX화를
                  지원하고, 시간과 비용 측면의 혁신을 추구합니다.
                </p>
              </div>
              <div>
                <p className="text-base font-black text-[#1f7fe5]">02</p>
                <h3 className="mt-2 text-xl font-black text-[#2b394f]">
                  AI 시대 엔지니어 역량 향상
                </h3>
                <p className="mt-4 text-base font-medium leading-[1.75] text-[#3f6f9f]">
                  전자파 엔지니어와 회로 개발자가 AI 시대에 필요한 문제 정의, 분석,
                  자동화 활용 능력을 갖출 수 있도록 실무형 교육을 제공합니다.
                </p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[15rem]">
            <Image
              src="/about/about-image-4.png"
              alt="AI in Tools와 Tools in AI 업무 환경 변화"
              fill
              className="object-contain"
              sizes="(min-width: 1280px) 25rem, 100vw"
            />
          </div>
        </section>

        <section className="mt-20 border-t border-slate-100 pt-10">
          <p className="text-base font-black uppercase tracking-[0.14em] text-[#39d8d3]">
            REPRESENTATIVE MAIN ACTIVITIES
          </p>
          <h2 className="mt-5 text-2xl font-black leading-tight text-[#2b394f]">
            대표 주요 활동
          </h2>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <ul className="space-y-3 text-sm font-medium leading-[1.75] text-[#3f5877]">
              {activities.map((item) => (
                <li key={item} className="pl-5 [text-indent:-1.25rem]">
                  <span className="font-black text-[#1f7fe5]">•</span> {item}
                </li>
              ))}
            </ul>
            <div className="relative min-h-[15rem]">
              <Image
                src="/about/about-image-3.png"
                alt="도메인 전문가와 AI 기반 업무 확장"
                fill
                className="object-contain"
                sizes="(min-width: 1280px) 25rem, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-slate-100 pt-10">
          <p className="text-base font-black uppercase tracking-[0.14em] text-[#39d8d3]">
            ACADEMIC ACTIVITIES
          </p>
          <h2 className="mt-5 text-2xl font-black leading-tight text-[#2b394f]">
            학회 및 전문 활동
          </h2>
          <div className="mt-7 grid gap-x-10 gap-y-3 text-sm font-medium leading-[1.75] text-[#3f5877] sm:grid-cols-2">
            {academicActivities.map((item) => (
              <p key={item} className="pl-5 [text-indent:-1.25rem]">
                <span className="font-black text-[#1f7fe5]">•</span> {item}
              </p>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
