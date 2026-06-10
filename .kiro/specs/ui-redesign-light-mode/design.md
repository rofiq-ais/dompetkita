# Design Document — UI Redesign Light Mode (DompetKita)

## Overview

Dokumen ini mendeskripsikan arsitektur dan keputusan desain untuk mengubah DompetKita dari dark mode ke light mode dengan skema warna **Slate-Indigo Premium**. Perubahan terbatas pada dua file: `app/globals.css` (CSS variables, utility classes, form styles) dan `app/page.js` (inline styles dan Tailwind classes). Tidak ada perubahan pada logika bisnis, struktur komponen, atau koneksi database.

---

## Architecture

### Prinsip Desain

Pendekatan redesign ini mengikuti prinsip **CSS Variable Theming** — semua token warna didefinisikan di satu tempat (`:root` di `globals.css`) dan dikonsumsi via `var()` di seluruh komponen. Ini memastikan konsistensi dan kemudahan perubahan tema di masa depan.

```
app/
├── globals.css      ← Token warna, utility classes, form styles
├── layout.js        ← Tidak diubah (font Inter, metadata)
└── page.js          ← Konsumen token warna, inline styles diupdate
```

### Lapisan Styling

```
┌─────────────────────────────────────────────┐
│  Tailwind v4 Utilities (layout, spacing)    │
├─────────────────────────────────────────────┤
│  CSS Custom Properties (:root)              │
│  Token warna Slate-Indigo Premium           │
├─────────────────────────────────────────────┤
│  Utility Classes (.glass, .gradient-text)   │
├─────────────────────────────────────────────┤
│  Form Input Styles (input, select, textarea)│
└─────────────────────────────────────────────┘
```

---

## Components and Interfaces

### 1. CSS Token System (`globals.css`)

#### Color Tokens (Light Mode)

```css
:root {
  /* Background */
  --color-bg-page:        #F8FAFC;  /* Latar halaman */
  --color-bg-card:        #FFFFFF;  /* Latar kartu & panel */
  --color-bg-card-hover:  #F1F5F9;  /* Kartu saat hover */

  /* Teks */
  --color-text-primary:   #0F172A;  /* Teks utama */
  --color-text-secondary: #64748B;  /* Teks label & sekunder */

  /* Border */
  --color-border:         #E2E8F0;  /* Border default */

  /* Aksen Indigo */
  --color-primary:        #4F46E5;  /* Indigo utama */
  --color-primary-dark:   #4338CA;  /* Indigo hover/active */
  --color-primary-light:  #6366F1;  /* Indigo varian terang */

  /* Semantik */
  --color-success:        #10B981;  /* Pemasukan */
  --color-success-light:  #34D399;
  --color-danger:         #EF4444;  /* Pengeluaran */
  --color-danger-light:   #F87171;
  --color-warning:        #F59E0B;

  /* Font */
  --font-sans: var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif;
}
```

#### Body Base Style

```css
body {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  min-height: 100vh;
  overflow-x: hidden;
}
```

### 2. Utility Classes (`globals.css`)

