# Implementation Plan: UI Redesign Light Mode (DompetKita)

## Overview

Implementasi mengubah DompetKita dari dark mode ke light mode dengan skema warna **Slate-Indigo Premium**. Perubahan terbatas pada dua file: `app/globals.css` dan `app/page.js`. Logika bisnis, struktur komponen, dan koneksi Supabase tidak disentuh.

Pendekatan: update CSS variables di `globals.css` terlebih dahulu sebagai fondasi token warna, lalu update `page.js` yang mengonsumsi token tersebut via inline `style={}`. Terakhir, ekstrak pure functions ke helper dan tulis property-based tests.

---

## Tasks

- [ ] 1. Update `globals.css` — CSS variables dan base styles
  - [ ] 1.1 Ganti semua CSS custom properties di `:root` ke nilai light mode
    - Ubah `--color-primary` → `#4F46E5`, `--color-primary-dark` → `#4338CA`, `--color-primary-light` → `#6366F1`
    - Hapus `--color-bg-dark`, tambahkan `--color-bg-page: #F8FAFC`, `--color-bg-card: #FFFFFF`, `--color-bg-card-hover: #F1F5F9`
    - Ubah `--color-text-primary` → `#0F172A`, `--color-text-secondary` → `#64748B`
    - Ubah `--color-border` → `#E2E8F0`
    - Pertahankan `--color-success`, `--color-success-light`, `--color-danger`, `--color-danger-light`, `--color-warning`, `--font-sans`
    - _Requirements: 1.1–1.8_

  - [ ] 1.2 Update selector `body` dan utility classes ke light mode
    - Ubah `body { background: var(--color-bg-page); color: var(--color-text-primary); }`
    - Ubah `.glass` → `background: rgba(255,255,255,0.7)`, `border: 1px solid rgba(226,232,240,0.8)`
    - Ubah `.glass-strong` → `background: rgba(255,255,255,0.9)`, `border: 1px solid rgba(226,232,240,0.9)`
    - Ubah `.gradient-text` → `linear-gradient(135deg, #4F46E5, #6366F1, #818CF8)`
    - Update `@keyframes pulseGlow` → `rgba(79,70,229,0.2)` dan `rgba(79,70,229,0.4)`
    - Update custom scrollbar: track `#F1F5F9`, thumb `rgba(79,70,229,0.3)`
    - _Requirements: 8.3–8.7_

  - [ ] 1.3 Update form input styles ke white clean style
    - Ubah `input`, `select`, `textarea` → `background: #FFFFFF`, `border: 1px solid var(--color-border)`, `color: var(--color-text-primary)`, `border-radius: 10px`
    - Ubah focus state → `border-color: var(--color-primary)`, `box-shadow: 0 0 0 3px rgba(79,70,229,0.12)`
    - Update SVG chevron pada `select` dari warna `#94a3b8` ke `#64748B` (sesuai `--color-text-secondary`)
    - _Requirements: 5.1–5.5, 2.6_

- [ ] 2. Ekstrak pure functions di `page.js`
  - [ ] 2.1 Buat fungsi `getSaldoColor(sisaSaldo)` dan `getToggleStyle(type, selectedType)`
    - Tambahkan fungsi `getSaldoColor` di atas komponen `Home`: kembalikan `"var(--color-primary)"` jika `sisaSaldo >= 0`, `"var(--color-danger)"` jika negatif
    - Tambahkan fungsi `getToggleStyle(type, selectedType)`: kembalikan object style inactive (`background: "#FFFFFF"`, border default) atau style active sesuai jenis
    - _Requirements: 4.6, 5.6–5.8_

  - [ ]* 2.2 Tulis property test untuk `getSaldoColor` (Property 1)
    - **Property 1: Saldo Negatif Selalu Ditandai Danger**
    - Install `fast-check` sebagai devDependency jika belum ada: `npm install --save-dev fast-check`
    - Buat file `__tests__/colorHelpers.test.js`
    - Gunakan `fc.integer()` dan `fc.float()` untuk generate ratusan nilai positif, negatif, dan nol
    - Assert: `getSaldoColor(n) === "var(--color-danger)"` jika `n < 0`, `"var(--color-primary)"` jika `n >= 0`
    - **Validates: Requirements 4.6**

  - [ ]* 2.3 Tulis property test untuk `getToggleStyle` (Property 2)
    - **Property 2: Toggle Button Active State Eksklusif**
    - Gunakan `fc.constantFrom("Pemasukan", "Pengeluaran")` untuk dua argumen
    - Assert: style aktif hanya muncul saat `type === selectedType`; saat tidak aktif selalu `background: "#FFFFFF"`
    - **Validates: Requirements 5.7, 5.8**

