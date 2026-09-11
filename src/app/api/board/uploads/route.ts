import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "education-captures";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "이미지 저장소가 설정되지 않았습니다." }, { status: 503 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const studentId = form?.get("studentId");
  if (!(file instanceof File) || typeof studentId !== "string" || !studentId || studentId.length > 100) {
    return NextResponse.json({ ok: false, error: "업로드 정보가 올바르지 않습니다." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "JPEG, PNG, WebP 이미지만 5MB까지 올릴 수 있습니다." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `default/${id}.${extension}`;
  const supabase = getSupabaseAdmin();
  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) {
    return NextResponse.json({ ok: false, error: `이미지 업로드 실패: ${uploadError.message}` }, { status: 500 });
  }

  const { error: metadataError } = await supabase.from("education_uploads").insert({
    id,
    session_id: "default",
    student_id: studentId,
    storage_path: path,
    mime_type: file.type,
    size_bytes: file.size,
  });
  if (metadataError) {
    await supabase.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ ok: false, error: `업로드 기록 저장 실패: ${metadataError.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id, url: `/api/board/uploads/${id}` });
}
