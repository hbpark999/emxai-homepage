/**
 * 실시간 교육 게시판 — 페이지 (/education/board)
 *
 * 용도 : 수강생에게 공유하는 게시판 주소.
 *        예) https://www.emxai.net/education/board
 *
 * 실제 화면과 갱신 로직은 ClassBoard 컴포넌트에 있다.
 */

import type { Metadata } from "next";
import { ClassBoard } from "@/components/education/class-board";

export const metadata: Metadata = {
  title: "교육 게시판 | EMxAI",
  description: "교육 중 공유되는 링크·공지·실습 코드를 실시간으로 확인합니다.",
};

export default function EducationBoardPage() {
  return (
    <main className="flex-1 bg-white">
      <ClassBoard />
    </main>
  );
}
