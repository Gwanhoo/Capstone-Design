"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthUser, getMe, login, register } from "@/lib/api/authApi";

import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/api/token";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithEmail: (payload: { email: string; password: string }) => Promise<void>;
  signupWithEmail: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const persistAuth = useCallback((nextToken: string, nextUser: AuthUser) => {
    setAccessToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const bootstrap = async () => {
      const savedToken = getAccessToken();

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await getMe(savedToken);
        persistAuth(savedToken, me.user);
      } catch (_error) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [logout, persistAuth]);


  useEffect(() => {
    const onUnauthorized = () => logout();
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, [logout]);
  const loginWithEmail = useCallback(async (payload: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await login(payload);
      persistAuth(data.token, data.user);
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "로그인에 실패했습니다.";
      setError(message);
      throw loginError;
    } finally {
      setIsLoading(false);
    }
  }, [persistAuth]);

  const signupWithEmail = useCallback(async (payload: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await register(payload);
      persistAuth(data.token, data.user);
    } catch (signupError) {
      const message = signupError instanceof Error ? signupError.message : "회원가입에 실패했습니다.";
      setError(message);
      throw signupError;
    } finally {
      setIsLoading(false);
    }
  }, [persistAuth]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    error,
    loginWithEmail,
    signupWithEmail,
    logout,
    clearError,
  }), [clearError, error, isLoading, loginWithEmail, logout, signupWithEmail, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용해야 합니다.");
  }

  return context;
};
