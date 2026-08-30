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
  subtitle: string;
  image: string;
  imageAlt: string;
  description: string;
  points: string[];
  href: string;
  exampleTitle: string;
  exampleLead: string;
  exampleSteps: string[];
  exampleImages?: string[];
  exampleVideo?: string;
  inquiryHref: string;
};

export const solutionCards: SolutionCard[] = [
  {
    title: "기업 교육·자문",
    subtitle: "Consulting & Education",
    image: "/images/education.png",
    imageAlt: "기업 교육 및 자문 이미지",
    description: "전자파 설계·분석 업무의 AI 전환을 위한 자문 및 교육",
    points: [
      "전자파 설계·분석에 AI를 적용하기 위한 환경분석과 자문",
      "전자파 기술 분야 생성형 AI 활용 주문형 교육과 특강",
    ],
    href: "/solution#consulting-education",
    exampleTitle: "기업 맞춤형 교육·자문 프로그램",
    exampleLead: "전자파 기술 조직의 AX 전환 수준에 맞춰 교육과 자문을 구성합니다.",
    exampleSteps: [
      "전자파 설계·분석 업무의 AI 적용 가능성 진단",
      "실습 중심 생성형 AI 활용 교육과 특강",
      "조직 내부 활용을 위한 환경 구축 및 운영 자문",
    ],
    exampleImages: [
      "https://cdn.imweb.me/thumbnail/20260515/928478d8c491e.png",
      "https://cdn.imweb.me/thumbnail/20260515/e416f34d73e0b.png",
      "https://cdn.imweb.me/thumbnail/20260515/40fce9017a02d.png",
      "https://cdn.imweb.me/thumbnail/20260515/c578d6cf0905e.png",
      "https://cdn.imweb.me/thumbnail/20260515/f59143363aa71.png",
      "https://cdn.imweb.me/thumbnail/20260515/122e10e70d0fb.png",
      "https://cdn.imweb.me/thumbnail/20260515/87fee542609a3.png",
      "https://cdn.imweb.me/thumbnail/20260515/fcfd80c52cda9.png",
    ],
    inquiryHref: "/contact",
  },
  {
    title: "AIfEM-D",
    subtitle: "AI for EM - Design",
    image: "https://cdn.imweb.me/thumbnail/20260514/55b9c82ea78c9.png",
    imageAlt: "전자파 시뮬레이션 이미지",
    description: "Simulation 자동화 및 Surrogate Model 제작",
    points: [
      "생성형 AI 기반 HFSS Simulation Workflow 자동화",
      "실시간 EMI/SI 성능 예측을 위한 Surrogate Model",
    ],
    href: "/solution#aifem-d",
    exampleTitle: "AI + VIA 예측 AI Model & Surrogate Model",
    exampleLead: "VIA 설계 변수 변경에 따른 특성을 AI가 예측하고, Surrogate Model 기반 설계 탐색과 결과 보고서 작성을 지원합니다.",
    exampleSteps: [
      "Design Guide와 Simulation 기반 설계 조건을 AI Workflow로 연결",
      "VIA 설계 변수 변경에 따른 성능 예측과 조건 탐색",
      "Surrogate Model을 통한 빠른 EMI/SI 성능 예측",
      "AI 기반 결과 분석 및 보고서 자동 작성",
      "주요 설계 영향도와 최적 설계 조건 도출",
    ],
    exampleImages: [
      "/AI기반 Design Guide-1.png",
      "/AI기반 Design Guide-2.png",
      "/AI기반 Design Guide-3.png",
      "/AI기반 Design Guide-4.png",
    ],
    exampleVideo: "https://www.youtube.com/embed/jReysWD-znk",
    inquiryHref: "/contact",
  },
  {
    title: "AIfEM-A",
    subtitle: "AI for EM - Analysis",
    image: "https://cdn.imweb.me/thumbnail/20260515/c91f1284eca3c.png",
    imageAlt: "전자파 측정 및 분석 계측기 이미지",
    description: "AI 기반 전자파 측정/분석 Workflow 자동화",
    points: [
      "VNA → TDR 변환 → AI 기반 평가/분석 → 리포트 자동화",
      "PCB Simulation과 실측 오차 분석 및 개선 방안 제시",
    ],
    href: "/solution#aifem-a",
    exampleTitle: "AI를 활용한 분석 Workflow 자동화",
    exampleLead: "S-parameter 평가/분석 → 개선안 도출 → HFSS 이용 개선안 확인",
    exampleSteps: [
      "Surrogate Model을 이용한 PCB 형상 입력 및 S-parameter 생성",
      "TDR 변환과 AI 기반 평가/분석 자동화",
      "분석/개선안 도출 후 HFSS 검증과 리포트 자동 작성",
    ],
    exampleImages: [
      "https://cdn.imweb.me/thumbnail/20260515/c91f1284eca3c.png",
      "https://cdn.imweb.me/thumbnail/20260515/a2f21cce8c4fe.png",
      "https://cdn.imweb.me/thumbnail/20260515/47c12c71e3a86.png",
      "https://cdn.imweb.me/thumbnail/20260515/3f55a45b94bdb.png",
      "https://cdn.imweb.me/thumbnail/20260515/d8bd3eb4fd46d.png",
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