- [ ] 3. Ekstrak pure functions badge dan update `page.js` — bagian atas
  - [ ] 3.1 Buat `getTransactionBadgeStyle(transactionType)` dan `getAmountColor(transactionType)`
    - Tambahkan fungsi di atas komponen `Home`
    - `getTransactionBadgeStyle`: kembalikan object style success/danger sesuai jenis transaksi
    - `getAmountColor`: kembalikan string `"var(--color-success)"` atau `"var(--color-danger)"`
    - _Requirements: 6.3–6.4, 6.6_

  - [ ]* 3.2 Tulis property test untuk `getTransactionBadgeStyle` dan `getAmountColor` (Property 3 & 4)
    - **Property 3: Badge Jenis Transaksi Konsisten dengan Nilai**
    - **Property 4: Warna Nominal Konsisten dengan Jenis Transaksi**
    - Gunakan `fc.constantFrom("Pemasukan", "Pengeluaran")` sebagai arbitrary
    - Assert keempat fungsi: setiap input valid selalu menghasilkan output yang konsisten
    - **Validates: Requirements 6.3, 6.4, 6.6**

- [ ] 4. Update `page.js` — latar halaman, login screen, dan header
  - [ ] 4.1 Update background halaman utama dan login screen
    - Ganti inline `style={{ background: "linear-gradient(135deg, #0f172a ...)" }}` pada `<div>` root login dan main dengan `background: "var(--color-bg-page)"`; atau gunakan warna solid `#F8FAFC` jika gradient dihilangkan
    - Update container login `.glass-strong` — tidak ada perubahan class, hanya pastikan `globals.css` yang sudah diupdate di task 1 menerapkan warna yang benar
    - Update padding halaman: `p-4` mobile, `md:p-6 lg:p-10` desktop sesuai requirements 2.1
    - _Requirements: 1.9, 1.10, 2.1_

  - [ ] 4.2 Update header dan tombol Keluar
    - Logo ikon tetap menggunakan gradient indigo (`#4F46E5` → `#6366F1`), pastikan `gradient-text` berfungsi di light mode
    - Tombol "Keluar": ubah style ke `background: rgba(239,68,68,0.1)`, `color: var(--color-danger)`
    - Pastikan header `flex` satu baris dengan logo di kiri, tombol di kanan — tidak ada overflow pada mobile
    - _Requirements: 3.1, 7.7_

- [ ] 5. Update `page.js` — Summary Cards
  - [ ] 5.1 Update tiga Summary Card ke light mode style
    - Ubah setiap card `<div>` container dari `.glass` + dark inline style ke: `background: "#FFFFFF"`, `border: "1px solid var(--color-border)"`, class `rounded-2xl shadow-sm`
    - Card Pemasukan: ikon background `rgba(16,185,129,0.12)`, nilai gunakan `"var(--color-success)"`
    - Card Pengeluaran: ikon background `rgba(239,68,68,0.12)`, nilai gunakan `"var(--color-danger)"`
    - Card Sisa Saldo: ikon background `rgba(79,70,229,0.12)`, nilai gunakan `getSaldoColor(sisaSaldo)`
    - _Requirements: 4.1–4.5_