#### `.glass` — Light Mode Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.8);
}
```

#### `.glass-strong` — Versi Opak

```css
.glass-strong {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(226, 232, 240, 0.9);
}
```

#### `.gradient-text` — Light Mode Gradient

```css
.gradient-text {
  background: linear-gradient(135deg, #4F46E5, #6366F1, #818CF8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 3. Form Input Styles (`globals.css`)

Semua elemen form (`input`, `select`, `textarea`) mendapat style konsisten:

```css
input[type="date"],
input[type="number"],
input[type="text"],
input[type="password"],
select,
textarea {
  background:    #FFFFFF;
  border:        1px solid var(--color-border);
  color:         var(--color-text-primary);
  border-radius: 10px;
  padding:       12px 16px;
  font-size:     0.95rem;
  width:         100%;
  transition:    all 0.3s ease;
  outline:       none;
  font-family:   var(--font-sans);
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--color-primary);
  box-shadow:   0 0 0 3px rgba(79, 70, 229, 0.12);
}
```

### 4. Summary Cards (`page.js`)

Tiga kartu ringkasan dengan identitas warna yang berbeda:

| Card | Ikon | Background Ikon | Warna Nilai |
|------|------|-----------------|-------------|
| Total Pemasukan | `HiArrowTrendingUp` | `rgba(16,185,129,0.12)` | `--color-success` |
| Total Pengeluaran | `HiArrowTrendingDown` | `rgba(239,68,68,0.12)` | `--color-danger` |
| Sisa Saldo Kas | `HiBanknotes` | `rgba(79,70,229,0.12)` | `--color-primary` (atau `--color-danger` jika negatif) |

Setiap card: `background: #FFFFFF`, `border: 1px solid var(--color-border)`, `rounded-2xl`, `shadow-sm`, `p-5`

#### Logika Warna Saldo

```js
// Pure function: menentukan warna nilai Sisa Saldo Kas
const getSaldoColor = (sisaSaldo) =>
  sisaSaldo >= 0 ? "var(--color-primary)" : "var(--color-danger)";
```

### 5. Form Input Section (`page.js`)

Container form: `background: #FFFFFF`, `border: 1px solid var(--color-border)`, `rounded-2xl`, `shadow-sm`, `p-6`

#### Toggle Button Logic

```js
// Pure function: menentukan style tombol toggle Pemasukan/Pengeluaran
const getToggleStyle = (type, selectedType) => {
  if (type !== selectedType) {
    return {
      background: "#FFFFFF",
      border: "1px solid var(--color-border)",
      color: "var(--color-text-secondary)",
    };
  }
  return type === "Pemasukan"
    ? {
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.4)",
        color: "var(--color-success)",
      }
    : {
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.4)",
        color: "var(--color-danger)",
      };
};
```

#### Tombol Simpan

```js
style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)", color: "#FFFFFF" }}
```

### 6. Riwayat Mutasi sebagai Card-Rows (`page.js`)

Mengganti `<table>` dengan `<div>` card-rows pada tampilan desktop. Setiap card-row:

```
┌────────────────────────────────────────────────────────────────┐
│  [Tanggal]  [Badge Perusahaan]  [Badge Jenis]  [Nominal]  [Hapus]  │
│             [Keterangan]                                       │
└────────────────────────────────────────────────────────────────┘
```

Style card-row: `background: #FFFFFF`, `border: 1px solid var(--color-border)`, `rounded-xl`, `shadow-sm`

Hover: background berubah ke `#F8FAFC` dengan `transition: all 200ms`

#### Badge Logic

```js
// Pure function: menentukan style badge berdasarkan jenis transaksi
const getTransactionBadgeStyle = (transactionType) =>
  transactionType === "Pemasukan"
    ? { background: "rgba(16,185,129,0.12)", color: "var(--color-success)" }
    : { background: "rgba(239,68,68,0.12)", color: "var(--color-danger)" };

// Pure function: menentukan warna nominal berdasarkan jenis transaksi
const getAmountColor = (transactionType) =>
  transactionType === "Pemasukan"
    ? "var(--color-success)"
    : "var(--color-danger)";
```

#### Badge Perusahaan

```js
style={{ background: "rgba(79,70,229,0.08)", color: "var(--color-primary)" }}
```

#### Empty State

```jsx
// Ditampilkan saat filteredTransactions.length === 0
<div className="py-12 text-center">
  <p className="text-4xl mb-3">📭</p>
  <p style={{ color: "var(--color-text-secondary)" }}>Belum ada data transaksi</p>
</div>
```

---

## Data Models

Tidak ada perubahan pada model data. Semua transaksi tetap menggunakan schema Supabase yang ada:

```ts
interface Transaction {
  id: string;
  transaction_date: string;
  company_name: string;            // salah satu dari COMPANIES[]
  transaction_type: "Pemasukan" | "Pengeluaran";
  amount: number;
  description?: string;
  created_at: string;
}
```

---

### Interface Token Warna (CSS → JS)

Token warna dikonsumsi di `page.js` via string `var(--token-name)` di dalam object `style`:

```js
// Contoh pola penggunaan token warna di JSX
<span style={{ color: "var(--color-text-secondary)" }}>Label</span>
<div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
```

### Interface Animasi

Keyframe animasi yang ada dipertahankan, dengan penyesuaian `pulseGlow` ke warna light mode:

```css
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(79, 70, 229, 0.2); }
  50%       { box-shadow: 0 0 20px rgba(79, 70, 229, 0.4); }
}
```

### Custom Scrollbar

```css
::-webkit-scrollbar-track { background: #F1F5F9; }
::-webkit-scrollbar-thumb { background: rgba(79, 70, 229, 0.3); }
```

---

## Testing Strategy

### Dual Testing Approach

Fitur UI redesign ini terutama melibatkan perubahan konfigurasi statis (CSS variables, Tailwind classes), sehingga sebagian besar acceptance criteria diverifikasi via smoke test dan snapshot test. Logika kondisional murni (pure functions yang menentukan warna/style berdasarkan state) adalah kandidat tepat untuk property-based testing.

**Unit Tests** (example-based):
- Verifikasi bahwa CSS variables di `globals.css` memiliki nilai yang benar (smoke tests)
- Verifikasi rendering komponen dengan data spesifik (snapshot tests)
- Verifikasi empty state ditampilkan saat array transaksi kosong

**Property Tests** (dengan library seperti fast-check):
- Property 1: `getSaldoColor(n)` — diuji dengan 100+ angka acak (positif, negatif, nol)
- Property 2: `getToggleStyle(type, selectedType)` — diuji dengan semua kombinasi valid
- Property 3: `getTransactionBadgeStyle(type)` — diuji dengan transaksi acak
- Property 4: `getAmountColor(type)` — diuji dengan transaksi acak
- Property 5: Empty state logic — diuji dengan array kosong dan array berisi N transaksi acak

**Konfigurasi property tests**: Minimum 100 iterasi per property.

Tag format: `Feature: ui-redesign-light-mode, Property {N}: {judul}`

---

## Error Handling

Tidak ada perubahan pada error handling. Logika `showToast`, `handleSubmit`, dan `handleDelete` tetap sama. Warna toast success/error menggunakan `--color-success` dan `--color-danger` yang sudah terdefinisi di token.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Saldo Negatif Selalu Ditandai Danger

Untuk semua nilai numerik `sisaSaldo`, jika nilai tersebut lebih kecil dari nol maka warna yang dikembalikan oleh fungsi pewarnaan saldo SHALL sama dengan `"var(--color-danger)"`, dan jika nilai lebih besar atau sama dengan nol maka warna SHALL sama dengan `"var(--color-primary)"`.

**Validates: Requirements 4.6**

### Property 2: Toggle Button Active State Eksklusif

Untuk semua kombinasi `(type, selectedType)` di mana `type` adalah `"Pemasukan"` atau `"Pengeluaran"`, style aktif SHALL hanya diterapkan saat `type === selectedType`. Saat `type !== selectedType`, style SHALL selalu mengembalikan background `#FFFFFF` dan border `1px solid var(--color-border)`. Tidak ada dua tombol yang dapat aktif secara bersamaan.

**Validates: Requirements 5.7, 5.8**

### Property 3: Badge Jenis Transaksi Konsisten dengan Nilai

Untuk semua nilai `transaction_type` yang valid (`"Pemasukan"` atau `"Pengeluaran"`), style badge yang dihasilkan SHALL secara konsisten menggunakan warna success untuk Pemasukan dan warna danger untuk Pengeluaran — berlaku untuk setiap baris card-row yang dirender.

**Validates: Requirements 6.3, 6.4**

### Property 4: Warna Nominal Konsisten dengan Jenis Transaksi

Untuk semua transaksi dalam `filteredTransactions`, warna teks nominal SHALL sama dengan `"var(--color-success)"` jika `transaction_type === "Pemasukan"` dan `"var(--color-danger)"` jika `transaction_type === "Pengeluaran"`. Tidak ada transaksi Pemasukan yang ditampilkan dengan warna danger, dan sebaliknya.

**Validates: Requirements 6.6**

### Property 5: Empty State Muncul Tepat Saat Data Kosong

Untuk semua array `filteredTransactions`, jika `filteredTransactions.length === 0` maka komponen SHALL menampilkan elemen empty state (ikon dan teks "Belum ada data transaksi"), dan jika `filteredTransactions.length > 0` maka komponen SHALL tidak menampilkan empty state dan SHALL menampilkan card-rows sebanyak jumlah transaksi.

**Validates: Requirements 6.9**
