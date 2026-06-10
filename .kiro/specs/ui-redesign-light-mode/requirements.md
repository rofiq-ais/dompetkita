# Requirements Document

## Introduction

Fitur ini mengubah tampilan DompetKita dari dark mode ke light mode dengan skema warna Slate-Indigo Premium. Perubahan mencakup dua file: `app/globals.css` (CSS variables, utility classes, form styles) dan `app/page.js` (inline styles dan Tailwind classes). Tujuannya adalah menghadirkan antarmuka yang lebih bersih, hierarki tipografi yang jelas, summary cards dengan aksen warna berbeda per card, form input gaya putih bersih, serta tabel riwayat yang ditampilkan sebagai card-rows — semuanya responsif di desktop dan mobile.

## Glossary

- **DompetKita**: Aplikasi pencatatan keuangan internal berbasis Next.js milik Santrikita Foundation.
- **Light Mode**: Skema warna berbasis latar terang dengan teks gelap, kebalikan dari dark mode saat ini.
- **Slate-Indigo Premium**: Palet warna yang digunakan: background `#F8FAFC`, aksen indigo `#4F46E5`, teks utama `#0F172A`.
- **Summary Card**: Salah satu dari tiga card ringkasan di bagian atas halaman yang menampilkan Total Pemasukan, Total Pengeluaran, dan Sisa Saldo Kas.
- **Card-Row**: Baris riwayat transaksi yang ditampilkan sebagai kartu individual dengan shadow halus, menggantikan striped table.
- **globals.css**: File `app/globals.css` yang mendefinisikan CSS variables, animasi, dan utility classes.
- **page.js**: File `app/page.js` yang berisi seluruh komponen React halaman utama.
- **Tailwind v4**: Versi Tailwind CSS yang diimpor dengan `@import "tailwindcss"` tanpa direktif `@tailwind`.

---

## Requirements

### Requirement 1 — Light Mode Color Scheme

**User Story:** Sebagai pengguna DompetKita, saya ingin tampilan aplikasi menggunakan light mode agar lebih nyaman dibaca di lingkungan terang.

#### Acceptance Criteria

1. THE `globals.css` SHALL mendefinisikan CSS variable `--color-bg-page` dengan nilai `#F8FAFC` sebagai warna latar halaman utama.
2. THE `globals.css` SHALL mendefinisikan CSS variable `--color-bg-card` dengan nilai `#FFFFFF` sebagai warna latar kartu dan panel.
3. THE `globals.css` SHALL mendefinisikan CSS variable `--color-bg-card-hover` dengan nilai `#F1F5F9` sebagai warna latar kartu saat hover.
4. THE `globals.css` SHALL mendefinisikan CSS variable `--color-text-primary` dengan nilai `#0F172A` sebagai warna teks utama.
5. THE `globals.css` SHALL mendefinisikan CSS variable `--color-text-secondary` dengan nilai `#64748B` sebagai warna teks sekunder.
6. THE `globals.css` SHALL mendefinisikan CSS variable `--color-border` dengan nilai `#E2E8F0` sebagai warna border default.
7. THE `globals.css` SHALL mendefinisikan CSS variable `--color-primary` dengan nilai `#4F46E5` dan `--color-primary-dark` dengan nilai `#4338CA` sebagai aksen utama indigo.
8. THE `globals.css` SHALL mendefinisikan CSS variable `--color-primary-light` dengan nilai `#6366F1` sebagai varian terang aksen indigo.
9. THE `globals.css` SHALL mengatur elemen `body` dengan `background: var(--color-bg-page)` dan `color: var(--color-text-primary)`.
10. WHEN halaman DompetKita dirender, THE `page.js` SHALL menampilkan latar halaman dengan warna `#F8FAFC` dan teks dengan warna `#0F172A`.

---

### Requirement 2 — Spacing dan Layout yang Konsisten

**User Story:** Sebagai pengguna DompetKita, saya ingin padding, margin, dan spacing yang rapi agar tampilan tidak terasa sempit atau berantakan.

#### Acceptance Criteria

1. THE `page.js` SHALL mengatur padding halaman utama sebesar `p-4` pada mobile dan `p-6 md:p-10` pada desktop.
2. THE `page.js` SHALL memberikan jarak antar section (`mb-6` atau `mb-8`) yang konsisten antara header, summary cards, form, dan tabel riwayat.
3. THE `page.js` SHALL mengatur padding dalam setiap Summary Card sebesar `p-5` atau `p-6` secara konsisten di ketiga card.
4. THE `page.js` SHALL mengatur padding dalam form input section sebesar `p-6`.
5. THE `page.js` SHALL mengatur padding dalam section tabel riwayat sebesar `p-6`.
6. THE `globals.css` SHALL mendefinisikan padding form input sebesar `12px 16px` secara konsisten untuk semua elemen `input`, `select`, dan `textarea`.

---

### Requirement 3 — Hierarki Tipografi yang Jelas

**User Story:** Sebagai pengguna DompetKita, saya ingin hierarki teks yang jelas agar saya bisa dengan cepat membedakan judul, label, dan nilai data.

