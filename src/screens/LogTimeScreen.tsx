import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { StrokePill, PlainPill } from "../components/StrokePill";
import { Stroke } from "../lib/theme";
import { useAuth } from "../lib/AuthContext";
import { insertSwimTime, timeStringToCentiseconds } from "../lib/times";

const strokes: Stroke[] = ["crawl", "costas", "borboleta", "peito", "medley"];
const distances = [25, 50, 100, 200];

type Mode = "treino" | "competicao";

export function LogTimeScreen() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("treino");
  const [stroke, setStroke] = useState<Stroke>("crawl");
  const [distance, setDistance] = useState(50);
  const [competitionDetails, setCompetitionDetails] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tempo é sempre digitado manualmente — o cronômetro interno foi removido
  // porque o que vale oficialmente é o tempo do cronometrista na beira da piscina.
  const [timeValue, setTimeValue] = useState(""); // formato "00:31.02"

  function getCentiseconds(): number | null {
    if (!/^\d{2}:\d{2}\.\d{2}$/.test(timeValue)) return null;
    return timeStringToCentiseconds(timeValue);
  }

  async function handleSave() {
    if (!session?.user.id) return;

    const centiseconds = getCentiseconds();
    if (!centiseconds) {
      setErrorMsg("Digite o tempo no formato 00:31.02.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const { error } = await insertSwimTime({
      userId: session.user.id,
      stroke,
      distance,
      timeCentiseconds: centiseconds,
      isCompetition: mode === "competicao",
      competitionDetails: competitionDetails.trim() || undefined,
    });

    setSaving(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

        navigate(`/comparacao?stroke=${stroke}&distance=${distance}&mode=${mode}`);
    setTimeValue("");
    setCompetitionDetails("");
  }

  return (
    <div className="bg-base min-h-screen flex flex-col gap-3 p-4">
      <div className="text-xs font-semibold text-ink-soft">novo registro</div>

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

      <div className="font-display font-semibold text-lg text-ink mt-1">Qual estilo?</div>

      <div className="grid grid-cols-2 gap-2">
        {strokes.map((s) => (
          <StrokePill key={s} stroke={s} selected={stroke === s} onClick={() => setStroke(s)} />
        ))}
      </div>

      <div className="text-xs font-semibold text-ink-soft mt-1">distância</div>
      <div className="flex gap-2">
        {distances.map((d) => (
          <PlainPill
            key={d}
            label={`${d}m`}
            selected={distance === d}
            onClick={() => setDistance(d)}
          />
        ))}
      </div>

      <div className="text-xs font-semibold text-ink-soft mt-1">tempo</div>

      <Card className="flex flex-col items-center gap-3 py-4">
        <input
          type="text"
          placeholder="00:31.02"
          value={timeValue}
          onChange={(e) => setTimeValue(e.target.value)}
          className="h-11 w-full text-center rounded-lg border-[1.5px] border-line font-display text-xl tabular-nums outline-none focus:border-crawl"
        />
      </Card>

      {mode === "competicao" && (
        <>
          <div className="text-xs font-semibold text-ink-soft mt-1">local, dia e data</div>
          <textarea
            placeholder="Ex: Campeonato Estadual, Clube X, 15/09/2026"
            value={competitionDetails}
            onChange={(e) => setCompetitionDetails(e.target.value)}
            rows={2}
            className="w-full rounded-lg border-[1.5px] border-line p-2.5 text-sm outline-none focus:border-crawl resize-none"
          />
        </>
      )}

      {errorMsg && <div className="text-xs text-[#C24E4E]">{errorMsg}</div>}

      <div className="flex-1" />
      <Button variant="solid" onClick={handleSave} disabled={saving}>
        {saving ? "Salvando..." : "Salvar tempo"}
      </Button>
    </div>
  );
}