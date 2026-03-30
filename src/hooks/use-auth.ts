// hooks/useAuth.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

type User = {
  id: string;
  email?: string;
  name?: string;
  role?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // 🔍 Fetch current user
  const fetchUser = useCallback(async () => {
    if (initialized) return;
    // if (!user) return;
    console.log("before fetching user");
    try {
      setLoading(true);
      const res = await api.profile(); // 👈 you need this endpoint
      setUser(res.user);
      console.log("after fetching user");
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [initialized]);

  // 🚀 Login
  const login = async (email: string, password: string) => {
    await api.login(email, password);

    // await fetchUser(); // refresh state
    // await new Promise((res) => setTimeout(res, 0));
    const res = await api.profile(); // ✅ get the user
    setUser(res.user);
  };

  const signup = async (formData: FormData) => {
    await api.signup(formData);

    // await fetchUser(); // refresh state
    // await new Promise((res) => setTimeout(res, 0));
    const res = await api.profile(); // ✅ get the user
    setUser(res.user);
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
    signup,
    logout,
    refresh: fetchUser,
  };
};
