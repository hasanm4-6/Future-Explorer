"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clearLocalAccountData } from "@/lib/account";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

interface ProfileResponse {
  user: User | null;
}

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

/**
 * Auth hook — now backed by React Query.
 *
 * Benefits over the previous useState + useEffect approach:
 * - Global dedup: only 1 `/auth/me` call regardless of how many components use this hook
 * - Built-in caching: no refetch within staleTime
 * - No race conditions between multiple hook instances
 * - Automatic background refresh when window regains focus (disabled by default)
 */
export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user = null,
    isLoading: loading,
  } = useQuery<User | null>({
    queryKey: queryKeys.auth.profile,
    queryFn: async () => {
      try {
        const res = (await api.profile()) as ProfileResponse;
        return res.user ?? null;
      } catch (err) {
        const status = (err as { status?: number })?.status;
        // Explicit auth rejections → user is not logged in, return null
        if (!status || status === 401 || status === 403) return null;
        // Server / network errors (5xx) → re-throw so React Query keeps
        // the previous cached user value instead of clearing the session
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 min — profile rarely changes
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, err) => {
      const status = (err as { status?: number })?.status;
      // Never retry auth errors; retry server/network errors once
      if (status && status < 500) return false;
      return failureCount < 1;
    },
    retryDelay: 2000,
    refetchOnWindowFocus: false,
  });

  const login = useCallback(
    async (email: string, password: string) => {
      await api.login(email, password);
      const res = (await api.profile()) as ProfileResponse;
      const loggedInUser = res.user ?? null;
      queryClient.setQueryData(queryKeys.auth.profile, loggedInUser);
    },
    [queryClient],
  );

  const signup = useCallback(
    async (formData: FormData) => {
      await api.signup(formData);
      const res = (await api.profile()) as ProfileResponse;
      const signedUpUser = res.user ?? null;
      queryClient.setQueryData(queryKeys.auth.profile, signedUpUser);
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await api.logout();
    clearLocalAccountData();
    queryClient.setQueryData(queryKeys.auth.profile, null);
    // Clear all cached data on logout
    queryClient.clear();
  }, [queryClient]);

  const refresh = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
  }, [queryClient]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refresh,
  };
};
