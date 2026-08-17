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

type RelatedEventItem = {
  title: string;
  month: string;
  date: string;
  body: string;
  href: string;
};

type KnowledgeArticle = {
  title: string;
  abstract: string[];
  details: string[];
  links: {
    label: string;
    href: string;
  }[];
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
        title: "[TTA] 전원 노이즈 저감 및 생성형 AI 실습 (10/21~22)",
        startDate: "2026-10-21",
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

export const relatedEventItems: RelatedEventItem[] = [
  {
    title: "2026 IEEE International Symposium on EMC+SIPI",
    month: "'26년 8월",
    date: "2026.08.03~08.07",
    body: "Electromagnetic Compatibility, Signal & Power Integrity 국제 심포지엄",
    href: "https://2026.emcsipi.org/",
  },
  {
    title: "한국전자파학회 하계종합학술대회",
    month: "'26년 8월",
    date: "2026.08.19~08.22",
    body: "전자파 관련 기술 발표와 최신 연구 성과를 공유하는 국내 종합 학술대회",
    href: "https://www.kofst.or.kr/portal/bbs/B0000042/view.do?menuSn=59&pageIndex=1&pstSn=6603",
  },
  {
    title: "EMC Europe 2026",
    month: "'26년 9월",
    date: "2026.08.31~09.04",
    body: "EMC, EMI, Power/Signal Integrity, 측정 및 시뮬레이션 분야 국제 심포지엄",
    href: "https://www.emceurope2026.org/",
  },
  {
    title: "European Microwave Week 2026",
    month: "'26년 10월",
    date: "2026.10.04~10.09",
    body: "RF, Microwave, Radar, Wireless, 6G 및 관련 측정/설계 기술 행사",
    href: "https://www.eumw.eu/",
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
    title: "S-Parameter Plot Viewer",
    body: "S2P 데이터를 불러와 S11, S21 Magnitude와 Phase를 분석하는 시각화 도구",
    action: "도구 보기",
    href: "/web-tools",
  },
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    title: "Claude in Chrome: 브라우저 작업을 함께 수행하는 AI",
    abstract: [
      "Claude in Chrome은 Chrome 사이드 패널에서 현재 웹페이지를 읽고, 클릭하고, 입력을 도와주는 브라우저 작업형 AI입니다.",
      "설치 후 공개 계산기나 관리자 페이지를 열어두고, 자연어로 작업을 지시하면서 사람이 결과를 확인하는 방식으로 사용할 수 있습니다.",
      "예시로 PCBWay 공개 Z0 계산기를 찾아 Microstrip line 조건을 입력하고 Z0 값을 계산하는 실습을 진행할 수 있습니다.",
      "DNS 설정처럼 여러 사이트를 오가며 값을 복사하고 검증하는 복잡한 작업도 단계별로 보조할 수 있습니다.",
    ],
    details: [
      "설치 1: Google Chrome에서 Chrome Web Store를 열고 Claude in Chrome을 검색합니다.",
      "설치 2: Add to Chrome을 눌러 확장 프로그램을 설치하고, Claude 계정으로 로그인합니다. Claude in Chrome은 유료 플랜에서 제공됩니다.",
      "설치 3: Chrome 우측 상단 퍼즐 아이콘에서 Claude를 고정하고, 필요한 권한을 허용합니다.",
      "실습 1: Chrome에서 Claude 확장 아이콘을 눌러 사이드 패널을 엽니다.",
      "실습 2: 아래 프롬프트를 입력합니다. '공개 Z0 계산기(PCBWay)를 찾아서 Microstrip line Z0를 계산해줘. 조건은 PCB 두께 0.2mm, Cu 두께 half ounce, Dk=4.4, Trace width=0.34mm야. 입력한 값과 계산 결과를 표로 정리해줘.'",
      "실습 3: Claude가 PCBWay 계산기 페이지를 찾고 입력값을 넣는 과정을 보면서, 최종 계산값과 단위가 맞는지 사용자가 확인합니다.",
      "확장 실습: Resend, GoDaddy, Vercel처럼 DNS 값을 복사해 넣어야 하는 작업에서 TXT/MX/CNAME 값을 비교하고 누락 항목을 확인하도록 요청할 수 있습니다.",
      "주의: 결제, 삭제, 계정 변경, 외부 발송처럼 되돌리기 어려운 작업은 Claude가 바로 실행하지 않게 하고 사용자가 직접 최종 승인합니다.",
    ],
    links: [
      { label: "Claude for Chrome 공식 소개", href: "https://claude.com/claude-for-chrome" },
      {
        label: "Claude in Chrome 시작하기",
        href: "https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome",
      },
      {
        label: "PCBWay Impedance Calculator",
        href: "https://www.pcbway.com/pcb_prototype/impedance_calculator.html",
      },
    ],
  },
  {
    title: "Claude in Excel: 모두가 Excel 도사가 되는 방식",
    abstract: [
      "과거에는 부서마다 복잡한 수식과 피벗, 대시보드를 처리해주는 ‘Excel 도사’가 한 명씩 있었습니다.",
      "Claude in Excel은 그 역할을 Excel 안으로 가져와, 누구나 자연어로 함수 작성, 오류 분석, 데이터 정리, dashboard 생성을 요청할 수 있게 합니다.",
      "설치 후 워크북을 열고 Claude 사이드바에서 데이터 요약, 함수 생성, 피벗 구성, 차트 생성 방향을 대화형으로 지시할 수 있습니다.",
      "EMI/SI 교육 운영에서도 실습 결과, 설문, 측정 데이터, 교육 일정표를 빠르게 정리하고 보고용 dashboard로 만들 수 있습니다.",
      "수식 의존성과 셀 단위 근거를 함께 확인하면서 기존 파일을 망가뜨리지 않고 개선하는 방식이 핵심입니다.",
    ],
    details: [
      "설치 1: Microsoft Marketplace 또는 Excel의 Add-ins 메뉴에서 Claude by Anthropic for Excel을 설치합니다.",
      "설치 2: Excel을 열고 Home 또는 Add-ins 영역에서 Claude add-in을 실행한 뒤 Claude 계정으로 로그인합니다. 조직 계정은 Microsoft 365 관리자 배포가 필요할 수 있습니다.",
      "실습 1: 교육 참석자 명단, 설문 점수, 실습 결과, 교육 만족도 같은 샘플 데이터를 한 시트에 준비합니다.",
      "실습 2: 아래 프롬프트를 입력합니다. '이 교육 운영 데이터를 분석해서 참석률, 평균 만족도, 과정별 주요 이슈를 요약하고, 관리자용 dashboard 시트를 만들어줘. 필요한 피벗 테이블, 차트, 조건부 서식도 제안해줘.'",
      "실습 3: 함수 만들기 예시로 아래 프롬프트를 입력합니다. '참석 여부, 과제 제출 여부, 점수를 기준으로 수료/미수료를 자동 판정하는 Excel 함수를 만들어줘. 오류가 나지 않도록 IF, AND, IFERROR를 사용하고 수식 설명도 붙여줘.'",
      "실습 4: 기존 파일에서 #REF!, #VALUE!, 깨진 링크, 순환 참조가 있으면 원인을 찾고 수정 후보를 표로 정리해 달라고 요청합니다.",
      "부서 적용 포인트: 한 사람에게 집중되던 Excel 노하우를 팀 전체가 자연어로 사용할 수 있는 업무 능력으로 확장합니다.",
    ],
    links: [
      {
        label: "Claude for Excel 공식 도움말",
        href: "https://support.claude.com/en/articles/12650343-use-claude-for-excel",
      },
      {
        label: "Microsoft Marketplace에서 설치",
        href: "https://pages.store.office.com/addinsinstallpage.aspx?ad=US&assetid=WA200009404&isWac=True&rs=en-US&ui=en-US",
      },
      {
        label: "Microsoft 365 앱 간 Claude 연동",
        href: "https://support.claude.com/en/articles/13892150-work-across-microsoft-365-apps",
      },
      {
        label: "관련 동영상: Claude for Excel / PowerPoint 웨비나",
        href: "https://www.anthropic.com/webinars/claude-in-excel-and-powerpoint",
      },
      {
        label: "Dashboard 예시 동영상",
        href: "https://www.excel-university.com/ai-dashboards-with-claude/",
      },
    ],
  },
];

