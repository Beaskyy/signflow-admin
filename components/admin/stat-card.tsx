"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  loading?: boolean;
  gradient: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  loading,
  gradient,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24 bg-white/[0.06]" />
            <Skeleton className="h-8 w-32 bg-white/[0.06]" />
            <Skeleton className="h-3 w-20 bg-white/[0.06]" />
          </div>
          <Skeleton className="h-11 w-11 rounded-xl bg-white/[0.06]" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-5 transition-all duration-300 hover:border-white/[0.1] hover:shadow-lg hover:shadow-black/20">
      {/* Subtle gradient glow on hover */}
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
          gradient
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[13px] font-medium text-white/40">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change && (
            <p
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                changeType === "positive" && "text-emerald-400",
                changeType === "negative" && "text-red-400",
                changeType === "neutral" && "text-white/40"
              )}
            >
              {changeType === "positive" && "↑"}
              {changeType === "negative" && "↓"}
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            gradient
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
