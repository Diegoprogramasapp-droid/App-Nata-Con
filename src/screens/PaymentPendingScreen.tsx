import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useAuth } from "../lib/AuthContext";

const PIX_KEY = "0e3a7d65-4f88-479f-bde8-e7420256565c";

export function PaymentPendingScreen() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  function copyKey() {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-base min-h-screen flex flex-col items-center gap-4 p-4 text-center">
      <div className="font-display font-semibold text-lg text-ink mt-2">Falta pouco! 🏊</div>
      <div className="text-xs text-ink-soft max-w-[280px]">
        Escaneie o QR Code ou copie a chave Pix abaixo para liberar seu acesso.
      </div>

      <Card className="flex flex-col items-center gap-2 py-4">
        <img src="/pix-qrcode.jpeg" alt="QR Code Pix" className="w-48 h-48 rounded-lg" />
        <div className="font-display font-semibold text-ink text-xl">R$ 19,90</div>
        <div className="text-xs text-ink-soft">Diego Farias</div>
      </Card>

      <div className="w-full max-w-xs">
        <div className="text-xs font-semibold text-ink-soft mb-1">ou pague com a chave Pix</div>
        <button
          onClick={copyKey}
          className="w-full rounded-lg border-[1.5px] border-line py-2.5 px-3 text-xs text-ink-soft flex items-center justify-between"
        >
          <span className="truncate">{PIX_KEY}</span>
          <span className="text-ink font-semibold ml-2 flex-shrink-0">
            {copied ? "Copiado!" : "Copiar"}
          </span>
        </button>
      </div>

      <div className="text-xs text-ink-soft mt-2 max-w-xs">
        Pagamento único · acesso vitalício. Após o pagamento, seu acesso será liberado em até 24h.
      </div>

      <div className="flex-1" />
      <Button variant="ghost" onClick={handleSignOut}>
        Sair
      </Button>
    </div>
  );
}