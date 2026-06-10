-- =====================================================
-- SQL SCHEMA UNTUK SUPABASE
-- =====================================================
-- Cara menggunakan:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih project kamu
-- 3. Klik "SQL Editor" di sidebar kiri
-- 4. Copy-paste seluruh isi file ini
-- 5. Klik "Run" untuk mengeksekusi
-- =====================================================

-- Buat tabel transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  transaction_date DATE NOT NULL,
  company_name TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Pemasukan', 'Pengeluaran')),
  amount BIGINT NOT NULL CHECK (amount > 0),
  description TEXT
);

-- Aktifkan Row Level Security (RLS)
-- RLS = fitur keamanan Supabase untuk mengontrol siapa yang bisa akses data
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Buat policy agar semua operasi diizinkan (karena ini app internal)
-- Di production, kamu mungkin mau bikin policy yang lebih ketat
CREATE POLICY "Allow all operations" ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Aktifkan Realtime untuk tabel ini
-- Ini yang membuat data otomatis muncul tanpa refresh halaman
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;

-- Index untuk mempercepat query sorting
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_company ON transactions (company_name);
