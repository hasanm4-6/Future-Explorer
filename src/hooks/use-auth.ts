"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clearLocalAccountData } from "@/lib/account";
import { api } from "@/lib/api";

type User = {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  country?: string | null;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const fetchUser = useCallback(async ({ force = false } = {}) => {
    if (hasFetchedRef.current && !force) {
      return user;
    }

    hasFetchedRef.current = true;

    try {
      setLoading(true);
      const res = await api.profile();
      setUser(res.user);
      return res.user ?? null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    await api.login(email, password);
    const res = await api.profile();
    setUser(res.user);
    hasFetchedRef.current = true;
  };

  const signup = async (formData: FormData) => {
    await api.signup(formData);
    const res = await api.profile();
    setUser(res.user);
    hasFetchedRef.current = true;
  };

  const logout = async () => {
    await api.logout();
    clearLocalAccountData();
    setUser(null);
    hasFetchedRef.current = true;
  };

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refresh: () => fetchUser({ force: true }),
  };
};
