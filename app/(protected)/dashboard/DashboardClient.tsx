"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Tugas } from "@/lib/types";
import FilterTabs, { type FilterTab } from "@/components/ui/FilterTabs";
import TaskCard from "@/components/ui/TaskCard";
import MetricCard from "@/components/ui/MetricCard";
import { createClient } from "@/lib/supabase/client";

interface DashboardClientProps {
  tasks: Tugas[];
  userName: string;
  totalAktif: number;
  mendesakHariIni: number;
  selesaiMingguIni: number;
  userId: string;
}

const AVATARS: Record<string, JSX.Element> = {
  gajah: (
    <svg viewBox="0 0 64 64" className="w-10 h-10">
      <ellipse cx="32" cy="36" rx="20" ry="18" fill="#93C5FD" />
      <circle cx="32" cy="22" r="14" fill="#93C5FD" />
      <ellipse cx="14" cy="22" rx="8" ry="10" fill="#60A5FA" />
      <ellipse cx="14" cy="22" rx="5" ry="7" fill="#BFDBFE" />
      <ellipse cx="50" cy="22" rx="8" ry="10" fill="#60A5FA" />
      <ellipse cx="50" cy="22" rx="5" ry="7" fill="#BFDBFE" />
      <circle cx="26" cy="20" r="3.5" fill="#1E3A5F" />
      <circle cx="38" cy="20" r="3.5" fill="#1E3A5F" />
      <circle cx="27" cy="19" r="1.5" fill="white" />
      <circle cx="39" cy="19" r="1.5" fill="white" />
      <path d="M32 34 Q32 48 28 52 Q24 56 26 54 Q30 50 32 42" stroke="#60A5FA" strokeWidth="5" fill="#93C5FD" strokeLinecap="round" />
      <path d="M28 28 Q32 32 36 28" stroke="#1E3A5F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  kucing: (
    <svg viewBox="0 0 64 64" className="w-10 h-10">
      <ellipse cx="32" cy="42" rx="16" ry="14" fill="#F9A8D4" />
      <circle cx="32" cy="24" r="15" fill="#F9A8D4" />
      <polygon points="19,14 22,2 30,14" fill="#F9A8D4" />
      <polygon points="21,14 23,6 28,14" fill="#F472B6" />
      <polygon points="34,14 42,2 45,14" fill="#F9A8D4" />
      <polygon points="36,14 41,6 43,14" fill="#F472B6" />
      <ellipse cx="26" cy="23" rx="4" ry="4.5" fill="#4A1D3A" />
      <ellipse cx="38" cy="23" rx="4" ry="4.5" fill="#4A1D3A" />
      <ellipse cx="27" cy="22" rx="2" ry="2.5" fill="white" />
      <ellipse cx="39" cy="22" rx="2" ry="2.5" fill="white" />
      <circle cx="27.5" cy="21.5" r="1" fill="#1E0A14" />
      <circle cx="39.5" cy="21.5" r="1" fill="#1E0A14" />
      <polygon points="32,27 30,30 34,30" fill="#F472B6" />
      <path d="M30 30 Q32 33 32 30" stroke="#4A1D3A" strokeWidth="1" fill="none" />
      <path d="M32 30 Q32 33 34 30" stroke="#4A1D3A" strokeWidth="1" fill="none" />
      <line x1="20" y1="27" x2="12" y2="25" stroke="#4A1D3A" strokeWidth="0.8" />
      <line x1="20" y1="29" x2="12" y2="30" stroke="#4A1D3A" strokeWidth="0.8" />
      <line x1="44" y1="27" x2="52" y2="25" stroke="#4A1D3A" strokeWidth="0.8" />
      <line x1="44" y1="29" x2="52" y2="30" stroke="#4A1D3A" strokeWidth="0.8" />
    </svg>
  ),
  singa: (
    <svg viewBox="0 0 64 64" className="w-10 h-10">
      <circle cx="32" cy="26" r="18" fill="#F59E0B" />
      <circle cx="32" cy="26" r="16" fill="#FBBF24" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <polygon key={angle} points="32,26 28,10 36,10" fill="#D97706" transform={`rotate(${angle} 32 26)`} opacity="0.6" />
      ))}
      <circle cx="32" cy="28" r="12" fill="#FCD34D" />
      <circle cx="26" cy="26" r="3.5" fill="#78350F" />
      <circle cx="38" cy="26" r="3.5" fill="#78350F" />
      <circle cx="27" cy="25" r="1.5" fill="white" />
      <circle cx="39" cy="25" r="1.5" fill="white" />
      <ellipse cx="32" cy="32" rx="3" ry="2" fill="#92400E" />
      <path d="M28 35 Q32 38 36 35" stroke="#78350F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  burung_hantu: (
    <svg viewBox="0 0 64 64" className="w-10 h-10">
      <ellipse cx="32" cy="40" rx="18" ry="16" fill="#A5B4FC" />
      <ellipse cx="32" cy="42" rx="12" ry="11" fill="#C7D2FE" />
      <circle cx="32" cy="22" r="15" fill="#A5B4FC" />
      <polygon points="19,14 22,2 27,14" fill="#6366F1" />
      <polygon points="37,14 42,2 45,14" fill="#6366F1" />
      <circle cx="25" cy="22" r="7" fill="#E0E7FF" />
      <circle cx="39" cy="22" r="7" fill="#E0E7FF" />
      <circle cx="25" cy="22" r="4" fill="#1E1B4B" />
      <circle cx="39" cy="22" r="4" fill="#1E1B4B" />
      <circle cx="26" cy="21" r="1.5" fill="white" />
      <circle cx="40" cy="21" r="1.5" fill="white" />
      <polygon points="30,27 32,32 34,27" fill="#F59E0B" />
      <ellipse cx="14" cy="38" rx="6" ry="12" fill="#818CF8" transform="rotate(15 14 38)" />
      <ellipse cx="50" cy="38" rx="6" ry="12" fill="#818CF8" transform="rotate(-15 50 38)" />
      <line x1="26" y1="54" x2="24" y2="58" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="54" x2="40" y2="58" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  kelinci: (
    <svg viewBox="0 0 64 64" className="w-10 h-10">
      <ellipse cx="32" cy="44" rx="16" ry="14" fill="#C4B5FD" />
      <ellipse cx="32" cy="40" rx="10" ry="9" fill="#EDE9FE" />
      <circle cx="32" cy="26" r="14" fill="#C4B5FD" />
      <ellipse cx="22" cy="6" rx="5" ry="16" fill="#C4B5FD" transform="rotate(-10 22 6)" />
      <ellipse cx="22" cy="6" rx="3" ry="12" fill="#EDE9FE" transform="rotate(-10 22 6)" />
      <ellipse cx="42" cy="6" rx="5" ry="16" fill="#C4B5FD" transform="rotate(10 42 6)" />
      <ellipse cx="42" cy="6" rx="3" ry="12" fill="#EDE9FE" transform="rotate(10 42 6)" />
      <circle cx="26" cy="24" r="3.5" fill="#4C1D95" />
      <circle cx="38" cy="24" r="3.5" fill="#4C1D95" />
      <circle cx="27" cy="23" r="1.5" fill="white" />
      <circle cx="39" cy="23" r="1.5" fill="white" />
      <ellipse cx="32" cy="29" rx="2.5" ry="2" fill="#A78BFA" />
      <line x1="24" y1="30" x2="16" y2="28" stroke="#4C1D95" strokeWidth="0.8" />
      <line x1="24" y1="32" x2="16" y2="33" stroke="#4C1D95" strokeWidth="0.8" />
      <line x1="40" y1="30" x2="48" y2="28" stroke="#4C1D95" strokeWidth="0.8" />
      <line x1="40" y1="32" x2="48" y2="33" stroke="#4C1D95" strokeWidth="0.8" />
    </svg>
  ),
};

