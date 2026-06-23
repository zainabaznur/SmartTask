"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Tugas } from "@/lib/types";
import { getUrgencyLevel, getUrgencyClasses } from "@/lib/urgency";
import { formatDeadline } from "@/lib/date";
import UrgencyBadge from "./UrgencyBadge";
import CategoryChip from "./CategoryChip";
import { createClient } from "@/lib/supabase/client";

interface TaskCardProps {
  task: Tugas;
}

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const urgency = getUrgencyLevel(task.deadline);
  const { card } = getUrgencyClasses(urgency);

  async function handleComplete() {
    setLoading(true);
    await supabase
      .from("tugas")
      .update({
        status: "selesai",
        selesai_at: new Date().toISOString(),
      })
      .eq("id", task.id);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Hapus tugas "${task.judul}"?`)) return;
    setLoading(true);
    await supabase.from("tugas").delete().eq("id", task.id);
    router.refresh();
  }

  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 ${card} border-l-4 transition-opacity hover:shadow-sm ${
        loading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleComplete}
        title="Tandai selesai"
        className="mt-0.5 w-5 h-5 border-2 border-slate-300 rounded-md flex-shrink-0 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center group"
      >
        <svg
          className="w-3 h-3 text-transparent group-hover:text-green-500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug">{task.judul}</h3>
          <div className="flex gap-0.5 flex-shrink-0">
            <Link
              href={`/tugas/${task.id}/edit`}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={handleDelete}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Hapus"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {task.deskripsi && (
          <p className="text-xs text-slate-500 mb-2 line-clamp-2 leading-relaxed">
            {task.deskripsi}
          </p>
        )}

        <div className="flex items-center gap-2.5 flex-wrap">
          <UrgencyBadge deadline={task.deadline} />
          <CategoryChip kategori={task.kategori} />
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDeadline(task.deadline)}
          </span>
          {task.notifikasi_aktif && (
            <span className="text-slate-400" title="Notifikasi Telegram aktif">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}