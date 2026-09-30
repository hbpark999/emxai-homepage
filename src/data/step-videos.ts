/**
 * STEP 1~6 시연 영상 목록.
 *
 * 홈 hero(흐름도 아래 카드)와 공유용 /workflow 페이지가 함께 쓴다.
 * 두 곳에 같은 배열을 두면 한쪽만 고치는 일이 생겨 여기로 모았다.
 */

export type StepVideo = {
  step: number;
  title: string;
  file: string;
  /**
   * 흐름도 이미지 폭 대비 STEP 박스의 왼쪽 위치(%). 홈 hero에서만 쓴다.
   * 20260927EMxAI_DRC_Day3_v3_43.png에서 실측한 값이다.
   */
  left: string;
  /** 흐름도 이미지 폭 대비 STEP 박스의 폭(%). 홈 hero에서만 쓴다. */
  width: string;
  /**
   * 카드에 대표 화면으로 띄울 시점(초). 0초는 제목 슬라이드라 내용이 보이지 않아
   * 영상 길이의 약 35% 지점을 기본값으로 잡았다. 더 나은 장면이 있으면 이 숫자만 바꾸면 된다.
   */
  posterTime: number;
};

export const stepVideos: StepVideo[] = [
  {
    step: 1,
    title: "Design",
    file: "Step1. AI Agent Workflow_given Design.mp4",
    left: "1.87%",
    width: "12.79%",
    posterTime: 7,
  },
  {
    step: 2,
    title: "Guide → AI DRC",
    file: "Step2. Guide_Guide Parsing and Design Guide.mp4",
    left: "16.21%",
    width: "14.56%",
    posterTime: 15,
  },
  {
    step: 3,
    title: "Fast Local Evaluation & Optimization",
    file: "step3. AI Agent Workflow SG Model Optimize.mp4",
    left: "32.23%",
    width: "16.10%",
    posterTime: 10,
  },
  {
    step: 4,
    title: "PCB Update",
    file: "step4. AI Agent Workflow_updated Design.mp4",
    left: "49.82%",
    width: "14.56%",
    posterTime: 19,
  },
  {
    step: 5,
    title: "Simulation-based EMI/SI Verification",
    file: "step5. AI Agent Workflow_HFSS1.mp4",
    left: "66.25%",
    width: "16.65%",
    posterTime: 14,
  },
  {
    step: 6,
    title: "AI Report",
    file: "step6. AI Agent Workflow_정리.mp4",
    left: "84.53%",
    width: "12.77%",
    posterTime: 7,
  },
];

/** 파일명에 공백과 한글이 있어 그대로 쓰면 깨진다. */
export function stepVideoSrc(file: string) {
  return encodeURI("/images/" + file);
}

/** 카드용 주소. #t=<초>로 그 시점 화면을 대표 화면처럼 띄운다. */
export function stepVideoPosterSrc(item: StepVideo) {
  return stepVideoSrc(item.file) + "#t=" + item.posterTime;
}
