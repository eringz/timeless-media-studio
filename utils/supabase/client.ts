import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_RON_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_RON_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // o kahit anong auth settings na meron ka na dati
  },
  // Pinupuwersa nito ang client na dumaan sa tamang storage domain endpoint
  global: {
    headers: {
      // Minsan nakakatulong ito para masiguradong hindi siya nalilito sa auto-routing
    }
  }
});

// Trick para sa mga lumang SDK version: manually fixing the storage URL if it glitches
if (supabase.storage && (supabase as any).storage.url) {
  // Sinisigurado nito na ang storage API ay tuturo sa /storage/v1 at hindi sa /rest/v1
  (supabase as any).storage.url = `${supabaseUrl}/storage/v1`;
}