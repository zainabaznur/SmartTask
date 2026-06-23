"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tugas, TugasFormData } from "@/lib/types";
import { toInputDatetime, fromInputDatetime } from "@/lib/date";
import { createClient } from "@/lib/supabase/client";

interface TaskFormProps {
  mode: "create" | "edit";
  task?: Tugas;
  mahasiswaId: string;
}

export default function TaskForm({ mode, task, mahasiswaId }: TaskFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<TugasFormData>({
    judul: task?.judul || "",
    deskripsi: task?.deskripsi || "",
    kategori: task?.kategori || "kuliah",
    deadline: task ? toInputDatetime(task.deadline) : "",
    notifikasi_aktif: task?.notifikasi_aktif ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const deadlineUTC = fromInputDatetime(form.deadline);

    if (mode === "create") {
      const { error: err } = await supabase.from("tugas").insert({
        mahasiswa_id: mahasiswaId,
        judul: form.judul,
        deskripsi: form.deskripsi || null,
        kategori: form.kategori,
        deadline: deadlineUTC,
        notifikasi_aktif: form.notifikasi_aktif,
      });
      if (err) { setError(err.message); setLoading(false); return; }
    } else if (mode === "edit" && task) {
      const { error: err } = await supabase
        .from("tugas")
        .update({
          judul: form.judul,
          deskripsi: form.deskripsi || null,
          kategori: form.kategori,
          deadline: deadlineUTC,
          notifikasi_aktif: form.notifikasi_aktif,
        })
        .eq("id", task.id);
      if (err) { setError(err.message); setLoading(false); return; }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2.5 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Judul */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Judul Tugas <span className="text-red-500">*</span>
        </label>
        <input
          name="judul"
          type="text"
          className="input-field"
          placeholder="Mis. Laporan Praktikum Algoritma"
          value={form.judul}
          onChange={handleChange}
          required
          maxLength={200}
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Deskripsi <span className="text-slate-400 font-normal">(opsional)</span>
        </label>
        <textarea
          name="deskripsi"
          className="textarea-field"
          rows={3}
          placeholder="Detail tugas, referensi, catatan..."
          value={form.deskripsi}
          onChange={handleChange}
        />
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
        <div className="flex gap-3">
          {([
            {
              id: "kuliah",
              label: "Kuliah",
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
              activeClass: "bg-blue-50 text-blue-700 border-blue-300",
            },
            {
              id: "organisasi",
              label: "Organisasi",
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              ),
              activeClass: "bg-purple-50 text-purple-700 border-purple-300",
            },
          ] as const).map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setForm((p) => ({ ...p, kategori: k.id }))}
              className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                form.kategori === k.id
                  ? k.activeClass
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {k.icon}
              {k.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Deadline <span className="text-red-500">*</span>
          <span className="text-xs text-slate-400 font-normal ml-1">(Waktu Jakarta / WIB)</span>
        </label>
        <input
          name="deadline"
          type="datetime-local"
          className="input-field"
          value={form.deadline}
          onChange={handleChange}
          required
        />
      </div>

      {/* Notifikasi Telegram */}
      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3.5 border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Notifikasi Telegram</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Pengingat H-3, H-1, dan 3 jam sebelum deadline
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, notifikasi_aktif: !p.notifikasi_aktif }))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
            form.notifikasi_aktif ? "bg-blue-600" : "bg-slate-300"
          }`}
          role="switch"
          aria-checked={form.notifikasi_aktif}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              form.notifikasi_aktif ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary flex-1"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-60"
        >
          {loading
            ? "Menyimpan..."
            : mode === "create"
            ? "Tambah Tugas"
            : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}