#### Acceptance Criteria

1. THE `page.js` SHALL menampilkan nama aplikasi "DompetKita" di header dengan `font-bold` dan ukuran `text-xl`.
2. THE `page.js` SHALL menampilkan judul setiap section (seperti "Input Transaksi Baru" dan "Riwayat Mutasi") dengan class `text-lg font-semibold` dan warna `--color-text-primary`.
3. THE `page.js` SHALL menampilkan label form dengan class `text-sm font-medium` dan warna `--color-text-secondary`.
4. THE `page.js` SHALL menampilkan nilai nominal pada Summary Card dengan class `text-2xl font-bold` agar terlihat menonjol.
5. THE `page.js` SHALL menampilkan teks keterangan pada card-row riwayat dengan class `text-sm` dan warna `--color-text-secondary`.
6. THE `globals.css` SHALL mendefinisikan `font-family` menggunakan `var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif` pada elemen `body` dan semua form input.

---

### Requirement 4 — Summary Cards dengan Aksen Warna Berbeda

**User Story:** Sebagai pengguna DompetKita, saya ingin ketiga summary card memiliki aksen warna yang berbeda sehingga saya bisa langsung mengenali masing-masing card tanpa membaca labelnya.

#### Acceptance Criteria

1. THE `page.js` SHALL menampilkan card "Total Pemasukan" dengan ikon bertipe `HiArrowTrendingUp`, background ikon `rgba(16,185,129,0.12)`, dan nilai nominal berwarna `--color-success` (`#10B981`).
2. THE `page.js` SHALL menampilkan card "Total Pengeluaran" dengan ikon bertipe `HiArrowTrendingDown`, background ikon `rgba(239,68,68,0.12)`, dan nilai nominal berwarna `--color-danger` (`#EF4444`).
3. THE `page.js` SHALL menampilkan card "Sisa Saldo Kas" dengan ikon bertipe `HiBanknotes`, background ikon `rgba(79,70,229,0.12)`, dan nilai nominal berwarna `--color-primary` (`#4F46E5`).
4. THE `page.js` SHALL menampilkan ketiga Summary Card dalam layout grid `grid-cols-1` pada mobile dan `md:grid-cols-3` pada desktop dengan gap `gap-4`.
5. THE `page.js` SHALL memberikan setiap Summary Card background `#FFFFFF`, border `1px solid var(--color-border)`, border-radius `rounded-2xl`, dan box-shadow `shadow-sm`.
6. WHEN nilai `sisaSaldo` lebih kecil dari nol, THE `page.js` SHALL menampilkan nilai Sisa Saldo Kas dengan warna `--color-danger` sebagai penanda negatif.

---

### Requirement 5 — Form Input dengan Clean White Style

**User Story:** Sebagai pengguna DompetKita, saya ingin form input tampil bersih dengan latar putih agar mudah dibaca dan diisi.

#### Acceptance Criteria

1. THE `globals.css` SHALL mengatur background semua elemen `input`, `select`, dan `textarea` dengan nilai `#FFFFFF`.
2. THE `globals.css` SHALL mengatur border semua elemen `input`, `select`, dan `textarea` dengan `1px solid var(--color-border)`.
3. THE `globals.css` SHALL mengatur warna teks semua elemen `input`, `select`, dan `textarea` dengan `var(--color-text-primary)`.
4. THE `globals.css` SHALL mengatur border-radius semua elemen `input`, `select`, dan `textarea` dengan nilai `10px`.
5. WHEN elemen `input`, `select`, atau `textarea` mendapat fokus, THE `globals.css` SHALL mengubah border menjadi `1px solid var(--color-primary)` dan menambahkan `box-shadow: 0 0 0 3px rgba(79,70,229,0.12)`.
6. THE `page.js` SHALL menampilkan tombol toggle "Pemasukan" dan "Pengeluaran" dengan background `#FFFFFF`, border `1px solid var(--color-border)`, dan warna teks `--color-text-secondary` saat tidak aktif.
7. WHEN tombol toggle "Pemasukan" dipilih, THE `page.js` SHALL menampilkan tombol tersebut dengan background `rgba(16,185,129,0.1)`, border `1px solid rgba(16,185,129,0.4)`, dan warna teks `--color-success`.
8. WHEN tombol toggle "Pengeluaran" dipilih, THE `page.js` SHALL menampilkan tombol tersebut dengan background `rgba(239,68,68,0.1)`, border `1px solid rgba(239,68,68,0.4)`, dan warna teks `--color-danger`.
9. THE `page.js` SHALL menampilkan tombol "Simpan Transaksi" dengan background gradient `linear-gradient(135deg, #4F46E5, #6366F1)` dan teks berwarna putih.

---

### Requirement 6 — Tabel Riwayat sebagai Card-Rows

**User Story:** Sebagai pengguna DompetKita, saya ingin riwayat transaksi ditampilkan sebagai card-rows dengan shadow halus agar lebih mudah dibaca dan tidak terasa seperti spreadsheet.

