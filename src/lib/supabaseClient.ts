// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Desativa o mecanismo de lock (Navigator Locks) do supabase-js, que tem um bug
// conhecido de deadlock quando efeitos React disparam em sequência rápida
// (comum em desenvolvimento com Strict Mode / HMR do Vite).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    lock: async (_name, _acquireTimeout, fn) => fn(),
  },
});