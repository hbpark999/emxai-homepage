type EducationScheduleItem = {
  title: string;
  startDate: string;
  href?: string;
  highlight?: boolean;
};

type EducationScheduleGroup = {
  month: string;
  items: EducationScheduleItem[];
};

export const educationSchedule: EducationScheduleGroup[] = [
  {
    month: "'26년 8월",
    items: [
      {
        title: "[TTA] 전원노이즈 저감 설계와 생성형 AI 실습 (8/26~27)",
        startDate: "2026-08-26",
        href: "https://champ.tta.or.kr/usr/EgovUsrEduAppDetail.do?idx=538&baseUsrMenuNo=3&imgNum=1&pageIndex=1",
      },
    ],
  },
  {
    month: "'26년 9월",
    items: [
      {
        title: "[AI특화] AI기반 전자파분석 및 시뮬레이션기술 (9/2~4)",
        startDate: "2026-09-02",
        href: "https://champ.rapa.or.kr/web/course/courseView.do?eduCd=K000000001202606190005&eduCertifiedYn=N&category1=",
        highlight: true,
      },
      {
        title: "[RAPA] EMI/SI 설계와 생성형 AI 활용 (9/17~18)",
        startDate: "2026-09-17",
      },
      {
        title: "[AI특화] 전자제품 EMC설계와 생성형 AI활용 (9/21~23)",
        startDate: "2026-09-21",
      },
    ],
  },
  {
    month: "'26년 10월",
    items: [
      {
        title: "[TTA] 전원 노이즈 저감 및 생성형 AI 실습",
        startDate: "2026-10-22",
      },
    ],
  },
  {
    month: "'26년 11월",
    items: [
      {
        title: "[AI특화] DRC 및 AI기반 PCB검증 (11/18~20)",
        startDate: "2026-11-18",
      },
    ],
  },
  {
    month: "'26년 12월",
    items: [
      {
        title: "[AI특화] 전자제품 EMC설계와 생성형 AI활용 (12/7~9)",
        startDate: "2026-12-07",
      },
      {
        title: "[RAPA] 전자파 분석 및 설계 과정 - 2차 (12/10~11)",
        startDate: "2026-12-10",
      },
      {
        title: "[AI특화] AI기반 전자파분석 및 시뮬레이션기술 (12/16~18)",
        startDate: "2026-12-16",
      },
    ],
  },
];

export const postsAndTools = [
  {
    title: "Z0 Design → HFSS Simulation → TDR Plot Automation",
    action: "영상 재생하기",
    href: "https://www.youtube.com/watch?v=-RSqOqZr3uU",
  },
  {
    title: "주파수 별 Dk를 고려한 Z0 계산",
    action: "계산기 실행하기",
    href: "/web-tools",
  },
  {
    title: "Gemini를 이용한 S-parameter + PCB 형상 분석",
    action: "영상 재생하기",
    href: "https://www.youtube.com/watch?v=V-Iv6-RgEwo",
  },
  {
    title: "Trace Width, Dk Z0 영향 표시 Microstrip Z0 계산기",
    action: "계산기 바로가기",
    href: "/web-tools",
  },
];

export const knowledgeItems = [
  {
    title: "Z0 Design → HFSS Simulation → TDR Plot Automation",
    body: "Z0 설계, HFSS 시뮬레이션, TDR Plot 자동화 흐름을 보여주는 교육 영상",
    action: "영상 보기",
    href: "https://www.youtube.com/watch?v=-RSqOqZr3uU",
  },
  {
    title: "Gemini 기반 S-parameter + PCB 형상 분석",
    body: "PCB 형상과 S-parameter 데이터를 함께 해석하는 생성형 AI 활용 예시",
    action: "영상 보기",
    href: "https://www.youtube.com/watch?v=V-Iv6-RgEwo",
  },
  {
    title: "Microstrip Z0 Calculator",
    body: "Trace Width, Dk, 두께 조건 변화에 따른 Microstrip 특성 임피던스 계산",
    action: "계산기 보기",
    href: "/web-tools",
  },
  {
    title: "S-Parameter Plot Viewer",
    body: "S2P 데이터를 불러와 S11, S21 Magnitude와 Phase를 분석하는 시각화 도구",
    action: "도구 보기",
    href: "/web-tools",
  },
  {
    title: "PDN Impedance Optimizer",
    body: "주파수 범위, 캐패시터, 목표 임피던스를 기반으로 PDN 구성을 검토하는 교육용 도구",
    action: "자료 보기",
    href: "/news-event",
  },
];

export const updateActivities = [
  {
    title: "아주대 전자파·기계공학과 협력센터 구성('26.7)",
    body: "전자파 및 기계공학 분야 산학 협력센터 구성",
    note: "",
    href: "",
  },
  {
    title: "한국전자파학회 전자파AI연구반 구성 참여('26.7)",
    body: "전자파 분야 AI 활용 연구반 구성 참여",
    note: "",
    href: "",
  },
  {
    title: "한국 전자파학회 전파신기술 워크샵 튜토리얼 강연 ('26.5.22, 건설회관)",
    body: "생성형 AI의 EMI/SI활용과 일하는 방법의 변화",
    note: "주제: 생성형 AI의 EMI/SI활용과 일하는 방법의 변화",
    href: "",
  },
  {
    title: "국립경상대 ICT융합센터 MOU체결 ('26.4.1)",
    body: "산학협력을 위한 업무협약(MOU) 체결",
    note: "게시글 보기 →",
    href: "http://mumt2.gnu.ac.kr/bbs/board.php?bo_table=sub5_1&wr_id=27",
  },
  {
    title: "전자신문 기고: AI시대 전자파기술 교육",
    body: "문제 정의, AI 지시, 결과 타당성 판단 역량의 중요성",
    note: "전자신문 기사 보기 →",
    href: "https://www.etnews.com/20250512000124",
  },
];

export const historyItems = [
  { date: "2026. 07", title: "아주대 전자파·기계공학과", body: "협력센터 구성" },
  { date: "2026. 04", title: "경상국립대학교", body: "ICT융합센터 MOU" },
  { date: "2026. 03", title: "서울시립대학교", body: "AI Boot Camp 참여기업" },
  { date: "2026. 03", title: "RAPA AI 특화", body: "공동훈련센터 산업계 전문가 참여" },
  { date: "2026. 03", title: "NIPA AI 바우처", body: "공급기업 POOL 등록" },
  { date: "~2026. 02", title: "수원대학교 SI 기술 자문", body: "Simulation 정확도 향상" },
  { date: "2025. 11", title: "벤처기업 확인", body: "" },
  { date: "2025. 10 ~", title: "RAPA 전자파기술에의", body: "AI 활용 교육" },
  { date: "2025. 08", title: "이엠엑스아이(주)", body: "법인 전환" },
  { date: "2025. 04 ~ 11", title: "ASK 글로벌 기업 협업", body: "프로그램 수행" },
  { date: "2025. 06 ~ 11", title: "아주대 산학협력 기술개발", body: "Simulation 기반 Dataset 개발" },
  { date: "2025. 03 ~ 10", title: "TTA 교육과정개발 협력", body: "전원 Noise 분석 AI 활용" },
  { date: "2024. 12", title: "2024 예비창업패키지", body: "수행 완료" },
  { date: "2024. 11", title: "전자파학회 특별상", body: "AI 활용 기여" },
  { date: "2024. 10", title: "EMxAI 설립", body: "" },
];
