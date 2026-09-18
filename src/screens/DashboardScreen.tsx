import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Avatar } from "../components/Avatar";
import { BottomNav } from "../components/BottomNav";
import { strokeColors } from "../lib/theme";
import { useAuth } from "../lib/AuthContext";
import { fetchProfile, fetchStrokeSummaries, centisecondsToTimeString, StrokeSummary } from "../lib/times";

type Mode = "treino" | "competicao";

export function DashboardScreen() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [mode, setMode] = useState<Mode>("treino");
  const [summaries, setSummaries] = useState<StrokeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user.id) return;

    (async () => {
      setLoading(true);
      const [{ data: profile }, { data: strokeSummaries }] = await Promise.all([
        fetchProfile(session.user.id),
        fetchStrokeSummaries(session.user.id, mode === "competicao"),
      ]);

      setFirstName((profile?.full_name as string)?.split(" ")[0] ?? "");
      setSummaries(strokeSummaries);
      setLoading(false);
    })();
  }, [session?.user.id, mode]);

  return (
    <div className="bg-base min-h-screen flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Avatar size={32} />
        <div className="text-xs font-semibold text-ink-soft">olá, {firstName || "atleta"} 👋</div>
      </div>

      {/* Abas Treino / Competição */}
      <div className="flex rounded-lg border-[1.5px] border-line overflow-hidden">
        <button
          onClick={() => setMode("treino")}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            mode === "treino" ? "bg-ink text-white" : "bg-white text-ink-soft"
          }`}
        >
          Treino
        </button>
        <button
          onClick={() => setMode("competicao")}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            mode === "competicao" ? "bg-ink text-white" : "bg-white text-ink-soft"
          }`}
        >
          Competição
        </button>
      </div>

      {loading ? (
        <div className="text-xs text-ink-soft text-center py-6">carregando…</div>
      ) : summaries.length === 0 ? (
        <Card className="text-center text-xs text-ink-soft py-4">
          {mode === "treino"
            ? "registre seu primeiro tempo de treino pra ver seus recordes aqui"
            : "registre seu primeiro tempo de competição pra ver seus recordes aqui"}
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {summaries.map(({ stroke, bestCentiseconds, mostRecentDistance }) => (
            <Card
              key={stroke}
              onClick={() =>
                navigate(`/comparacao?stroke=${stroke}&distance=${mostRecentDistance}&mode=${mode}`)
              }
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: strokeColors[stroke].solid }}
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">{strokeColors[stroke].text}</div>
                <div className="text-[0.68rem] text-ink-soft">melhor tempo · {mostRecentDistance}m</div>
              </div>
              <div className="font-display font-semibold text-lg text-ink tabular-nums">
                {centisecondsToTimeString(bestCentiseconds)}
              </div>
            </Card>
          ))}
        </div>
      )}

      <BottomNav
        active="inicio"
        onChange={(key) => {
          if (key === "historico") navigate("/historico");
          if (key === "registrar") navigate("/registrar");
          if (key === "perfil") navigate("/configuracoes");
        }}
      />
    </div>
  );
}