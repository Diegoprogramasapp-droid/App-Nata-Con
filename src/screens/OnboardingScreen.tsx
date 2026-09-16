import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { useAuth } from "../lib/AuthContext";

export function OnboardingScreen() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email || !password) {
      setErrorMsg("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const { error } = mode === "login" ? await signIn(email, password) : await signUp(email, password);

    setLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    navigate("/");
  }

  return (
    <div className="bg-base min-h-screen flex flex-col justify-center gap-3 p-6">
      <div className="flex flex-col items-center gap-1.5 mb-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-crawl to-peito" />
        <div className="font-display font-semibold text-lg text-ink">SplashTime</div>
        <div className="text-xs text-ink-soft text-center">
          registre cada tempo, bata seu recorde
        </div>
      </div>

      <Field
        placeholder="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {errorMsg && <div className="text-xs text-[#C24E4E]">{errorMsg}</div>}

      <Button variant="solid" onClick={handleSubmit} disabled={loading}>
        {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
      </Button>

      <button
        onClick={() => {
          setMode(mode === "login" ? "cadastro" : "login");
          setErrorMsg(null);
        }}
        className="text-xs text-ink-soft text-center"
      >
        {mode === "login" ? (
          <>
            ainda não tem conta? <span className="text-ink font-semibold">criar cadastro</span>
          </>
        ) : (
          <>
            já tem conta? <span className="text-ink font-semibold">entrar</span>
          </>
        )}
      </button>
    </div>
  );
}