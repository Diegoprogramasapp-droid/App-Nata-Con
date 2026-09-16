import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { StatCard } from "../components/StatCard";
import { Avatar } from "../components/Avatar";
import { BottomNav } from "../components/BottomNav";
import { strokeColors, Stroke } from "../lib/theme";
import { useAuth } from "../lib/AuthContext";
import { fetchSwimTimes, fetchProfile, centisecondsToTimeString } from "../lib/times";

export function DashboardScreen() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [bestByStroke, setBestByStroke] = useState<Partial<Record<Stroke, number>>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [recentPoints, setRecentPoints] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user.id) return;

    (async () => {
      setLoading(true);
      const [{ data: profile }, { data: allTimes }] = await Promise.all([
        fetchProfile(session.user.id),
        fetchSwimTimes(session.user.id),
      ]);

      setFirstName((profile?.full_name as string)?.split(" ")[0] ?? "");
      setTotalCount(allTimes.length);

      const bests: Partial<Record<Stroke, number>> = {};
      allTimes.forEach((t) => {
        if (!(t.stroke in bests) || t.time_centiseconds < bests[t.stroke]!) {
          bests[t.stroke] = t.time_centiseconds;
        }
      });
      setBestByStroke(bests);

      setRecentPoints(
        allTimes
          .slice(0, 7)
          .reverse()
          .map((t) => t.time_centiseconds)
      );

      setLoading(false);
    })();
  }, [session?.user.id]);

  if (loading) {
    return (
      <div className="bg-base min-h-screen flex items-center justify-center text-ink-soft text-sm">
        carregando…
      </div>
    );
  }

  const min = Math.min(...recentPoints);
  const max = Math.max(...recentPoints);
  const range = max - min || 1;
  const svgPoints = recentPoints
    .map((p, i) => {
      const x = 10 + (i * 200) / Math.max(recentPoints.length - 1, 1);
      const y = 5 + 50 * ((p - min) / range);
      return `${x},${60 - y}`;
    })
    .join(" ");

  const strokeEntries = Object.entries(bestByStroke) as [Stroke, number][];

  return (
    <div className="bg-base min-h-screen flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Avatar size={32} />
        <div className="text-xs font-semibold text-ink-soft">olá, {firstName || "atleta"} 👋</div>
      </div>

      {strokeEntries.length === 0 ? (
        <Card className="text-center text-xs text-ink-soft py-4">
          registre seu primeiro tempo pra ver seus recordes aqui
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {strokeEntries.slice(0, 4).map(([stroke, value]) => (
            <StatCard
              key={stroke}
              label={`melhor ${strokeColors[stroke].text.toLowerCase()}`}
              value={centisecondsToTimeString(value)}
              accentColor={strokeColors[stroke].solid}
            />
          ))}
        </div>
      )}

      <Card className="text-center">
        <div className="text-xs font-semibold text-ink-soft">treinos registrados</div>
        <div className="font-display font-semibold text-2xl text-ink">{totalCount}</div>
      </Card>

      <div className="text-xs font-semibold text-ink-soft">evolução recente</div>
      <Card className="flex-1 min-h-[80px] p-2">
        {recentPoints.length > 1 ? (
          <svg viewBox="0 0 220 70" className="w-full h-full">
            <polyline
              points={svgPoints}
              fill="none"
              stroke="#0090C3"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div className="text-xs text-ink-soft text-center py-6">sem dados suficientes ainda</div>
        )}
      </Card>

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
