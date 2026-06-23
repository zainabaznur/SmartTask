import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tugas } from "@/lib/types";
import { formatDeadline, formatGroupDate, getStartOfWeek } from "@/lib/date";
import CategoryChip from "@/components/ui/CategoryChip";
import Link from "next/link";

export const revalidate = 0;

function groupByDate(tasks: Tugas[]): Record<string, Tugas[]> {
  const groups: Record<string, Tugas[]> = {};
  for (const task of tasks) {
    const dateKey = task.selesai_at
      ? formatGroupDate(task.selesai_at)
      : "Tidak diketahui";
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(task);
  }
  return groups;
}

export default async function RiwayatPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tasks } = await supabase
    .from("tugas")
    .select("*")
    .eq("mahasiswa_id", user.id)
    .eq("status", "selesai")
    .order("selesai_at", { ascending: false });

  const allTasks = tasks || [];

  // Count selesai this week
  const weekStart = getStartOfWeek();
  const selesaiMingguIni = allTasks.filter(
    (t) => t.selesai_at && new Date(t.selesai_at) >= weekStart
  ).length;

  const groups = groupByDate(allTasks);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Logo Kembali & Judul */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all flex-shrink-0"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Riwayat Tugas</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {selesaiMingguIni} tugas selesai minggu ini
          </p>
        </div>
      </div>

      {allTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-slate-600 font-medium text-sm">Belum ada riwayat</p>
          <p className="text-slate-400 text-xs mt-1">Selesaikan tugas untuk melihat riwayat</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([dateLabel, dateTasks]) => (
            <div key={dateLabel}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {dateLabel}
                </h2>
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-xs text-slate-400">{dateTasks.length} tugas</span>
              </div>
              <div className="space-y-2">
                {dateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 opacity-80"
                  >
                    <div className="mt-0.5 w-5 h-5 bg-green-100 rounded border border-green-300 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 line-through line-through-slate-400">
                        {task.judul}
                      </p>
                      {task.deskripsi && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {task.deskripsi}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <CategoryChip kategori={task.kategori} />
                        <span className="text-xs text-slate-400">
                          Deadline: {formatDeadline(task.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}