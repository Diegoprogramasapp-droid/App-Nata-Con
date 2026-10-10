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
    <>
      {/* espaçador: reserva o lugar da barra no fim da página */}
      <div aria-hidden style={{ height: "calc(4.5rem + env(safe-area-inset-bottom))" }} />

      <nav
        className="fixed bottom-0 inset-x-0 z-50 bg-base border-t border-line"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-md flex justify-around items-center pt-2.5 pb-2">
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
                <span
                  className={`w-[18px] h-[18px] rounded-md ${isActive ? "bg-ink" : "bg-line"}`}
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}