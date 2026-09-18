import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { StatCard } from "../components/StatCard";
import { PlainPill } from "../components/StrokePill";
import { useAuth } from "../lib/AuthContext";
import { fetchBestAndWorst, fetchSwimTimes, centisecondsToTimeString } from "../lib/times";
import { Stroke, strokeColors } from "../lib/theme";

const distances = [25, 50, 100, 200];

export function ComparisonScreen() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const stroke = (params.get("stroke") as Stroke) ?? "crawl";
  const distance = Number(params.get("distance") ?? 50);
  const mode = params.get("mode") === "competicao" ? "competicao" : "treino";
  const isCompetition = mode === "competicao";

  const [best, setBest] = useState<number | null>(null);
  const [worst, setWorst] = useState<number | null>(null);
  const [points, setPoints] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user.id) return;

    (async () => {
      setLoading(true);
      const [{ best, worst }, { data: history }] = await Promise.all([
        fetchBestAndWorst(session.user.id, stroke, distance, isCompetition),
        fetchSwimTimes(session.user.id, stroke, isCompetition),
      ]);
      setBest(best);
      setWorst(worst);
      setPoints(
        history
          .filter((h) => h.distance === distance)
          .slice(0, 7)
          .reverse()
          .map((h) => h.time_centiseconds)
      );
      setLoading(false);
    })();
  }, [session?.user.id, stroke, distance, isCompetition]);

  function changeDistance(d: number) {
    setParams({ stroke, distance: String(d), mode });
  }

  if (loading) {
    return (
      <div className="bg-base min-h-screen flex items-center justify-center text-ink-soft text-sm">
        carregando…
      </div>
    );
  }

  const latest = points[points.length - 1];
  const isNewRecord = latest !== undefined && best !== null && latest === best;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const svgPoints = points
    .map((p, i) => {
      const x = 10 + (i * 200) / Math.max(points.length - 1, 1);
      const y = 10 + 80 * ((p - min) / range);
      return `${x},${90 - y}`;
    })
    .join(" ");

  return (
    <div className="bg-base min-h-screen flex flex-col gap-3 p-4">
      <button onClick={() => navigate(-1)} className="text-xs text-ink-soft self-start">
        ← voltar
      </button>

      <div className="text-xs font-semibold text-ink-soft">
        {strokeColors[stroke].text} · {mode === "competicao" ? "competição" : "treino"}
      </div>

      <div className="flex gap-2">
        {distances.map((d) => (
          <PlainPill
            key={d}
            label={`${d}m`}
            selected={distance === d}
            onClick={() => changeDistance(d)}
          />
        ))}
      </div>

      {points.length === 0 ? (
        <Card className="text-center text-xs text-ink-soft py-8">
          nenhum tempo registrado nessa distância ainda
        </Card>
      ) : (
        <>
          <div
            className="rounded-xl text-center py-5 px-3"
            style={{
              background: isNewRecord
                ? "linear-gradient(135deg, #FFB627, #FF9F1C)"
                : "linear-gradient(135deg, #94A3AC, #7C8B94)",
            }}
          >
            <div className="text-xs font-bold text-white tracking-wide">
              {isNewRecord ? "🏅 NOVO RECORDE" : "TEMPO REGISTRADO"}
            </div>
            <div className="font-display font-bold text-3xl text-white tabular-nums">
              {latest !== undefined ? centisecondsToTimeString(latest) : "--:--.--"}
            </div>
            {!isNewRecord && worst !== null && (
              <div className="text-xs text-white/90">continue treinando pro próximo recorde 💪</div>
            )}
          </div>

          <div className="text-xs font-semibold text-ink-soft">
            evolução — {strokeColors[stroke].text.toLowerCase()} {distance}m
          </div>
          <Card className="flex-1 min-h-[110px] p-2">
            {points.length > 1 ? (
              <svg viewBox="0 0 220 100" className="w-full h-full">
                <polyline
                  points={svgPoints}
                  fill="none"
                  stroke={strokeColors[stroke].solid}
                  strokeWidth={0.3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="text-xs text-ink-soft text-center py-8">
                registre mais tempos pra ver a evolução aqui
              </div>
            )}
          </Card>

          <div className="flex gap-2">
            <StatCard label="melhor" value={best !== null ? centisecondsToTimeString(best) : "--"} />
            <StatCard label="pior" value={worst !== null ? centisecondsToTimeString(worst) : "--"} />
          </div>
        </>
      )}
    </div>
  );
}