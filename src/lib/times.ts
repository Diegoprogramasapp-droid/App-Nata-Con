// lib/times.ts
import { supabase } from "./supabaseClient";
import { Stroke } from "./theme";

export type SwimTime = {
  id: string;
  stroke: Stroke;
  distance: number;
  time_centiseconds: number;
  is_competition: boolean;
  recorded_at: string;
};

// --- helpers de formato ---

// "00:31.02" -> 3102 (centésimos)
export function timeStringToCentiseconds(mmss: string): number {
  const [mm, rest] = mmss.split(":");
  const [ss, cc] = rest.split(".");
  return (parseInt(mm) * 60 + parseInt(ss)) * 100 + parseInt(cc || "0");
}

// 3102 -> "00:31.02"
export function centisecondsToTimeString(total: number): string {
  const cc = total % 100;
  const totalSeconds = Math.floor(total / 100);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60);
  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  return `${pad(mm)}:${pad(ss)}.${pad(cc)}`;
}

// --- CRUD ---

export async function insertSwimTime(params: {
  userId: string;
  stroke: Stroke;
  distance: number;
  timeCentiseconds: number;
  isCompetition: boolean;
}) {
  const { data, error } = await supabase
    .from("swim_times")
    .insert({
      user_id: params.userId,
      stroke: params.stroke,
      distance: params.distance,
      time_centiseconds: params.timeCentiseconds,
      is_competition: params.isCompetition,
    })
    .select()
    .single();

  return { data, error: error?.message ?? null };
}

export async function fetchSwimTimes(userId: string, stroke?: Stroke) {
  let query = supabase
    .from("swim_times")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false });

  if (stroke) query = query.eq("stroke", stroke);

  const { data, error } = await query;
  return { data: (data as SwimTime[]) ?? [], error: error?.message ?? null };
}

// Retorna o melhor (menor) e pior (maior) tempo pra um estilo+distância específicos.
// Usado na tela de comparação/resultado logo depois de salvar um novo tempo.
export async function fetchBestAndWorst(userId: string, stroke: Stroke, distance: number) {
  const { data, error } = await supabase
    .from("swim_times")
    .select("time_centiseconds")
    .eq("user_id", userId)
    .eq("stroke", stroke)
    .eq("distance", distance)
    .order("time_centiseconds", { ascending: true });

  if (error || !data || data.length === 0) {
    return { best: null, worst: null, error: error?.message ?? null };
  }

  return {
    best: data[0].time_centiseconds as number,
    worst: data[data.length - 1].time_centiseconds as number,
    error: null,
  };
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return { data, error: error?.message ?? null };
}

export async function upsertProfile(userId: string, fields: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...fields })
    .select()
    .single();
  return { data, error: error?.message ?? null };
}
