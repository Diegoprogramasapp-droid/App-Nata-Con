// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Coloque essas duas chaves no seu .env (Project Settings > API no Supabase)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
