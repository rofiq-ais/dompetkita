PRODUCT REQUIREMENT DOCUMENT (PRD)
Project Name: Dompetkita (Internal Financial App)

Version: 1.0 (MVP Phase)

Target Delivery: Fast Track / Agile Deployment

1. Background & Objectives
   Santrikita Foundation mengelola dana terpusat pada satu rekening bank utama, namun memiliki 3 anak perusahaan dengan model bisnis berbeda (PT Rakkita, PT Penakita, dan PT Madraskita).

Aplikasi ini bertujuan untuk menggantikan pencatatan Excel manual menjadi web app sederhana guna mencatat arus kas masuk/keluar, sekaligus memisahkan pos keuangan antar anak perusahaan secara digital (tagging system) meskipun rekening fisiknya tunggal.

2. User Persona & Access
   User: Internal Bendahara (Mas Fariz).

Access Control: Karena ini aplikasi internal startup yang belum memiliki sistem login kompleks, untuk tahap awal akses cukup dilindungi menggunakan 1 Master Password sederhana (Environment Variable bertenaga static routing, atau Supabase Auth sederhana) agar tidak bisa diakses publik.

3. Tech Stack Requirement (Recommended)
   Frontend: Next.js (React) + Tailwind CSS.

Database & Backend: Supabase (PostgreSQL).

Deployment: Vercel / Sejenisnya.

4. Feature Specifications (Scope of Work)
   Developer wajib membangun Single Page Application (SPA) yang terdiri dari 3 komponen utama di dalam satu halaman:

A. Form Input Transaksi
Formulir bersih dan responsif (nyaman dibuka di HP & Laptop) dengan validasi input sebagai berikut:

Tanggal: Input tanggal (default: hari ini).

Entitas Perusahaan (Dropdown):

Santrikita Foundation (Holding)

PT Rakkita (Buku Digital)

PT Penakita (Platform Menulis)

PT Madraskita (Sistem Ma'had)

Jenis Transaksi (Badges): Pemasukan / Pengeluaran.

Nominal: Input angka bersih (Rupiah). Optional: auto-formatting currency saat mengetik.

Keterangan: Textarea bebas untuk detail catatan transaksi.

B. Tabel Riwayat Mutasi (Real-time Table)
Tabel di bawah form yang menampilkan data yang ditarik langsung dari database:

Kolom Tabel: Tanggal | Perusahaan | Jenis | Nominal | Keterangan.

Sorting: Otomatis menampilkan dari yang paling baru diinput (Descending berdasarkan created_at).

Fitur Tambahan: Berikan warna teks hijau untuk Pemasukan dan warna teks merah untuk Pengeluaran agar mudah dipindai mata.

C. Ringkasan Saldo Otomatis (Mini Dashboard)
Di bagian paling atas halaman, tampilkan 3 kotak ringkasan (Card) sederhana:

Total Pemasukan (Penjumlahan semua data jenis Pemasukan).

Total Pengeluaran (Penjumlahan semua data jenis Pengeluaran).

Sisa Saldo Kas (Total Pemasukan dikurangi Total Pengeluaran).

5. Database Schema (Supabase/Postgres Table)
   Developer diharapkan membuat satu tabel bernama transactions dengan struktur:

id (uuid / int8, Primary Key)

created_at (timestamptz, default: now())

transaction_date (date)

company_name (text / varchar)

transaction_type (text / varchar)

amount (numeric / bigint)

description (text)

6. Definition of Done (DoD)
   Aplikasi dinyatakan selesai jika:

Bisa diakses via URL backend/hosting resmi.

Saat form diisi dan diklik "Simpan", data langsung masuk ke database Supabase dan otomatis muncul di tabel riwayat tanpa perlu me-refresh halaman web (state management berjalan baik).
