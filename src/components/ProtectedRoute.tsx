import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { fetchProfile } from "../lib/times";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const userId = session?.user.id;

  // null = ainda não sabemos
  const [pago, setPago] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPago(null);

    if (!userId) return;

    fetchProfile(userId).then(({ data }) => {
      if (cancelled) return;
      setPago(data?.pago === true);
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading || (userId && pago === null)) {
    return (
      <div className="bg-base min-h-screen flex items-center justify-center text-ink-soft text-sm">
        carregando…
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  if (!pago) return <Navigate to="/pagamento-pendente" replace />;

  return <>{children}</>;
}