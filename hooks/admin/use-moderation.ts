"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ModerationItem, ModerationAction } from "@/types/admin";
import { mockModerationQueue } from "@/lib/mock-data";

export function useModerationQueue() {
  return useQuery<ModerationItem[]>({
    queryKey: ["admin", "moderation", "queue"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return mockModerationQueue;
    },
    refetchInterval: 30000,
  });
}

export function useModerateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      itemId,
      action,
    }: {
      itemId: string;
      action: ModerationAction;
    }) => {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true, action };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "moderation"] });
    },
  });
}
