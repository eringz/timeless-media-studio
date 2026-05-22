import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_RON_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_RON_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
});

// Iyong storage fix hook kung kailangan talaga
if (supabaseUrl && supabase.storage && (supabase as any).storage.url) {
  (supabase as any).storage.url = `${supabaseUrl}/storage/v1`;
}