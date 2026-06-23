"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const AVATARS = [
  {
    id: "gajah",
    name: "Gajah",
    svg: (
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
  },
  {
    id: "kucing",
    name: "Kucing",
    svg: (
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
  },
  {
    id: "singa",
    name: "Singa",
    svg: (
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
  },
  {
    id: "burung_hantu",
    name: "Burung Hantu",
    svg: (
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
  },
  {
    id: "kelinci",
    name: "Kelinci",
    svg: (
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
  },
];

export default function PengaturanPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingTelegram, setLoadingTelegram] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editTelegram, setEditTelegram] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    nama_lengkap: "",
    nim: "",
    program_studi: "",
    fakultas: "",
    avatar: "gajah",
    notif_h3: true,
    notif_h1: true,
    notif_3jam: true,
  });
  const [telegramChatId, setTelegramChatId] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("mahasiswa")
        .select("nama_lengkap, nim, program_studi, fakultas, avatar, notif_h3, notif_h1, notif_3jam")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile({
          nama_lengkap: profileData.nama_lengkap || "",
          nim: profileData.nim || "",
          program_studi: profileData.program_studi || "",
          fakultas: profileData.fakultas || "",
          avatar: profileData.avatar || "gajah",
          notif_h3: profileData.notif_h3 ?? true,
          notif_h1: profileData.notif_h1 ?? true,
          notif_3jam: profileData.notif_3jam ?? true,
        });
      }

      const { data: tasks } = await supabase
        .from("tugas")
        .select("telegram_chat_id")
        .eq("mahasiswa_id", user.id)
        .eq("notifikasi_aktif", true)
        .not("telegram_chat_id", "is", null)
        .limit(1);
      if (tasks && tasks.length > 0) setTelegramChatId(tasks[0].telegram_chat_id);
    }
    load();
  }, [supabase]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoadingProfile(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: upsertError } = await supabase.from("mahasiswa").upsert({
      id: user.id,
      nama_lengkap: profile.nama_lengkap,
      nim: profile.nim,
      program_studi: profile.program_studi,
      fakultas: profile.fakultas,
      avatar: profile.avatar,
    });
    if (upsertError) { setError(upsertError.message); setLoadingProfile(false); return; }
    setLoadingProfile(false);
    setEditProfile(false);
    setSaved("profile");
    setTimeout(() => setSaved(""), 2500);
  }

  async function handleSaveTelegram(e: React.FormEvent) {
    e.preventDefault();
    setLoadingTelegram(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: updateError } = await supabase.from("tugas").update({ telegram_chat_id: telegramChatId }).eq("mahasiswa_id", user.id).eq("notifikasi_aktif", true);
    if (updateError) { setError(updateError.message); setLoadingTelegram(false); return; }
    setLoadingTelegram(false);
    setEditTelegram(false);
    setSaved("telegram");
    setTimeout(() => setSaved(""), 2500);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <button type="button" onClick={() => router.push("/dashboard")} className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div><h1 className="text-xl font-semibold text-slate-900">Pengaturan</h1><p className="text-sm text-slate-500 mt-0.5">Kelola profil dan preferensi notifikasimu</p></div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2.5 text-sm mb-5 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>}
      {saved === "profile" && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-5 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Profil berhasil disimpan</div>}
      {saved === "telegram" && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-5 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Chat ID Telegram berhasil disimpan</div>}

      {/* Profil */}
      <div className="card p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-sm font-semibold text-slate-900">Profil Mahasiswa</h2><p className="text-xs text-slate-500 mt-0.5">Kelola informasi profil kamu</p></div>
          <button type="button" onClick={() => setEditProfile(!editProfile)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">{editProfile ? "Tutup" : "Edit"}</button>
        </div>
        {editProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Pilih Avatar</label>
              <div className="flex gap-3 flex-wrap">
                {AVATARS.map((a) => (
                  <button key={a.id} type="button" onClick={() => setProfile((p) => ({ ...p, avatar: a.id }))} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${profile.avatar === a.id ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"}`} title={a.name}>{a.svg}</button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">Terpilih: {AVATARS.find((a) => a.id === profile.avatar)?.name}</p>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label><input type="text" className="input-field" value={profile.nama_lengkap} onChange={(e) => setProfile((p) => ({ ...p, nama_lengkap: e.target.value }))} placeholder="Nama lengkap kamu" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">NIM</label><input type="text" className="input-field" value={profile.nim} onChange={(e) => setProfile((p) => ({ ...p, nim: e.target.value }))} placeholder="NIM" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Fakultas</label><input type="text" className="input-field" value={profile.fakultas} onChange={(e) => setProfile((p) => ({ ...p, fakultas: e.target.value }))} placeholder="Fakultas" /></div>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Program Studi</label><input type="text" className="input-field" value={profile.program_studi} onChange={(e) => setProfile((p) => ({ ...p, program_studi: e.target.value }))} placeholder="Program Studi" /></div>
            <button type="submit" disabled={loadingProfile} className="btn-primary disabled:opacity-60">{loadingProfile ? "Menyimpan..." : "Simpan Profil"}</button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4 mb-4"><div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">{AVATARS.find((a) => a.id === profile.avatar)?.svg}</div><div><p className="text-sm font-medium text-slate-900">{AVATARS.find((a) => a.id === profile.avatar)?.name}</p><p className="text-xs text-slate-500">Avatar aktif</p></div></div>
            <div className="flex justify-between text-sm py-2 border-b border-slate-100"><span className="text-slate-500">Nama Lengkap</span><span className={profile.nama_lengkap ? "text-slate-900 font-medium" : "text-slate-400"}>{profile.nama_lengkap || "Belum diatur"}</span></div>
            <div className="flex justify-between text-sm py-2 border-b border-slate-100"><span className="text-slate-500">NIM</span><span className={profile.nim ? "text-slate-900 font-medium font-mono" : "text-slate-400"}>{profile.nim || "Belum diatur"}</span></div>
            <div className="flex justify-between text-sm py-2 border-b border-slate-100"><span className="text-slate-500">Fakultas</span><span className={profile.fakultas ? "text-slate-900 font-medium" : "text-slate-400"}>{profile.fakultas || "Belum diatur"}</span></div>
            <div className="flex justify-between text-sm py-2"><span className="text-slate-500">Program Studi</span><span className={profile.program_studi ? "text-slate-900 font-medium" : "text-slate-400"}>{profile.program_studi || "Belum diatur"}</span></div>
          </div>
        )}
      </div>

      {/* Telegram */}
      <div className="card p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-sm font-semibold text-slate-900">Notifikasi Telegram</h2><p className="text-xs text-slate-500 mt-0.5">Hubungkan dengan bot untuk pengingat otomatis</p></div>
          <button type="button" onClick={() => setEditTelegram(!editTelegram)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">{editTelegram ? "Tutup" : "Edit"}</button>
        </div>
        {editTelegram ? (
          <form onSubmit={handleSaveTelegram} className="space-y-3 mb-4 p-5 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-100">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Cara Mendapatkan Chat ID:
              </h3>
              <ol className="space-y-3 text-xs text-slate-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">1</span>
                  <div>
                    <p className="font-medium text-slate-700">Cari @BotFather</p>
                    <p>Buka Telegram, cari <code className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">@BotFather</code>, lalu klik <strong>Start</strong></p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">2</span>
                  <div>
                    <p className="font-medium text-slate-700">Buat Bot Baru</p>
                    <p>Kirim perintah <code className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">/newbot</code> → isi nama bot → isi username unik berakhiran <strong>bot</strong></p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">3</span>
                  <div>
                    <p className="font-medium text-slate-700">Simpan Token</p>
                    <p>BotFather akan memberi token (contoh: <code className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">123456:ABC-DEF1234</code>). <strong>Salin & simpan baik-baik!</strong></p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">4</span>
                  <div>
                    <p className="font-medium text-slate-700">Dapatkan Chat ID</p>
                    <p>Buka bot kamu di Telegram, klik <strong>Start</strong>. Lalu buka browser & kunjungi:</p>
                    <code className="block bg-slate-100 text-slate-700 px-2 py-1 rounded mt-1 text-xs break-all">
                      https://api.telegram.org/botTOKEN/getUpdates
                    </code>
                    <p className="mt-1">Cari <code className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">"chat":&#123;"id":12345678&#125;</code> → itulah <strong>Chat ID</strong> kamu</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">5</span>
                  <div>
                    <p className="font-medium text-slate-700">Tempel di Sini</p>
                    <p>Salin angka Chat ID tersebut & tempel di kolom di bawah, lalu klik <strong>Simpan</strong></p>
                  </div>
                </li>
              </ol>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Telegram Chat ID</label>
              <input type="text" className="input-field font-mono" placeholder="123456789" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} />
            </div>
            <button type="submit" disabled={loadingTelegram} className="btn-primary disabled:opacity-60 text-sm">
              {loadingTelegram ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        ) : (
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Telegram Chat ID</span>
            <span className={telegramChatId ? "text-slate-900 font-medium font-mono" : "text-slate-400"}>{telegramChatId || "Belum diatur"}</span>
          </div>
        )}
      </div>

      {/* Interval Notifikasi — ON/OFF */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-1">Interval Notifikasi</h2>
        <p className="text-xs text-slate-500 mb-5">Aktifkan notifikasi sesuai kebutuhan:</p>
        <div className="space-y-1">
          {[
            { key: "notif_h3", label: "H-3 (3 hari sebelum)", sub: "Pengingat awal" },
            { key: "notif_h1", label: "H-1 (1 hari sebelum)", sub: "Pengingat mendesak" },
            { key: "notif_3jam", label: "3 jam sebelum", sub: "Pengingat kritis" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div><p className="text-sm font-medium text-slate-700">{item.label}</p><p className="text-xs text-slate-400 mt-0.5">{item.sub}</p></div>
              <button
                type="button"
                onClick={async () => {
                  const k = item.key as "notif_h3" | "notif_h1" | "notif_3jam";
                  const newVal = !profile[k];
                  setProfile((p) => ({ ...p, [k]: newVal }));
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) await supabase.from("mahasiswa").update({ [k]: newVal }).eq("id", user.id);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${profile[item.key as "notif_h3" | "notif_h1" | "notif_3jam"] ? "bg-blue-600" : "bg-slate-300"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profile[item.key as "notif_h3" | "notif_h1" | "notif_3jam"] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}