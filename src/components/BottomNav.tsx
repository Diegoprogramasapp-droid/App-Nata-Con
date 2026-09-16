type NavKey = "inicio" | "historico" | "registrar" | "perfil";

const items: { key: NavKey; label: string }[] = [
  { key: "inicio", label: "Início" },
  { key: "historico", label: "Histórico" },
  { key: "registrar", label: "Registrar" },
  { key: "perfil", label: "Perfil" },
];

type BottomNavProps = {
  active: NavKey;
  onChange?: (key: NavKey) => void;
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <div className="flex justify-around items-center pt-2.5 mt-auto border-t border-line">
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <button
            key={item.key}
            onClick={() => onChange?.(item.key)}
            className={`flex flex-col items-center gap-1 text-[0.6rem] ${
              isActive ? "text-ink font-semibold" : "text-ink-soft"
            }`}
          >
            <span className={`w-[18px] h-[18px] rounded-md ${isActive ? "bg-ink" : "bg-line"}`} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
