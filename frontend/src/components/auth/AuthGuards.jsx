import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../contexts/useAuth";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] text-[#1f3f31] dark:bg-slate-950 dark:text-white">
      <div className="rounded-2xl border border-[#e3e9e5] bg-white px-6 py-4 text-sm font-medium shadow-sm dark:border-slate-700 dark:bg-slate-900">
        Memuat sesi...
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}