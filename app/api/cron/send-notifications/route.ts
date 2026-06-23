import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sendTelegramMessage, buildNotifMessage } from "@/lib/telegram";
import type { NotifikasiTipe } from "@/lib/types";

/**
 * GET /api/cron/send-notifications
 *
 * Protected by CRON_SECRET header.
 * Runs every 15 minutes via Vercel Cron.
 *
 * Timezone: All deadline comparisons use UTC internally.
 * Notifikasi dikirim saat mendekati H-3, H-1, dan 3 jam sebelum deadline.
 */
export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const now = new Date();

  // Production: H-3, H-1, 3 jam sebelum deadline
  const windows: {
    tipe: NotifikasiTipe;
    from: Date;
    to: Date;
  }[] = [
    {
      tipe: "3jam",
      from: new Date(now.getTime() + 2.75 * 60 * 60 * 1000),
      to: new Date(now.getTime() + 3.25 * 60 * 60 * 1000),
    },
    {
      tipe: "H-1",
      from: new Date(now.getTime() + 23.75 * 60 * 60 * 1000),
      to: new Date(now.getTime() + 24.25 * 60 * 60 * 1000),
    },
    {
      tipe: "H-3",
      from: new Date(now.getTime() + 71.75 * 60 * 60 * 1000),
      to: new Date(now.getTime() + 72.25 * 60 * 60 * 1000),
    },
  ];

  let totalSent = 0;
  const errors: string[] = [];

  for (const window of windows) {
    const { data: tasks, error: fetchError } = await supabase
      .from("tugas")
      .select("id, judul, deadline, kategori, notifikasi_aktif, telegram_chat_id")
      .eq("status", "aktif")
      .eq("notifikasi_aktif", true)
      .not("telegram_chat_id", "is", null)
      .gte("deadline", window.from.toISOString())
      .lte("deadline", window.to.toISOString());

    if (fetchError) {
      errors.push(`Fetch error: ${fetchError.message}`);
      continue;
    }

    if (!tasks || tasks.length === 0) continue;

    for (const task of tasks) {
      // Idempotency check: skip if already sent for this interval
      const { data: existingLog } = await supabase
        .from("notifikasi_log")
        .select("id")
        .eq("tugas_id", task.id)
        .eq("tipe", window.tipe)
        .maybeSingle();

      if (existingLog) continue;

      const message = buildNotifMessage(window.tipe, task.judul, task.deadline, task.kategori);
      const sent = await sendTelegramMessage(task.telegram_chat_id!, message);

      if (sent) {
        await supabase.from("notifikasi_log").insert({
          tugas_id: task.id,
          tipe: window.tipe,
          status: "terkirim",
        });
        totalSent++;
      } else {
        await supabase.from("notifikasi_log").insert({
          tugas_id: task.id,
          tipe: window.tipe,
          status: "gagal",
        });
        errors.push(`Failed to send to task ${task.id}`);
      }
    }
  }

  return NextResponse.json({
    success: true,
    sent: totalSent,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: now.toISOString(),
  });
}