export const updateActivities = [
  {
    title: "삼성전자, ChatGPT·Gemini·Claude 전면 도입으로 AX 본격화 ('26.6)",
    body: "삼성전자 DX부문은 임직원이 ChatGPT, Gemini, Claude를 업무 특성에 맞게 선택해 쓰도록 외부 생성형 AI 3종을 공식 도입했습니다. 약 2,500명 대상 실효성 검증 후 문서 작성, 정보 분석, 코드 작성, 의사결정 속도 향상을 목표로 AX를 추진합니다.",
    note: "삼성 뉴스룸 기사 보기 →",
    href: "https://news.samsung.com/kr/%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90-%EC%99%B8%EB%B6%80-%EC%83%9D%EC%84%B1%ED%98%95-ai-%EB%8F%84%EC%9E%85%EC%9C%BC%EB%A1%9C-ax-%EB%B3%B8%EA%B2%A9%ED%99%94",
  },
  {
    title: "OpenAI, 삼성전자에 ChatGPT Enterprise·Codex 대규모 배포 발표 ('26.6.21)",
    body: "OpenAI는 삼성전자 한국 임직원과 글로벌 DX부문 임직원에게 ChatGPT Enterprise와 Codex를 제공한다고 발표했습니다. R&D, 제조, 마케팅, 제품 개발 등 기술·비기술 업무 전반에서 아이디어를 실행 가능한 소프트웨어와 자동화 workflow로 전환하는 사례로 볼 수 있습니다.",
    note: "OpenAI 발표 보기 →",
    href: "https://openai.com/index/samsung-electronics-chatgpt-codex-deployment/",
  },
  {
    title: "RAPA, 2026년도 AI 특화 공동훈련센터 선정",
    body: "한국산업인력공단 공고에서 한국전파진흥협회(RAPA)가 AI 특화 공동훈련센터 운영기관으로 선정됐습니다. RAPA는 목동 교육장을 기반으로 전자파·RF/EMC·AX 실무 교육을 운영하며, 생성형 AI와 전자파 분석·시뮬레이션을 결합한 재직자 교육 흐름을 강화하고 있습니다.",
    note: "선정 결과 공고 보기 →",
    href: "https://www.hrdkorea.or.kr/3/1/1?k=55584",
  },
  {
    title: "AI 특화 공동훈련센터, 전국 20개 기관으로 확산",
    body: "2026년 AI 특화 공동훈련센터는 총 20개소가 선정됐습니다. RAPA 외에도 KOSA, 이대서울병원·글로벌소프트웨어캠퍼스, KAIST·한국산업단지공단, 현대차·기아·KMAC 등이 참여해 산업별 AX 교육 거점이 확대되고 있습니다.",
    note: "AI 특화 공동훈련센터 현황 보기 →",
    href: "https://www.hrd4u.or.kr/champ/bbs/view/B0001207/4506.do?menuNo=0303",
  },
  {
    title: "서울시립대, AI 분야 첨단산업 인재양성 부트캠프 선정",
    body: "서울시립대는 교육부·KIAT의 AI 분야 첨단산업 인재양성 부트캠프 사업에 선정되어 5년간 약 71.25억 원 지원을 받습니다. 1년 이내 단기 집중 교육으로 도메인 전문성과 AI를 결합한 실무형 인재 양성을 추진합니다.",
    note: "서울시립대 산학협력단 소식 보기 →",
    href: "https://research.uos.ac.kr/node/8550",
  },
  {
    title: "OpenAI, ChatGPT Work 공개 ('26.7.9)",
    body: "연결된 앱과 파일을 다루며 문서·스프레드시트·프레젠테이션까지 만드는 장기 작업용 agent를 공개했습니다. 기업 업무에서 자료 조사, 문서 작성, 데이터 정리, 실행 파일 생성까지 이어지는 end-to-end 작업 흐름을 보여주는 사례입니다.",
    note: "ChatGPT release notes 보기 →",
    href: "https://help.openai.com/en/articles/6825453-release-notes",
  },
  {
    title: "Anthropic, Claude Opus 5 출시 ('26.7.24)",
    body: "Claude Opus 5는 1M context, 128k max output, thinking 기본 적용 등 장문 문서·코딩·agentic workflow에 필요한 기능을 강화했습니다. 기술 문서 분석, 대규모 코드 검토, 복잡한 실무 자동화에 영향을 줄 수 있는 신모델 흐름입니다.",
    note: "Claude Platform release notes 보기 →",
    href: "https://platform.claude.com/docs/en/release-notes/overview",
  },
  {
    title: "A2A Protocol, AI agent 상호운용 표준으로 주목 ('26.8)",
    body: "서로 다른 플랫폼의 AI agent가 작업을 주고받는 표준으로 A2A Protocol이 주목받고 있습니다. MCP와 함께 브라우저, 문서, 코드, 업무 시스템을 연결하는 agentic workflow 인프라의 기반 기술로 볼 수 있습니다.",
    note: "A2A Protocol 보기 →",
    href: "https://a2a-protocol.org/v1.0.0/",
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
