import type { Metadata } from "next";
import { EducationSamples } from "@/components/education/education-samples";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "전자파 AI 교육",
  description:
    "RAPA, TTA 등 정부·기관 위탁 과정을 포함한 전자파(EMI/SI) 설계·분석의 생성형 AI 활용 교육 프로그램과 실습 사례를 안내합니다.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  return (
    <main className="flex-1 bg-white">
      <EducationSamples />
    </main>
  );
}
