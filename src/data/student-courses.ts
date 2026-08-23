export type StudentCourse = {
  slug: string;
  title: string;
  organizer: "RAPA" | "TTA";
  dayLabel: string;
  boardCourseNames: string[];
  passwordEnv: string;
  pdfFile: string;
  pdfPageCount?: number;
};

export const studentCourses = [
  {
    slug: "rapa-ai-em-analysis-simulation-day3",
    title: "AI 특화(RAPA): AI 기반 전자파 분석 및 시물레이션 기술(3일 차)",
    organizer: "RAPA",
    dayLabel: "3일 차",
    boardCourseNames: ["1기", "AI 기반 전자파 분석 및 시물레이션 기술"],
    passwordEnv: "EDU_PASS_RAPA_AI_EM_ANALYSIS_SIM_DAY3",
    pdfFile: "rapa-ai-em-analysis-simulation-day3.pdf",
  },
  {
    slug: "rapa-drc-ai-pcb-verification-day3",
    title: "AI 특화(RAPA): DRC 및 AI기반 PCB검증(3일 차)",
    organizer: "RAPA",
    dayLabel: "3일 차",
    boardCourseNames: ["2기", "DRC 및 AI기반 PCB검증"],
    passwordEnv: "EDU_PASS_RAPA_DRC_AI_PCB_DAY3",
    pdfFile: "rapa-drc-ai-pcb-verification-day3.pdf",
  },
  {
    slug: "rapa-emc-design-generative-ai",
    title: "AI 특화(RAPA): 전자제품 EMC설계와 생성형 AI활용",
    organizer: "RAPA",
    dayLabel: "전용 자료",
    boardCourseNames: ["3기", "전자제품 EMC설계와 생성형 AI활용"],
    passwordEnv: "EDU_PASS_RAPA_EMC_GENAI",
    pdfFile: "rapa-emc-design-generative-ai.pdf",
  },
  {
    slug: "rapa-emi-si-design-genai-day2",
    title: "RAPA 자체: 생성형 AI기반 EMI/SI 설계(2일 차)",
    organizer: "RAPA",
    dayLabel: "2일 차",
    boardCourseNames: ["4기", "생성형 AI기반 EMI/SI 설계"],
    passwordEnv: "EDU_PASS_RAPA_EMI_SI_GENAI_DAY2",
    pdfFile: "rapa-emi-si-design-genai-day2.pdf",
  },
  {
    slug: "rapa-em-analysis-design-genai-day2",
    title: "RAPA 자체: 생성형 AI기반 전자파 분석 및 설계(2일 차)",
    organizer: "RAPA",
    dayLabel: "2일 차",
    boardCourseNames: ["5기", "생성형 AI기반 전자파 분석 및 설계"],
    passwordEnv: "EDU_PASS_RAPA_EM_ANALYSIS_DESIGN_DAY2",
    pdfFile: "rapa-em-analysis-design-genai-day2.pdf",
  },
  {
    slug: "tta-power-noise-genai-day2",
    title: "TTA:전원 Noise 저감 설계와 생성형 AI활용(2일차)",
    organizer: "TTA",
    dayLabel: "2일 차",
    boardCourseNames: ["6기", "전원 Noise 저감 설계와 생성형 AI활용"],
    passwordEnv: "EDU_PASS_TTA_POWER_NOISE_DAY2",
    pdfFile: "tta-power-noise-genai-day2.pdf",
    pdfPageCount: 121,
  },
] satisfies StudentCourse[];

export function getStudentCourse(slug: string) {
  return studentCourses.find((course) => course.slug === slug) ?? null;
}
