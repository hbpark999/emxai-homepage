import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "education-captures";

export async function GET(_request: Request, context: RouteContext<"/api/board/uploads/[id]">) {
  if (!isSupabaseConfigured()) return new NextResponse(null, { status: 503 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse(null, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: metadata, error } = await supabase
    .from("education_uploads")
    .select("storage_path, mime_type")
    .eq("id", id)
    .single();
  if (error || !metadata) return new NextResponse(null, { status: 404 });

  const { data, error: downloadError } = await supabase.storage.from(BUCKET).download(metadata.storage_path);
  if (downloadError || !data) return new NextResponse(null, { status: 404 });

  return new NextResponse(data, {
    headers: {
      "Content-Type": metadata.mime_type,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
