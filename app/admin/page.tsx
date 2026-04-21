"use client";

import { StatCard } from "@/components/admin/stat-card";
import {
  ChartCard,
  TranslationsChart,
  SignupsChart,
  LanguagePieChart,
} from "@/components/admin/charts";
import { useDashboardStats, useDashboardCharts, useActivityFeed } from "@/hooks/admin/use-dashboard";
import {
  Users,
  UserCheck,
  MessageSquare,
  Languages,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function formatTimeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: charts, isLoading: chartsLoading } = useDashboardCharts();
  const { data: activity, isLoading: activityLoading } = useActivityFeed();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Overview of the SignFlow platform activity and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Users"
          value={stats?.total_users ?? 0}
          change="+12.5% this month"
          changeType="positive"
          icon={Users}
          loading={statsLoading}
          gradient="bg-amber-500/20"
        />
        <StatCard
          title="Active Users"
          value={stats?.active_users ?? 0}
          change="+8.2% this week"
          changeType="positive"
          icon={UserCheck}
          loading={statsLoading}
          gradient="bg-emerald-500/20"
        />
        <StatCard
          title="Conversations"
          value={stats?.total_conversations ?? 0}
          change="+23.1% this month"
          changeType="positive"
          icon={MessageSquare}
          loading={statsLoading}
          gradient="bg-blue-500/20"
        />
        <StatCard
          title="Translations"
          value={stats?.total_translations ?? 0}
          change="+18.7% this month"
          changeType="positive"
          icon={Languages}
          loading={statsLoading}
          gradient="bg-purple-500/20"
        />
        <StatCard
          title="Success Rate"
          value={stats ? `${stats.success_rate}%` : "0%"}
          change="+0.3% improvement"
          changeType="positive"
          icon={CheckCircle}
          loading={statsLoading}
          gradient="bg-teal-500/20"
        />
        <StatCard
          title="Avg Response"
          value={stats ? `${stats.avg_response_time}s` : "0s"}
          change="-0.2s faster"
          changeType="positive"
          icon={Clock}
          loading={statsLoading}
          gradient="bg-rose-500/20"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard
            title="Translations Per Day"
            subtitle="Last 30 days"
          >
            {chartsLoading ? (
              <Skeleton className="h-[280px] w-full bg-white/[0.04]" />
            ) : (
              <TranslationsChart data={charts?.translations_per_day ?? []} />
            )}
          </ChartCard>
        </div>
        <ChartCard title="Language Distribution" subtitle="Usage share">
          {chartsLoading ? (
            <Skeleton className="h-[280px] w-full bg-white/[0.04]" />
          ) : (
            <>
              <LanguagePieChart data={charts?.language_distribution ?? {}} />
              <div className="mt-4 flex justify-center gap-6">
                {Object.entries(charts?.language_distribution ?? {}).map(
                  ([lang, pct], i) => (
                    <div key={lang} className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: ["#D4AF37", "#3B82F6", "#8B5CF6"][i],
                        }}
                      />
                      <span className="text-xs text-white/50">
                        {lang} ({pct}%)
                      </span>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </ChartCard>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Sign-up Trends" subtitle="New users per day">
            {chartsLoading ? (
              <Skeleton className="h-[280px] w-full bg-white/[0.04]" />
            ) : (
              <SignupsChart data={charts?.signups_per_day ?? []} />
            )}
          </ChartCard>
        </div>

        {/* Activity Feed */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white/80">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-1">
            {activityLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-white/[0.06]" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-full bg-white/[0.06]" />
                      <Skeleton className="h-2.5 w-20 bg-white/[0.06]" />
                    </div>
                  </div>
                ))
              : activity?.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 text-[10px] font-bold text-amber-400">
                      {item.user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-white/60">
                        <span className="font-medium text-white/80">
                          {item.user.full_name}
                        </span>{" "}
                        {item.action}{" "}
                        {item.target && (
                          <span className="text-amber-400/70">
                            {item.target}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/25">
                        {formatTimeAgo(item.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
