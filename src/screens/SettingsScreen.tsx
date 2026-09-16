import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { BottomNav } from "../components/BottomNav";
import { useAuth } from "../lib/AuthContext";

export function SettingsScreen() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="bg-base min-h-screen flex flex-col gap-3 p-4">
      <div className="text-xs font-semibold text-ink-soft">configurações</div>

      <Card
        className="flex items-center justify-between cursor-pointer"
        onClick={() => navigate("/perfil")}
      >
        <span className="text-sm font-medium text-ink">Editar dados pessoais</span>
        <span className="text-ink-soft">›</span>
      </Card>

      <Card className="flex items-center justify-between opacity-50">
        <span className="text-sm font-medium text-ink">Trocar senha</span>
        <span className="text-ink-soft">›</span>
      </Card>

      <Card className="flex items-center justify-between opacity-50">
        <span className="text-sm font-medium text-ink">Convidar colegas de equipe</span>
        <Badge label="EM BREVE" tone="neutral" />
      </Card>

      <div className="flex-1" />
      <Button variant="danger" onClick={handleSignOut}>
        Sair da conta
      </Button>

      <BottomNav active="perfil" onChange={(key) => {
        if (key === "inicio") navigate("/");
        if (key === "historico") navigate("/historico");
        if (key === "registrar") navigate("/registrar");
        if (key === "perfil") navigate("/configuracoes");
      }} />
    </div>
  );
}
