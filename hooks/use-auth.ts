"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { setAuthTokens, clearAuthTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { APIResponse } from "@/types/admin";

interface LoginResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: Buffer | string }) => {
      const response = await apiClient<LoginResponse>("/auth/login/", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return response;
    },
    onSuccess: (data) => {
      setAuthTokens(data.tokens.access, data.tokens.refresh);
      toast.success("Login successful! Redirecting...");
      router.push("/admin");
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || "Invalid credentials. Please try again.");
    },
  });
}

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    clearAuthTokens();
    toast.info("Logged out successfully.");
    router.push("/login");
    router.refresh();
  };

  return { logout };
}
