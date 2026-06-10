/**
 * Root Layout
 * 
 * Ini adalah "pembungkus" utama seluruh halaman di aplikasi.
 * Setiap halaman akan otomatis dibungkus oleh layout ini.
 * 
 * Di sini kita mengatur:
 * 1. Font global (Inter dari Google Fonts)
 * 2. Metadata SEO (title, description)
 * 3. Struktur HTML dasar
 */

import { Inter } from "next/font/google";
import "./globals.css";

// Mengimpor font Inter dari Google Fonts
// Next.js akan otomatis mengoptimasi dan meng-host font ini
const inter = Inter({
  subsets: ["latin"],       // Subset karakter yang dibutuhkan
  variable: "--font-inter", // CSS variable untuk dipakai di Tailwind
});

// Metadata untuk SEO - muncul di tab browser dan hasil pencarian Google
export const metadata = {
  title: "DompetKita - Pencatatan Keuangan Internal",
  description: "Aplikasi pencatatan arus kas internal Santrikita Foundation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* 
        antialiased = bikin teks lebih halus
        font variable = menerapkan font Inter ke seluruh app
      */}
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
