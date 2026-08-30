export const homeHero = {
  eyebrow: "EM powered by AI",
  emCaption: "설계 분석 방법 개발 30년",
  aiCaption: "기반 전자파 Solution",
  message: "EMI/SI Simulation · DRC · 측정/분석에 생성형 AI를 도입하면 개발은 더 정확하고, 빨라집니다.",
  description:
    "전자파(EMI/EMC, SI, RF) 설계·분석 업무의 AI 전환을 위한 솔루션 개발, 자문 및 교육을 제공합니다.",
};

export const dxAxDiagram = {
  title: "전자파(EMI/EMC, SI, RF) 설계·분석 업무의 AI 전환을 위한 솔루션 개발, 자문 및 교육",
  engineeringSteps: [
    { title: "Design Guide", note: "" },
    { title: "Simulation(Tools)", note: "출처: Ansys, CST" },
    { title: "측정분석(계측기)", note: "출처: Anritsu" },
    { title: "규격 검사", note: "EMC 규격" },
  ],
  aiTools: ["상용 LLM", "자체 LLM", "Local LLM"],
  services: [
    { title: "생성형 AI 활용 교육", detail: "생성형 AI의 EMI/SI 설계·분석 적용 방법" },
    { title: "AX를 위한 EM Solution", detail: "Embedding Solution" },
    { title: "기반 기술 개발, sLLM 학습", detail: "산학 협력 Center" },
  ],
};

type SolutionCard = {
  title: string;
  displayTitle?: string;
  subtitle: string;
  displaySubtitle?: string;
  image: string;
  imageAlt: string;
  description: string;
  points: string[];
  href: string;
  exampleTitle: string;
  exampleLead: string;
  exampleSteps: string[];
  exampleImagesTitle?: string;
  exampleImages?: string[];
  exampleVideoTitle?: string;
  exampleVideo?: string;
  exampleExtraImageTitle?: string;
  exampleExtraImage?: string;
  inquiryHref: string;
};

export const solutionCards: SolutionCard[] = [
  {
    title: "AIfEM-D",
    displayTitle: "AI Connected&Integrated Solution",
    subtitle: "AI for EM - Design",
    displaySubtitle: "(AIfEM-D)",
    image: "https://cdn.imweb.me/thumbnail/20260514/55b9c82ea78c9.png",
    imageAlt: "전자파 시뮬레이션 이미지",
    description: "AI 기반 Simulation, Design Guide, 측정·분석 및 AI 연결 Tool 제작",
    points: [
      "AI 기반 Simulation, Design Guide, 측정·분석",
      "AI 연결 Tool 제작: AI 기반 전자파 예측 Surrogate Model, 전자파 분석/평가 Deep Learning Model",
    ],
    href: "/solution#aifem-d",
    exampleTitle: "AI Connected&Integrated 적용 예시",
    exampleLead: "VIA 설계 변수 변경에 따른 특성을 AI가 예측하고, Surrogate Model 기반 설계 탐색과 결과 보고서 작성을 지원합니다.",
    exampleSteps: [
      "Design Guide와 Simulation 기반 설계 조건을 AI Workflow로 연결",
      "VIA 설계 변수 변경에 따른 성능 예측과 조건 탐색",
      "Surrogate Model을 통한 빠른 EMI/SI 성능 예측",
      "AI 기반 결과 분석 및 보고서 자동 작성",
      "주요 설계 영향도와 최적 설계 조건 도출",
    ],
    exampleImagesTitle: "예시1. AI예측 Model(Surrogate Model)을 Claude에 연결한 chatting형 Design Guide",
    exampleImages: [
      "/AI기반 Design Guide-1.png",
      "/AI기반 Design Guide-2.png",
      "/AI기반 Design Guide-3.png",
      "/AI기반 Design Guide-4.png",
    ],
    exampleVideoTitle: "예시2. Differential Signal의 S-parameter 및 Field예측 Surrogate Model",
    exampleVideo: "https://www.youtube.com/embed/jReysWD-znk",
    exampleExtraImageTitle: "예시3. AI기반 S-parameter 자동분석 Workflow",
    exampleExtraImage: "/Agentic Workflow S-parameter.png",
    inquiryHref: "/contact",
  },
  {
    title: "기업 교육·자문",
    subtitle: "Consulting & Education",
    image: "/교육.png",
    imageAlt: "기업 교육 및 자문 이미지",
    description: "전자파 설계·분석 업무의 AI 전환을 위한\n자문 및 교육",
    points: [
      "전자파 기술 분야 생성형 AI 활용 주문형 교육과 특강",
      "AI 기반 설계·분석 Workflow구현을 위한 환경분석과 자문",
    ],
    href: "/solution#consulting-education",
    exampleTitle: "예시. Z0 계산기 제작 및 AI연결하기 교육 내용 중",
    exampleLead: "전자파 기술 조직의 AX 전환 수준에 맞춰 교육과 자문을 구성합니다.",
    exampleSteps: [
      "전자파 설계·분석 업무의 AI 적용 가능성 진단",
      "실습 중심 생성형 AI 활용 교육과 특강",
      "조직 내부 활용을 위한 환경 구축 및 운영 자문",
    ],
    exampleImages: [
      "/교육 개요_배경.png",
      "/교육1.PNG",
      "/교육2.PNG",
      "/교육3.PNG",
      "/교육4.PNG",
      "/교육5.PNG",
      "/교육6.PNG",
    ],
    inquiryHref: "/contact",
  },
];

export const capabilityHighlights = [
  "EMI/SI/RF 설계·분석",
  "Simulation Workflow 자동화",
  "DRC 및 측정 데이터 분석",
  "기업 맞춤형 AI 교육",
];
