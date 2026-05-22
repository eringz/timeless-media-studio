import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_RON_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_RON_SUPABASE_ANON_KEY;

// Lumikha ng isang helper para hindi mag-crash ang app kapag wala pang variables (build time)
export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Nagbabalik ng null imbes na patakbuhin ang createClient na magpapasabog sa build
    return null;
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
  });

  if (client.storage && (client as any).storage.url) {
    (client as any).storage.url = `${supabaseUrl}/storage/v1`;
  }

  return client;
};

// I-export ang singleton instance para sa runtime (gagana lang 'to sa browser/server dynamically)
export const supabase = typeof window !== "undefined" || (supabaseUrl && supabaseAnonKey)
  ? getSupabaseClient()!
  : (null as any);