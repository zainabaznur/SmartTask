import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/tugas — list active tasks ordered by EDF
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const kategori = searchParams.get("kategori");
  const status = searchParams.get("status") || "aktif";

  let query = supabase
    .from("tugas")
    .select("*")
    .eq("mahasiswa_id", user.id)
    .eq("status", status)
    .order("deadline", { ascending: true }); // EDF

  if (kategori && (kategori === "kuliah" || kategori === "organisasi")) {
    query = query.eq("kategori", kategori);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/tugas — create new task
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { judul, deskripsi, kategori, deadline, notifikasi_aktif } = body;

  if (!judul || !kategori || !deadline) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tugas")
    .insert({
      mahasiswa_id: user.id,
      judul,
      deskripsi: deskripsi || null,
      kategori,
      deadline,
      notifikasi_aktif: notifikasi_aktif ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
