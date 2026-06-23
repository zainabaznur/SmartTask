export type Urgency = "merah" | "kuning" | "hijau";
export type Kategori = "kuliah" | "organisasi";
export type TugasStatus = "aktif" | "selesai" | "terlambat";
export type NotifikasiTipe = "H-3" | "H-1" | "3jam";

export interface Mahasiswa {
  id: string;
  nama_lengkap: string;
  nim: string;
  email: string;
  program_studi: string;
  fakultas: string;
  angkatan: number;
  created_at: string;
  updated_at: string;
}

export interface Tugas {
  id: string;
  mahasiswa_id: string;
  judul: string;
  deskripsi: string | null;
  kategori: Kategori;
  deadline: string;
  status: TugasStatus;
  urgensi: Urgency;
  notifikasi_aktif: boolean;
  telegram_chat_id: string | null;
  selesai_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotifikasiLog {
  id: string;
  tugas_id: string;
  tipe: NotifikasiTipe;
  sent_at: string;
  status: string;
}

export interface TugasFormData {
  judul: string;
  deskripsi: string;
  kategori: Kategori;
  deadline: string;
  notifikasi_aktif: boolean;
}
