import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentCourseRoom } from "@/components/education/student-course-room";
import { getStudentCourse, studentCourses } from "@/data/student-courses";

export function generateStaticParams() {
  return studentCourses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getStudentCourse(slug);

  return {
    title: course ? `${course.title} | EMxAI` : "수강생 전용 자료 | EMxAI",
    description: "수강생 전용 PDF 자료와 과정 게시판을 확인합니다.",
  };
}

export default async function StudentCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getStudentCourse(slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="flex-1 bg-white">
      <StudentCourseRoom course={course} />
    </main>
  );
}