export default function DashboardClient({
  tasks,
  userName,
  totalAktif,
  mendesakHariIni,
  selesaiMingguIni,
  userId,
}: DashboardClientProps) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<FilterTab>("semua");
  const [avatar, setAvatar] = useState<string>("gajah");

  useEffect(() => {
    async function loadAvatar() {
      const { data } = await supabase
        .from("mahasiswa")
        .select("avatar")
        .eq("id", userId)
        .single();
      if (data?.avatar) setAvatar(data.avatar);
    }
    loadAvatar();

    const channel = supabase
      .channel("avatar-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "mahasiswa", filter: `id=eq.${userId}` },
        (payload: { new: { avatar?: string } }) => {
          if (payload.new.avatar) setAvatar(payload.new.avatar);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const firstName = userName.split(" ")[0];
  const filteredTasks = tasks.filter((t) => (activeTab === "semua" ? true : t.kategori === activeTab));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
            {AVATARS[avatar] || AVATARS.gajah}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight leading-tight">
              Halo, {firstName}
            </h1>
            <p className="text-sm text-slate-500">
              {totalAktif > 0 ? `${totalAktif} tugas menunggu dikerjakan` : "Semua tugas sudah selesai!"}
            </p>
          </div>
        </div>
        <Link href="/tugas/baru" className="btn-primary hidden md:flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Tambah Tugas
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <MetricCard label="Total tugas aktif" value={totalAktif} sub="semua kategori" />
        <MetricCard label="Mendesak hari ini" value={mendesakHariIni} sub="deadline < 24 jam" valueColor={mendesakHariIni > 0 ? "text-red-600" : undefined} />
        <MetricCard label="Selesai minggu ini" value={selesaiMingguIni} accent />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700">Daftar Tugas</h2>
        <FilterTabs active={activeTab} onChange={setActiveTab} />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-600 font-medium text-sm">Belum ada tugas</p>
          <p className="text-slate-400 text-xs mt-1 mb-5">
            {activeTab === "semua" ? "Tambahkan tugas pertamamu sekarang!" : `Belum ada tugas ${activeTab}.`}
          </p>
          <Link href="/tugas/baru" className="btn-primary inline-flex items-center gap-1.5 text-sm">Tambah Tugas</Link>
        </div>
      ) : (
        <div className="space-y-3">{filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)}</div>
      )}

      <Link href="/tugas/baru" className="md:hidden fixed bottom-20 right-4 btn-primary flex items-center gap-1.5 shadow-lg">Tambah</Link>
    </div>
  );
}