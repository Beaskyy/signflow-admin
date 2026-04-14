"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminUser, PaginatedResponse, UserFilters, UserRole, UserStatus } from "@/types/admin";
import { mockUsers } from "@/lib/mock-data";

export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery<PaginatedResponse<AdminUser>>({
    queryKey: ["admin", "users", filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600));
      let filtered = [...mockUsers];

      if (filters.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.full_name.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s)
        );
      }
      if (filters.role) {
        filtered = filtered.filter((u) => u.role === filters.role);
      }
      if (filters.status) {
        filtered = filtered.filter((u) => u.status === filters.status);
      }
      if (filters.sort) {
        const [field, dir] = filters.sort.split(":");
        filtered.sort((a, b) => {
          const aVal = a[field as keyof AdminUser];
          const bVal = b[field as keyof AdminUser];
          if (typeof aVal === "string" && typeof bVal === "string") {
            return dir === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
          }
          return dir === "desc" ? Number(bVal) - Number(aVal) : Number(aVal) - Number(bVal);
        });
      }
      
      const page = filters.page || 1;
      const pageSize = filters.page_size || 10;
      const start = (page - 1) * pageSize;
      const results = filtered.slice(start, start + pageSize);

      return {
        count: filtered.length,
        next: start + pageSize < filtered.length ? "next" : null,
        previous: page > 1 ? "prev" : null,
        results,
      };
    },
  });
}

export function useAdminUser(userId: string) {
  return useQuery<AdminUser>({
    queryKey: ["admin", "users", userId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      const user = mockUsers.find((u) => u.id === userId);
      if (!user) throw new Error("User not found");
      return user;
    },
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: { role?: UserRole; status?: UserStatus };
    }) => {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true, ...updates };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
