"use client";

import { useState } from "react";
import {
  useUsageAnalytics,
  usePerformanceAnalytics,
  useRetentionAnalytics,
} from "@/hooks/admin/use-analytics";
import { StatCard } from "@/components/admin/stat-card";
import {
  ChartCard,
  HeatmapChart,
  PerformanceLineChart,
  ErrorRateChart,
  SignupsChart,
} from "@/components/admin/charts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Zap,
  Users,
  TrendingUp,
  Wifi,
  AlertTriangle,
  Clock,
  Download,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [tab, setTab] = useState("usage");
  const { data: usage, isLoading: usageLoading } = useUsageAnalytics();
  const { data: performance, isLoading: perfLoading } =
    usePerformanceAnalytics();
  const { data: retention, isLoading: retentionLoading } =
    useRetentionAnalytics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Deep insights into platform usage and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="overflow-x-auto pb-4 no-scrollbar">
          <TabsList className="h-auto flex-nowrap border border-white/[0.06] !bg-[#0d0d14] p-1">
            <TabsTrigger
              value="usage"
              className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-white/40"
            >
              <Activity className="mr-2 h-4 w-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-white/40"
            >
              <Zap className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="retention"
              className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-white/40"
            >
              <Users className="mr-2 h-4 w-4" />
              Retention
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Usage Tab */}
        <TabsContent value="usage" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Translations"
              value={usage?.total_translations_period ?? 0}
              change="This period"
              changeType="neutral"
              icon={Activity}
              loading={usageLoading}
              gradient="bg-amber-500/20"
            />
            <StatCard
              title="Peak Hour"
              value={
                usage
                  ? `${usage.peak_hours.reduce((a, b) => (a.avg_count > b.avg_count ? a : b)).hour}:00`
                  : "—"
              }
              change="Highest avg traffic"
              changeType="neutral"
              icon={Clock}
              loading={usageLoading}
              gradient="bg-blue-500/20"
            />
            <StatCard
              title="Avg/Hour"
              value={
                usage
                  ? Math.round(
                      usage.peak_hours.reduce((s, h) => s + h.avg_count, 0) / 24
                    )
                  : 0
              }
              change="Translations per hour"
              changeType="neutral"
              icon={TrendingUp}
              loading={usageLoading}
              gradient="bg-purple-500/20"
            />
          </div>

          <ChartCard
            title="Translation Heatmap"
            subtitle="Activity by hour and day of week"
          >
            {usageLoading ? (
              <Skeleton className="h-[200px] w-full bg-white/[0.04]" />
            ) : (
              <HeatmapChart data={usage?.translations_heatmap ?? []} />
            )}
          </ChartCard>

          <ChartCard
            title="Peak Usage Hours"
            subtitle="Average translations per hour"
          >
            {usageLoading ? (
              <Skeleton className="h-[280px] w-full bg-white/[0.04]" />
            ) : (
              <SignupsChart
                data={
                  usage?.peak_hours.map((h) => ({
                    date: `${h.hour}:00`,
                    count: h.avg_count,
                  })) ?? []
                }
              />
            )}
          </ChartCard>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <StatCard
              title="WebSocket Success"
              value={performance ? `${performance.websocket_success_rate}%` : "—"}
              change="Connection rate"
              changeType="positive"
              icon={Wifi}
              loading={perfLoading}
              gradient="bg-emerald-500/20"
            />
            <StatCard
              title="Uptime"
              value={performance ? `${performance.uptime_percentage}%` : "—"}
              change="System availability"
              changeType="positive"
              icon={Zap}
              loading={perfLoading}
              gradient="bg-amber-500/20"
            />
            <StatCard
              title="Avg Response"
              value={
                performance
                  ? `${Math.round(performance.api_response_times.reduce((s, r) => s + r.avg_ms, 0) / performance.api_response_times.length)}ms`
                  : "—"
              }
              change="API latency"
              changeType="neutral"
              icon={Clock}
              loading={perfLoading}
              gradient="bg-blue-500/20"
            />
            <StatCard
              title="Avg Error Rate"
              value={
                performance
                  ? `${(performance.error_rates.reduce((s, r) => s + r.rate, 0) / performance.error_rates.length).toFixed(2)}%`
                  : "—"
              }
              change="Request failures"
              changeType="negative"
              icon={AlertTriangle}
              loading={perfLoading}
              gradient="bg-red-500/20"
            />
          </div>

          <ChartCard
            title="API Response Times"
            subtitle="Average and P95 latency over time"
          >
            {perfLoading ? (
              <Skeleton className="h-[300px] w-full bg-white/[0.04]" />
            ) : (
              <PerformanceLineChart
                data={performance?.api_response_times ?? []}
              />
            )}
            <div className="mt-3 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-5 bg-amber-400" />
                <span className="text-xs text-white/40">Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-5 border-t-2 border-dashed border-red-400" />
                <span className="text-xs text-white/40">P95</span>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Error Rates"
            subtitle="Percentage of failed requests over time"
          >
            {perfLoading ? (
              <Skeleton className="h-[300px] w-full bg-white/[0.04]" />
            ) : (
              <ErrorRateChart data={performance?.error_rates ?? []} />
            )}
          </ChartCard>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <StatCard
              title="DAU"
              value={retention?.dau ?? 0}
              change="Daily active users"
              changeType="neutral"
              icon={Users}
              loading={retentionLoading}
              gradient="bg-amber-500/20"
            />
            <StatCard
              title="WAU"
              value={retention?.wau ?? 0}
              change="Weekly active users"
              changeType="neutral"
              icon={Users}
              loading={retentionLoading}
              gradient="bg-blue-500/20"
            />
            <StatCard
              title="MAU"
              value={retention?.mau ?? 0}
              change="Monthly active users"
              changeType="neutral"
              icon={Users}
              loading={retentionLoading}
              gradient="bg-purple-500/20"
            />
            <StatCard
              title="DAU/MAU Ratio"
              value={retention ? `${retention.dau_mau_ratio}%` : "—"}
              change="Stickiness metric"
              changeType="positive"
              icon={TrendingUp}
              loading={retentionLoading}
              gradient="bg-emerald-500/20"
            />
          </div>

          {/* Cohort Analysis Table */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-5">
            <h3 className="mb-4 text-sm font-semibold text-white/80">
              Cohort Retention Analysis
            </h3>
            {retentionLoading ? (
              <Skeleton className="h-[300px] w-full bg-white/[0.04]" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-white/30">
                        Cohort
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-white/30">
                        Users
                      </th>
                      {Array.from({ length: 8 }, (_, i) => (
                        <th
                          key={i}
                          className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-white/30"
                        >
                          W{i}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {retention?.cohorts.map((cohort) => (
                      <tr key={cohort.cohort_date}>
                        <td className="px-3 py-2.5 text-xs text-white/50">
                          {new Date(cohort.cohort_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-xs font-medium text-white/60">
                          {cohort.total_users}
                        </td>
                        {Array.from({ length: 8 }, (_, i) => {
                          const value = cohort.retention[i];
                          return (
                            <td key={i} className="px-3 py-2.5 text-center">
                              {value !== undefined ? (
                                <span
                                  className="inline-flex h-8 w-12 items-center justify-center rounded-md text-[11px] font-medium"
                                  style={{
                                    backgroundColor: `rgba(212, 175, 55, ${value / 100 * 0.4})`,
                                    color:
                                      value > 50
                                        ? "rgba(255,255,255,0.9)"
                                        : "rgba(255,255,255,0.5)",
                                  }}
                                >
                                  {value.toFixed(0)}%
                                </span>
                              ) : (
                                <span className="text-white/10">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