#### Acceptance Criteria

1. THE `page.js` SHALL menampilkan setiap baris riwayat transaksi pada desktop sebagai elemen `<div>` (bukan baris `<tr>`) dengan background `#FFFFFF`, border `1px solid var(--color-border)`, border-radius `rounded-xl`, dan box-shadow `shadow-sm`.
2. THE `page.js` SHALL menampilkan field-field tiap card-row dalam layout flex horizontal: tanggal, badge perusahaan, badge jenis transaksi, nominal, keterangan, dan tombol hapus.
3. THE `page.js` SHALL menampilkan badge jenis transaksi "Pemasukan" dengan background `rgba(16,185,129,0.12)` dan teks berwarna `--color-success`.
4. THE `page.js` SHALL menampilkan badge jenis transaksi "Pengeluaran" dengan background `rgba(239,68,68,0.12)` dan teks berwarna `--color-danger`.
5. THE `page.js` SHALL menampilkan badge nama perusahaan dengan background `rgba(79,70,229,0.08)` dan teks berwarna `--color-primary`.
6. THE `page.js` SHALL menampilkan nominal "Pemasukan" dengan warna `--color-success` dan nominal "Pengeluaran" dengan warna `--color-danger` pada card-row.
7. WHEN card-row riwayat transaksi di-hover, THE `page.js` SHALL mengubah background menjadi `#F8FAFC` dengan transisi durasi `200ms`.
8. THE `page.js` SHALL menampilkan card-row mobile (layar di bawah `md`) dalam layout card vertikal dengan field yang sama namun susunan dua kolom atas-bawah.
9. WHEN tidak ada transaksi yang tersedia, THE `page.js` SHALL menampilkan pesan kosong dengan ikon dan teks "Belum ada data transaksi" di tengah section.

---

### Requirement 7 — Responsivitas Desktop dan Mobile

**User Story:** Sebagai pengguna DompetKita, saya ingin tampilan berfungsi dan terlihat baik di desktop maupun mobile agar bisa diakses dari perangkat apa saja.

#### Acceptance Criteria

1. THE `globals.css` SHALL menyertakan CSS reset `box-sizing: border-box` untuk semua elemen agar perhitungan ukuran konsisten.
2. THE `globals.css` SHALL mengatur `overflow-x: hidden` pada `body` untuk mencegah horizontal scroll yang tidak disengaja.
3. THE `page.js` SHALL mengatur lebar maksimum konten utama dengan class `max-w-6xl mx-auto` agar terpusat pada layar lebar.
4. THE `page.js` SHALL menampilkan grid form input dalam `grid-cols-1` pada mobile dan `md:grid-cols-2` pada desktop.
5. THE `page.js` SHALL menampilkan card-row versi desktop hanya pada layar `md` ke atas menggunakan class `hidden md:flex`, dan card-row versi mobile hanya pada layar di bawah `md` menggunakan class `md:hidden`.
6. THE `page.js` SHALL memastikan tombol "Simpan Transaksi" memiliki lebar penuh (`w-full`) pada mobile dan lebar otomatis (`md:w-auto`) pada desktop.
7. WHEN lebar viewport kurang dari `768px`, THE `page.js` SHALL menampilkan header dalam layout satu baris dengan logo di kiri dan tombol "Keluar" di kanan tanpa overflow.

---

### Requirement 8 — Tailwind v4 dan Struktur CSS

**User Story:** Sebagai developer DompetKita, saya ingin `globals.css` menggunakan sintaks Tailwind v4 yang benar agar build tidak error.

#### Acceptance Criteria

1. THE `globals.css` SHALL mengimpor Tailwind menggunakan `@import "tailwindcss"` sebagai baris pertama file, tanpa menggunakan direktif `@tailwind base`, `@tailwind components`, atau `@tailwind utilities`.
2. THE `globals.css` SHALL mendefinisikan semua CSS custom properties di dalam blok `:root {}`.
3. THE `globals.css` SHALL mempertahankan semua definisi keyframe animasi yang sudah ada (`fadeInUp`, `slideInRight`, `pulseGlow`, `shimmer`, `spin`) dengan penyesuaian warna ke light mode jika diperlukan.
4. THE `globals.css` SHALL memperbarui utility class `.glass` agar menggunakan `background: rgba(255,255,255,0.7)` dan `border: 1px solid rgba(226,232,240,0.8)` sebagai pengganti efek kaca dark mode.
5. THE `globals.css` SHALL memperbarui utility class `.glass-strong` agar menggunakan `background: rgba(255,255,255,0.9)` dan `border: 1px solid rgba(226,232,240,0.9)`.
6. THE `globals.css` SHALL memperbarui custom scrollbar agar `scrollbar-track` menggunakan `#F1F5F9` dan `scrollbar-thumb` menggunakan `rgba(79,70,229,0.3)`.
7. THE `globals.css` SHALL memperbarui utility class `.gradient-text` agar menggunakan gradient `linear-gradient(135deg, #4F46E5, #6366F1, #818CF8)`.
