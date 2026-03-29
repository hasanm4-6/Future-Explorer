// hooks/useAuth.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

type User = {
  id: string;
  email?: string;
  name?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.profile(); // 👈 you need this endpoint
      setUser(res.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚀 Login
  const login = async (email: string, password: string) => {
    await api.login(email, password);

    await fetchUser(); // refresh state
  };

  // 🚪 Logout
  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refresh: fetchUser,
  };
};
