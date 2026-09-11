import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { getStudentCourse } from "@/data/student-courses";
import { getAccessCookieName, verifyAccessToken } from "@/lib/education/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MATERIALS_DIR = path.join(process.cwd(), "content", "education-materials");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const course = getStudentCourse(slug);

  if (!course) {
    return NextResponse.json({ error: "과정을 찾을 수 없습니다." }, { status: 404 });
  }

  const token = request.cookies.get(getAccessCookieName(course))?.value;
  if (!verifyAccessToken(course, token)) {
    return NextResponse.json({ error: "비밀번호 확인이 필요합니다." }, { status: 401 });
  }

  if (request.nextUrl.searchParams.get("status") === "1" && course.pdfEnabled === false) {
    return NextResponse.json({ ok: true, available: false });
  }

  if (course.pdfEnabled === false) {
    return NextResponse.json({ error: "PDF 자료를 제공하지 않는 과정입니다." }, { status: 404 });
  }

  if (request.nextUrl.searchParams.has("download")) {
    return NextResponse.json(
      { error: "이 자료는 브라우저 안에서만 열람할 수 있습니다." },
      { status: 403 },
    );
  }

  const filePath = path.join(MATERIALS_DIR, course.pdfFile);
  const normalizedMaterialsDir = path.normalize(MATERIALS_DIR + path.sep);
  const normalizedFilePath = path.normalize(filePath);

  if (!normalizedFilePath.startsWith(normalizedMaterialsDir)) {
    return NextResponse.json({ error: "잘못된 자료 경로입니다." }, { status: 400 });
  }

  const fileStat = await stat(normalizedFilePath).catch(() => null);

  if (request.nextUrl.searchParams.get("status") === "1") {
    return NextResponse.json({ ok: true, available: Boolean(fileStat?.isFile()) });
  }

  if (!fileStat?.isFile()) {
    return NextResponse.json(
      { error: "PDF 파일이 아직 첨부되지 않았습니다." },
      { status: 404 },
    );
  }

  const stream = Readable.toWeb(createReadStream(normalizedFilePath));
  // Content-Disposition의 filename은 ASCII만 허용되므로, 한글 등은 filename* (RFC 5987)로 인코딩해 전달한다.
  const asciiFallbackName = course.pdfFile.replace(/[^\x20-\x7e]/g, "_");
  const encodedName = encodeURIComponent(course.pdfFile);

  return new Response(stream as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(fileStat.size),
      "Content-Disposition": `inline; filename="${asciiFallbackName}"; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
