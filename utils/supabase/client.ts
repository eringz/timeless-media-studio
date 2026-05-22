import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_RON_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_RON_SUPABASE_ANON_KEY;

export const getSupabase = () => {
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing during build time. Using placeholder client.");
    return createClient("https://placeholder-project.supabase.co", "placeholder-key");
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
  });

  if (client.storage && (client as any).storage.url) {
    (client as any).storage.url = `${supabaseUrl}`;
  }

  return client;
};