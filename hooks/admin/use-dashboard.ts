"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardStats, DashboardCharts, ActivityItem } from "@/types/admin";
import {
  mockDashboardStats,
  mockDashboardCharts,
  mockActivityFeed,
} from "@/lib/mock-data";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      // Will call: GET /admin/dashboard/stats/
      // For now, return mock data
      await new Promise((r) => setTimeout(r, 600));
      return mockDashboardStats;
    },
  });
}

export function useDashboardCharts() {
  return useQuery<DashboardCharts>({
    queryKey: ["admin", "dashboard", "charts"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 800));
      return mockDashboardCharts;
    },
  });
}

export function useActivityFeed() {
  return useQuery<ActivityItem[]>({
    queryKey: ["admin", "activity"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return mockActivityFeed;
    },
    refetchInterval: 30000,
  });
}
