import { useCallback, useEffect, useMemo, useState } from "react";

import AuthContext from "./auth-context";
import { apiRequest } from "../lib/api";

const STORAGE_KEY = "moodsense_auth_session";

function getAvatarFromUser(user) {
  const source = user?.name || user?.email || "";
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "MS";
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.user_id,
    name: user.name,
    email: user.email,
    avatar: getAvatarFromUser(user),
    status: "Aktif",
  };
}

function readStoredSession() {
  const sources = [window.localStorage, window.sessionStorage];

  for (const source of sources) {
    const rawSession = source.getItem(STORAGE_KEY);

    if (!rawSession) {
      continue;
    }

    try {
      const parsed = JSON.parse(rawSession);

      if (parsed?.accessToken && parsed?.refreshToken && parsed?.user) {
        return { ...parsed, storage: source === window.localStorage ? "localStorage" : "sessionStorage" };
      }
    } catch {
      source.removeItem(STORAGE_KEY);
    }
  }

  return null;
}

function persistSession(session, rememberMe) {
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const payload = JSON.stringify(session);

  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
  storage.setItem(STORAGE_KEY, payload);
}

function clearSessionStorage() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshSession = useCallback(async (refreshToken, rememberMe) => {
    const response = await apiRequest("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });

    const nextSession = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: normalizeUser(response.data.user),
      rememberMe,
    };

    persistSession(nextSession, rememberMe);
    setSession(nextSession);
    return nextSession;
  }, []);

  const restoreSession = useCallback(async (storedSession) => {
    if (!storedSession?.accessToken || !storedSession?.refreshToken || !storedSession?.user) {
      throw new Error("Invalid stored session");
    }

    try {
      const response = await apiRequest("/auth/me", {
        method: "GET",
        token: storedSession.accessToken,
      });

      const nextSession = {
        ...storedSession,
        user: normalizeUser(response.data),
      };

      persistSession(nextSession, storedSession.rememberMe);
      setSession(nextSession);
      return nextSession;
    } catch {
      return refreshSession(storedSession.refreshToken, storedSession.rememberMe);
    }
  }, [refreshSession]);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const storedSession = readStoredSession();

      if (!storedSession) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        await restoreSession(storedSession);
      } catch {
        clearSessionStorage();

        if (isMounted) {
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [restoreSession]);

  const login = useCallback(async ({ email, password, rememberMe = false }) => {
    setError(null);

    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    const nextSession = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: normalizeUser(response.data.user),
      rememberMe,
    };

    persistSession(nextSession, rememberMe);
    setSession(nextSession);
    return nextSession;
  }, []);

  const register = useCallback(async (payload, rememberMe = true) => {
    setError(null);

    await apiRequest("/auth/register", {
      method: "POST",
      body: payload,
    });

    return login({ email: payload.email, password: payload.password, rememberMe });
  }, [login]);

  const logout = useCallback(async () => {
    const refreshToken = session?.refreshToken;
    const userId = session?.user?.id;

    try {
      if (refreshToken) {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: { refreshToken },
        });
      }
    } finally {
      if (userId) {
        try {
          localStorage.removeItem(`moodsense_dashboard_cache_${userId}`);
        } catch (cacheErr) {
          console.warn("Failed to clear dashboard cache on logout:", cacheErr);
        }
      }
      clearSessionStorage();
      setSession(null);
      setError(null);
    }
  }, [session]);

  const reloadSession = useCallback(async () => {
    if (!session?.accessToken) {
      return null;
    }

    const response = await apiRequest("/auth/me", {
      method: "GET",
      token: session.accessToken,
    });

    const nextSession = {
      ...session,
      user: normalizeUser(response.data),
    };

    persistSession(nextSession, nextSession.rememberMe);
    setSession(nextSession);
    return nextSession;
  }, [session]);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      accessToken: session?.accessToken || null,
      refreshToken: session?.refreshToken || null,
      isAuthenticated: Boolean(session?.accessToken && session?.user),
      isLoading,
      error,
      login,
      register,
      logout,
      reloadSession,
      setError,
    }),
    [error, isLoading, login, logout, reloadSession, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
