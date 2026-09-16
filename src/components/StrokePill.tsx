import { Stroke, strokeColors } from "../lib/theme";

type StrokePillProps = {
  stroke: Stroke;
  selected?: boolean;
  onClick?: () => void;
};

// Pill colorida por estilo de nado — usada na tela de registro e nos filtros do histórico.
export function StrokePill({ stroke, selected = false, onClick }: StrokePillProps) {
  const c = strokeColors[stroke];

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition-colors"
      style={{
        backgroundColor: selected ? c.solid : c.soft,
        color: selected ? "#fff" : c.solid,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: selected ? "#fff" : c.solid }}
      />
      {c.text}
    </button>
  );
}

// Variante genérica pra distância (50m/100m/200m) e outros seletores neutros,
// que não têm cor de estilo associada.
type PlainPillProps = { label: string; selected?: boolean; onClick?: () => void };

export function PlainPill({ label, selected = false, onClick }: PlainPillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg py-2 text-xs font-semibold text-center transition-colors ${
        selected ? "bg-ink text-white" : "bg-white border-[1.5px] border-line text-ink-soft"
      }`}
    >
      {label}
    </button>
  );
}
