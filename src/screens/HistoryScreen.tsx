import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Stopwatch } from "../components/Stopwatch";
import { Badge } from "../components/Badge";
import { BottomNav } from "../components/BottomNav";
import { strokeColors, Stroke } from "../lib/theme";
import { useAuth } from "../lib/AuthContext";
import { fetchSwimTimes, SwimTime, centisecondsToTimeString } from "../lib/times";

const strokeFilters: (Stroke | "todos")[] = ["todos", "crawl", "costas", "borboleta", "peito"];

export function HistoryScreen() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Stroke | "todos">("todos");
  const [entries, setEntries] = useState<SwimTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user.id) return;
    setLoading(true);
    fetchSwimTimes(session.user.id, filter === "todos" ? undefined : filter).then(({ data }) => {
      setEntries(data);
      setLoading(false);
    });
  }, [session?.user.id, filter]);

  // pra marcar "melhor"/"pior" por estilo+distância dentro da lista carregada
  const bestByGroup: Record<string, number> = {};
  const worstByGroup: Record<string, number> = {};
  entries.forEach((e) => {
    const key = `${e.stroke}-${e.distance}`;
    if (!(key in bestByGroup) || e.time_centiseconds < bestByGroup[key]) bestByGroup[key] = e.time_centiseconds;
    if (!(key in worstByGroup) || e.time_centiseconds > worstByGroup[key]) worstByGroup[key] = e.time_centiseconds;
  });

  return (
    <div className="bg-base min-h-screen flex flex-col gap-3 p-4">
      <div className="text-xs font-semibold text-ink-soft">histórico</div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {strokeFilters.map((s) => {
          const active = filter === s;
          const color = s !== "todos" ? strokeColors[s].solid : undefined;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap"
              style={{
                backgroundColor: active ? color ?? "#0B1F2A" : "#fff",
                color: active ? "#fff" : "#5C7079",
                border: active ? "none" : "1.5px solid #E1E9EB",
              }}
            >
              {s === "todos" ? "Todos" : strokeColors[s].text}
            </button>
          );
        })}
      </div>

      {loading && <div className="text-xs text-ink-soft text-center py-6">carregando…</div>}

      {!loading && entries.length === 0 && (
        <div className="text-xs text-ink-soft text-center py-6">
          nenhum tempo registrado ainda — bora nadar 🏊
        </div>
      )}

      {entries.map((e) => {
        const key = `${e.stroke}-${e.distance}`;
        const isBest = e.time_centiseconds === bestByGroup[key];
        const isWorst = e.time_centiseconds === worstByGroup[key] && bestByGroup[key] !== worstByGroup[key];
        const color = strokeColors[e.stroke].solid;

        return (
          <Card key={e.id} accentColor={isBest ? "#FFB627" : undefined} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <div className="flex-1">
              <Stopwatch value={centisecondsToTimeString(e.time_centiseconds)} size="sm" />
              <div className="text-[0.68rem] text-ink-soft">
                {e.distance}m · {e.is_competition ? "competição" : "treino"} ·{" "}
                {new Date(e.recorded_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
              </div>
            </div>
            {isBest && <Badge label="MELHOR" tone="gold" />}
            {isWorst && <Badge label="PIOR" tone="neutral" />}
          </Card>
        );
      })}

      <BottomNav
        active="historico"
        onChange={(key) => {
          if (key === "inicio") navigate("/");
          if (key === "registrar") navigate("/registrar");
          if (key === "perfil") navigate("/configuracoes");
        }}
      />
    </div>
  );
}
