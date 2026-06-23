import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";
import { getStartOfWeek } from "@/lib/date";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // EDF: ORDER BY deadline ASC — non-negotiable
  const { data: tasks } = await supabase
    .from("tugas")
    .select("*")
    .eq("mahasiswa_id", user.id)
    .eq("status", "aktif")
    .order("deadline", { ascending: true });

  // Metric: mendesak hari ini (deadline < 24h)
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const mendesakHariIni = (tasks || []).filter(
    (t) => new Date(t.deadline) <= tomorrow
  ).length;

  // Metric: selesai minggu ini
  const weekStart = getStartOfWeek();
  const { count: selesaiCount } = await supabase
    .from("tugas")
    .select("id", { count: "exact", head: true })
    .eq("mahasiswa_id", user.id)
    .eq("status", "selesai")
    .gte("selesai_at", weekStart.toISOString());

  // Fetch mahasiswa name
  const { data: mahasiswa } = await supabase
    .from("mahasiswa")
    .select("nama_lengkap")
    .eq("id", user.id)
    .single();

  return (
    <DashboardClient
      tasks={tasks || []}
      userName={mahasiswa?.nama_lengkap || user.email || "Pengguna"}
      totalAktif={tasks?.length || 0}
      mendesakHariIni={mendesakHariIni}
      selesaiMingguIni={selesaiCount || 0}
      userId={user.id}
    />
  );
}