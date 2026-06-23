"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nama_lengkap: "",
    nim: "",
    email: "",
    password: "",
    program_studi: "",
    fakultas: "",
    angkatan: new Date().getFullYear().toString(),
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Create Supabase auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError || !authData.user) {
      setError(signUpError?.message || "Gagal membuat akun. Coba lagi.");
      setLoading(false);
      return;
    }

    // 2. Insert into mahasiswa table (id = auth.uid)
    const { error: dbError } = await supabase.from("mahasiswa").insert({
      id: authData.user.id,
      nama_lengkap: form.nama_lengkap,
      nim: form.nim,
      email: form.email,
      program_studi: form.program_studi,
      fakultas: form.fakultas || "Teknik",
      angkatan: parseInt(form.angkatan),
    });

    if (dbError) {
      setError("Akun dibuat tetapi data profil gagal disimpan: " + dbError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="card p-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1 tracking-tight">Daftar Smart Task</h1>
        <p className="text-sm text-slate-500 mb-6">Disesuaikan untuk mahasiswa aktif</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2.5 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input
              name="nama_lengkap"
              type="text"
              className="input-field"
              placeholder="Budi Santoso"
              value={form.nama_lengkap}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIM</label>
              <input
                name="nim"
                type="text"
                className="input-field"
                placeholder="2022100001"
                value={form.nim}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Angkatan</label>
              <input
                name="angkatan"
                type="number"
                className="input-field"
                placeholder="2022"
                value={form.angkatan}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Program Studi</label>
            <input
              name="program_studi"
              type="text"
              className="input-field"
              placeholder="Teknik Informatika"
              value={form.program_studi}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fakultas</label>
            <input
              name="fakultas"
              type="text"
              className="input-field"
              placeholder="Teknik"
              value={form.fakultas}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="input-field"
              placeholder="kamu@email.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="input-field"
              placeholder="Min. 6 karakter"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 disabled:opacity-60"
          >
            {loading ? "Membuat akun..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-5">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-700 font-medium hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
