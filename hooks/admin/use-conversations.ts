"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  AdminConversation,
  AdminMessage,
  PaginatedResponse,
  ConversationFilters,
} from "@/types/admin";
import { mockConversations, mockMessages } from "@/lib/mock-data";

export function useAdminConversations(filters: ConversationFilters = {}) {
  return useQuery<PaginatedResponse<AdminConversation>>({
    queryKey: ["admin", "conversations", filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600));
      let filtered = [...mockConversations];

      if (filters.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(s) ||
            c.user.full_name.toLowerCase().includes(s)
        );
      }
      if (filters.status) {
        filtered = filtered.filter((c) => c.status === filters.status);
      }
      if (filters.language) {
        filtered = filtered.filter((c) => c.language === filters.language);
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

export function useConversationMessages(conversationId: string) {
  return useQuery<AdminMessage[]>({
    queryKey: ["admin", "conversations", conversationId, "messages"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return mockMessages;
    },
    enabled: !!conversationId,
  });
}