- [ ] 6. Update `page.js` — Form Input Section
  - [ ] 6.1 Update container form dan tombol toggle
    - Ubah container form dari `.glass` ke `background: "#FFFFFF"`, `border: "1px solid var(--color-border)"`, class `rounded-2xl shadow-sm p-6`
    - Ubah label warna ke `"var(--color-text-secondary)"` (sudah ada, pastikan konsisten)
    - Refactor tombol toggle `["Pemasukan", "Pengeluaran"]` untuk menggunakan `getToggleStyle(type, form.transaction_type)` sebagai nilai `style`
    - Tombol Simpan: pastikan gradient `linear-gradient(135deg, #4F46E5, #6366F1)` dan teks putih
    - _Requirements: 5.6–5.9, 2.4_

- [ ] 7. Update `page.js` — Riwayat Mutasi (Card-Rows)
  - [ ] 7.1 Ganti `<table>` desktop dengan card-rows `<div>`
    - Hapus blok `{/* Desktop Table */}` yang menggunakan `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`
    - Buat pengganti: container `<div className="hidden md:flex flex-col gap-3">`, di dalamnya map `filteredTransactions` menjadi `<div>` card-row individual
    - Setiap card-row: `background: "#FFFFFF"`, `border: "1px solid var(--color-border)"`, class `rounded-xl shadow-sm`, layout flex horizontal
    - Field order: tanggal, badge perusahaan, badge jenis, nominal, keterangan (truncated), tombol hapus
    - Hover: `onMouseEnter` → `background: "#F8FAFC"`, `transition: "all 200ms"`
    - Gunakan `getTransactionBadgeStyle(t.transaction_type)` untuk badge jenis
    - Gunakan `getAmountColor(t.transaction_type)` untuk warna nominal
    - Badge perusahaan: `background: "rgba(79,70,229,0.08)"`, `color: "var(--color-primary)"`
    - _Requirements: 6.1–6.7_

  - [ ] 7.2 Update mobile card layout
    - Ubah container mobile dari `style={{ background: "rgba(15,23,42,0.5)", border: "..." }}` ke `background: "#FFFFFF"`, `border: "1px solid var(--color-border)"`, class `rounded-xl shadow-sm`
    - Pastikan layout dua kolom atas-bawah dengan field yang sama (tanggal, badge jenis, nominal, perusahaan, keterangan, hapus)
    - Gunakan helper functions yang sudah dibuat di task 3
    - _Requirements: 6.8, 7.5_

  - [ ]* 7.3 Tulis property test untuk empty state logic (Property 5)
    - **Property 5: Empty State Muncul Tepat Saat Data Kosong**
    - Gunakan `@testing-library/react` untuk render komponen, atau ekstrak logika tampil/sembunyi ke fungsi murni yang bisa diuji tanpa DOM
    - Alternatif yang lebih ringan: buat pure function `shouldShowEmptyState(arr)` → kembalikan `arr.length === 0`
    - Gunakan `fc.array(fc.record({ id: fc.string(), ... }))` untuk generate array transaksi acak
    - Assert: jika array kosong → empty state muncul; jika tidak kosong → tidak muncul
    - **Validates: Requirements 6.9**

- [ ] 8. Checkpoint — Verifikasi visual dan linting
  - Jalankan `npm run build` untuk memastikan tidak ada error TypeScript/JSX
  - Jalankan `npm run lint` untuk memastikan tidak ada ESLint error
  - Periksa secara visual bahwa seluruh halaman sudah menggunakan warna light mode (tidak ada warna gelap yang tersisa)
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP lebih cepat
- Setiap task mereferensikan requirement spesifik untuk keterlacakan
- Pure functions diekstrak lebih dahulu (task 2 & 3) sebelum digunakan di task 5–7
- Property tests memvalidasi invariant warna yang harus berlaku untuk semua nilai input, bukan hanya contoh spesifik
- `globals.css` diselesaikan di task 1 sebelum `page.js` agar token warna sudah tersedia saat implementasi komponen
- Tidak ada perubahan pada logika bisnis, Supabase client, atau struktur komponen React

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "3.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "3.2", "4.1"] },
    { "id": 4, "tasks": ["4.2", "5.1"] },
    { "id": 5, "tasks": ["6.1"] },
    { "id": 6, "tasks": ["7.1", "7.2"] },
    { "id": 7, "tasks": ["7.3"] }
  ]
}
```
