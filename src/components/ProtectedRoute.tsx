import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../lib/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-base min-h-screen flex items-center justify-center text-ink-soft text-sm">
        carregando…
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
