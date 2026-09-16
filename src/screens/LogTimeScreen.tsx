import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Stopwatch } from "../components/Stopwatch";
import { StrokePill, PlainPill } from "../components/StrokePill";
import { Stroke } from "../lib/theme";
import { useAuth } from "../lib/AuthContext";
import { useStopwatch } from "../lib/useStopwatch";
import { insertSwimTime, timeStringToCentiseconds } from "../lib/times";

const strokes: Stroke[] = ["crawl", "costas", "borboleta", "peito"];
const distances = [25, 50, 100, 200];

export function LogTimeScreen() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const stopwatch = useStopwatch();

  const [stroke, setStroke] = useState<Stroke>("crawl");
  const [distance, setDistance] = useState(50);
  const [isCompetition, setIsCompetition] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Alterna entre cronômetro ao vivo e digitação manual (ex: tempo anotado
  // na prancheta durante o treino e lançado depois).
  const [manualEntry, setManualEntry] = useState(false);
  const [manualValue, setManualValue] = useState(""); // formato "00:31.02"

  function getCentiseconds(): number | null {
    if (!manualEntry) return stopwatch.centiseconds || null;
    if (!/^\d{2}:\d{2}\.\d{2}$/.test(manualValue)) return null;
    return timeStringToCentiseconds(manualValue);
  }

  async function handleSave() {
    if (!session?.user.id) return;

    const centiseconds = getCentiseconds();
    if (!centiseconds) {
      setErrorMsg(
        manualEntry
          ? "Digite o tempo no formato 00:31.02."
          : "Registre um tempo antes de salvar."
      );
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const { error } = await insertSwimTime({
      userId: session.user.id,
      stroke,
      distance,
      timeCentiseconds: centiseconds,
      isCompetition,
    });

    setSaving(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    // Vai pra tela de comparação/resultado com o tempo recém-salvo,
    // que busca lá o melhor/pior daquele estilo+distância.
    navigate(`/comparacao?stroke=${stroke}&distance=${distance}`);
    stopwatch.reset();
    setManualValue("");
  }

  return (
    <div className="bg-base min-h-screen flex flex-col gap-3 p-4">
      <div className="text-xs font-semibold text-ink-soft">novo registro</div>
      <div className="font-display font-semibold text-lg text-ink">Qual estilo?</div>

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

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs font-semibold text-ink-soft">tempo</span>
        <button
          onClick={() => {
            setManualEntry((v) => !v);
            setErrorMsg(null);
          }}
          className="text-[0.68rem] text-ink-soft underline"
        >
          {manualEntry ? "usar cronômetro" : "digitar manualmente"}
        </button>
      </div>

      <Card className="flex flex-col items-center gap-3 py-4">
        {!manualEntry ? (
          <>
            <Stopwatch value={stopwatch.formatted} size="lg" />
            <div className="flex gap-2 w-full">
              {!stopwatch.isRunning ? (
                <Button variant="solid" onClick={stopwatch.start} className="flex-1">
                  {stopwatch.centiseconds > 0 ? "Retomar" : "Iniciar"}
                </Button>
              ) : (
                <Button variant="solid" onClick={stopwatch.pause} className="flex-1">
                  Pausar
                </Button>
              )}
              <Button variant="ghost" onClick={stopwatch.reset} className="flex-1">
                Zerar
              </Button>
            </div>
          </>
        ) : (
          <input
            type="text"
            placeholder="00:31.02"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            className="h-11 w-full text-center rounded-lg border-[1.5px] border-line font-display text-xl tabular-nums outline-none focus:border-crawl"
          />
        )}
      </Card>

      <label className="flex items-center gap-2 text-xs text-ink-soft">
        <input
          type="checkbox"
          checked={isCompetition}
          onChange={(e) => setIsCompetition(e.target.checked)}
          className="w-4 h-4 accent-ink"
        />
        é competição (não treino)
      </label>

      {errorMsg && <div className="text-xs text-[#C24E4E]">{errorMsg}</div>}

      <div className="flex-1" />
      <Button variant="solid" onClick={handleSave} disabled={saving}>
        {saving ? "Salvando..." : "Salvar tempo"}
      </Button>
    </div>
  );
}
