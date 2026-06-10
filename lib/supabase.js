/**
 * Supabase Client Configuration
 * 
 * File ini membuat koneksi ke database Supabase.
 * Kita hanya perlu membuat koneksi SEKALI (singleton pattern),
 * lalu menggunakannya di seluruh aplikasi.
 * 
 * NEXT_PUBLIC_ prefix artinya variabel ini bisa diakses di browser (client-side).
 * Ini aman karena anon key memiliki akses terbatas (Row Level Security di Supabase).
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
