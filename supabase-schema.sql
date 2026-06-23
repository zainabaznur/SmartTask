-- ============================================================
-- SmartTask Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- mahasiswa table (already seeded — only create if missing)
-- ============================================================
CREATE TABLE IF NOT EXISTS mahasiswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lengkap VARCHAR(100) NOT NULL,
    nim VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    program_studi VARCHAR(100) NOT NULL,
    fakultas VARCHAR(100) NOT NULL DEFAULT 'Teknik',
    angkatan INTEGER NOT NULL DEFAULT 2022,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- tugas table
-- ============================================================
CREATE TABLE IF NOT EXISTS tugas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahasiswa_id UUID REFERENCES mahasiswa(id) ON DELETE CASCADE,
    judul VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    kategori VARCHAR(20) NOT NULL CHECK (kategori IN ('kuliah', 'organisasi')),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'aktif'
        CHECK (status IN ('aktif', 'selesai', 'terlambat')),
    urgensi VARCHAR(10) GENERATED ALWAYS AS (
        CASE
            WHEN deadline - NOW() < INTERVAL '3 hours' THEN 'merah'
            WHEN deadline - NOW() < INTERVAL '24 hours' THEN 'kuning'
            ELSE 'hijau'
        END
    ) STORED,
    notifikasi_aktif BOOLEAN DEFAULT TRUE,
    telegram_chat_id VARCHAR(50),
    selesai_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- notifikasi_log table
-- ============================================================
CREATE TABLE IF NOT EXISTS notifikasi_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tugas_id UUID REFERENCES tugas(id) ON DELETE CASCADE,
    tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('H-3', 'H-1', '3jam')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'terkirim'
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE mahasiswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tugas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifikasi_log ENABLE ROW LEVEL SECURITY;

-- mahasiswa: users can only see/edit their own row
CREATE POLICY "mahasiswa_select_own" ON mahasiswa
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "mahasiswa_insert_own" ON mahasiswa
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "mahasiswa_update_own" ON mahasiswa
    FOR UPDATE USING (auth.uid() = id);

-- tugas: users can only CRUD their own tasks
CREATE POLICY "tugas_select_own" ON tugas
    FOR SELECT USING (
        mahasiswa_id = auth.uid()
    );

CREATE POLICY "tugas_insert_own" ON tugas
    FOR INSERT WITH CHECK (
        mahasiswa_id = auth.uid()
    );

CREATE POLICY "tugas_update_own" ON tugas
    FOR UPDATE USING (
        mahasiswa_id = auth.uid()
    );

CREATE POLICY "tugas_delete_own" ON tugas
    FOR DELETE USING (
        mahasiswa_id = auth.uid()
    );

-- notifikasi_log: users can see their own logs
CREATE POLICY "notifikasi_log_select_own" ON notifikasi_log
    FOR SELECT USING (
        tugas_id IN (
            SELECT id FROM tugas WHERE mahasiswa_id = auth.uid()
        )
    );

-- Service role can insert notifikasi_log (for cron job)
CREATE POLICY "notifikasi_log_insert_service" ON notifikasi_log
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mahasiswa_updated_at
    BEFORE UPDATE ON mahasiswa
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tugas_updated_at
    BEFORE UPDATE ON tugas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tugas_mahasiswa_deadline
    ON tugas(mahasiswa_id, deadline ASC);

CREATE INDEX IF NOT EXISTS idx_tugas_status
    ON tugas(status);

CREATE INDEX IF NOT EXISTS idx_notifikasi_log_tugas_tipe
    ON notifikasi_log(tugas_id, tipe);
