"use client";

import { useQuery } from "@tanstack/react-query";
import type { UsageAnalytics, PerformanceAnalytics, RetentionAnalytics } from "@/types/admin";
import {
  mockUsageAnalytics,
  mockPerformanceAnalytics,
  mockRetentionAnalytics,
} from "@/lib/mock-data";

export function useUsageAnalytics(dateRange?: { from: string; to: string }) {
  return useQuery<UsageAnalytics>({
    queryKey: ["admin", "analytics", "usage", dateRange],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 700));
      return mockUsageAnalytics;
    },
  });
}

export function usePerformanceAnalytics(dateRange?: { from: string; to: string }) {
  return useQuery<PerformanceAnalytics>({
    queryKey: ["admin", "analytics", "performance", dateRange],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 700));
      return mockPerformanceAnalytics;
    },
  });
}

export function useRetentionAnalytics() {
  return useQuery<RetentionAnalytics>({
    queryKey: ["admin", "analytics", "retention"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 700));
      return mockRetentionAnalytics;
    },
  });
}
