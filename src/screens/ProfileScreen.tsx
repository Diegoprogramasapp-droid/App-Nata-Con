import { useEffect, useState } from "react";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { Avatar } from "../components/Avatar";
import { useAuth } from "../lib/AuthContext";
import { fetchProfile, upsertProfile } from "../lib/times";

export function ProfileScreen() {
  const { session } = useAuth();
  const [form, setForm] = useState({ full_name: "", age: "", height_cm: "", weight_kg: "", team: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user.id) return;
    fetchProfile(session.user.id).then(({ data }) => {
      if (data) {
        setForm({
          full_name: data.full_name ?? "",
          age: data.age?.toString() ?? "",
          height_cm: data.height_cm?.toString() ?? "",
          weight_kg: data.weight_kg?.toString() ?? "",
          team: data.team ?? "",
        });
      }
      setLoading(false);
    });
  }, [session?.user.id]);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    if (!session?.user.id) return;
    setSaving(true);
    setSavedMsg(null);

    const { error } = await upsertProfile(session.user.id, {
      full_name: form.full_name,
      age: form.age ? Number(form.age) : null,
      height_cm: form.height_cm ? Number(form.height_cm) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      team: form.team,
    });

    setSaving(false);
    setSavedMsg(error ? `Erro: ${error}` : "Perfil salvo!");
  }

  if (loading) {
    return (
      <div className="bg-base min-h-screen flex items-center justify-center text-ink-soft text-sm">
        carregando…
      </div>
    );
  }

  return (
    <div className="bg-base min-h-screen flex flex-col gap-3 p-4">
      <div className="text-xs font-semibold text-ink-soft">meu perfil</div>

      <div className="flex items-center gap-2.5">
        <Avatar />
        <div>
          <div className="font-display font-semibold text-ink">{form.full_name || "Seu nome"}</div>
          <div className="text-xs text-ink-soft">{form.team || "sem equipe"}</div>
        </div>
      </div>

      <Field
        placeholder="Nome completo"
        value={form.full_name}
        onChange={(e) => update("full_name", e.target.value)}
      />
      <div className="flex gap-2">
        <Field
          placeholder="Idade"
          value={form.age}
          onChange={(e) => update("age", e.target.value)}
          className="flex-1"
        />
        <Field
          placeholder="Altura (cm)"
          value={form.height_cm}
          onChange={(e) => update("height_cm", e.target.value)}
          className="flex-1"
        />
      </div>
      <div className="flex gap-2">
        <Field
          placeholder="Peso (kg)"
          value={form.weight_kg}
          onChange={(e) => update("weight_kg", e.target.value)}
          className="flex-1"
        />
        <Field
          placeholder="Equipe"
          value={form.team}
          onChange={(e) => update("team", e.target.value)}
          className="flex-1"
        />
      </div>

      {savedMsg && <div className="text-xs text-ink-soft">{savedMsg}</div>}

      <div className="flex-1" />
      <Button variant="ghost" onClick={handleSave} disabled={saving}>
        {saving ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
}
