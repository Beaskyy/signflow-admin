"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SystemSettings, AuditLogEntry, PaginatedResponse } from "@/types/admin";
import { mockSettings, mockAuditLog } from "@/lib/mock-data";

export function useSystemSettings() {
  return useQuery<SystemSettings>({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return mockSettings;
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<SystemSettings>) => {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true, ...updates };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
}

export function useAuditLog(page = 1) {
  return useQuery<PaginatedResponse<AuditLogEntry>>({
    queryKey: ["admin", "audit-log", page],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return {
        count: mockAuditLog.length,
        next: null,
        previous: null,
        results: mockAuditLog,
      };
    },
  });
}
