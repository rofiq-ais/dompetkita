/**
 * Supabase Client
 *
 * createClient hanya dipanggil jika URL tersedia.
 * Ini mencegah crash saat Next.js melakukan pre-rendering di server
 * (build time) sebelum environment variables diinject.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Hanya warning di console, tidak throw error saat build
  console.warn(
    "[supabase] Environment variables belum diset. " +
    "Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY ada di .env.local atau Vercel dashboard."
  );
}

// Gunakan placeholder agar createClient tidak throw saat build
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
