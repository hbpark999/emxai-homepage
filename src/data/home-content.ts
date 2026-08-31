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
  exampleImageSectionTitles?: { startIndex: number; title: string }[];
  exampleImages?: string[];
  exampleSections?: {
    title: string;
    description: string;
    images: string[];
  }[];
  exampleVideoTitle?: string;
  exampleVideo?: string;
  exampleExtraImageTitle?: string;
  exampleExtraImage?: string;
  inquiryHref: string;
};

export const solutionCards: SolutionCard[] = [
  {
    title: "AIfEM-D",
    displayTitle: "AI-Connected EM Solutions",
    subtitle: "AI for EM - Design",
    displaySubtitle: "(AIfEM)",
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
    exampleImagesTitle: "예시3. AI예측 Model(Surrogate Model)을 Claude에 연결한 chatting형 Design Guide",
    exampleImages: [
      "/AI기반 Design Guide-1.png",
      "/AI기반 Design Guide-2.png",
      "/AI기반 Design Guide-3.png",
      "/AI기반 Design Guide-4.png",
    ],
    exampleVideoTitle: "예시1. Differential Signal의 S-parameter 및 Field예측 Surrogate Model",
    exampleVideo: "https://www.youtube.com/embed/jReysWD-znk",
    exampleExtraImageTitle: "예시2. AI기반 S-parameter 자동분석 Workflow",
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
    exampleLead: "전자파 기술 조직의 AX 전환 수준에 맞춰 교육과 자문을 구성합니다. 기존 Z0 계산기 실습 예시에 이어 Codex와 MATLAB을 연결한 Agentic Workflow 실습 예시를 함께 제공합니다.",
    exampleSteps: [
      "요구사항을 해석해 2.4 GHz FR4 patch antenna 모델링 조건 정의",
      "MATLAB Antenna Toolbox로 S-parameter와 radiation pattern simulation 실행",
      "Coax feeding point d sweep으로 S11이 낮은 최적 위치 탐색",
      "형상, S11, radiation pattern 결과를 검토하고 보고서/PPT 산출물로 정리",
    ],
    exampleSections: [
      {
        title: "예시1. Z0계산기 제작 및 Claude연결 실습",
        description:
          "Microstrip 구조의 Z0 계산기를 AI Coding으로 제작하고, Claude와 연결해 설계값 입력, 계산 결과 확인, 분석 흐름까지 실습합니다.",
        images: [
          "/교육 개요_배경.png",
          "/교육1.PNG",
          "/교육2.PNG",
          "/교육3.PNG",
          "/교육4.PNG",
          "/교육5.PNG",
          "/교육6.PNG",
        ],
      },
      {
        title: "예시2. 간단한 Agentic Workflow 실습 예시: Modeling, Simulation, 최적화 및 보고서 작성",
        description:
          "Codex와 MATLAB을 연결해 patch antenna를 모델링하고, simulation 결과를 바탕으로 feed 위치 최적화와 보고서 작성을 자동화하는 흐름을 실습합니다.",
        images: [
          "/newmatlab/슬라이드1.PNG",
          "/newmatlab/슬라이드2.PNG",
          "/newmatlab/슬라이드3.PNG",
          "/newmatlab/슬라이드4.PNG",
        ],
      },
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
