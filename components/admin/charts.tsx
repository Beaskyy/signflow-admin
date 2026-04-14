"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#E8C547";
const CHART_COLORS = ["#D4AF37", "#3B82F6", "#8B5CF6", "#10B981", "#F43F5E"];

/**
 * Safely formats a date or time string for chart axis/tooltips.
 * Handles:
 * - "2024-04-06" -> "6/4"
 * - "16:00" -> "16:00"
 */
const formatChartDate = (v: string, full = false) => {
  if (!v) return "";
  // Check if it's an hourly format like "16:00"
  if (v.includes(":")) return v;

  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  
  if (full) return d.toLocaleDateString();
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartCard({ title, subtitle, children, action }: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white/80">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-white/30">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

interface TranslationsChartProps {
  data: { date: string; count: number }[];
}

export function TranslationsChart({ data }: TranslationsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
            <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="date"
          stroke="rgba(255,255,255,0.15)"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          tickFormatter={(v) => formatChartDate(v)}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="rgba(255,255,255,0.15)"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
          }}
          labelFormatter={(v) => formatChartDate(v, true)}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={GOLD}
          strokeWidth={2}
          fill="url(#goldGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface SignupsChartProps {
  data: { date: string; count: number }[];
}

export function SignupsChart({ data }: SignupsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="date"
          stroke="rgba(255,255,255,0.15)"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          tickFormatter={(v) => formatChartDate(v)}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="rgba(255,255,255,0.15)"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
          }}
          labelFormatter={(v) => formatChartDate(v, true)}
        />
        <Bar dataKey="count" fill={GOLD} radius={[4, 4, 0, 0]} opacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface LanguagePieChartProps {
  data: Record<string, number>;
}

export function LanguagePieChart({ data }: LanguagePieChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
          strokeWidth={0}
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
          }}
          formatter={(value) => [`${value}%`, "Share"]}
        />
        {/* Center text */}
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize="22"
          fontWeight="bold"
        >
          3
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="11"
        >
          Languages
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}

interface PerformanceLineChartProps {
  data: { date: string; avg_ms: number; p95_ms: number }[];
}

export function PerformanceLineChart({ data }: PerformanceLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="date"
          stroke="rgba(255,255,255,0.15)"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          tickFormatter={(v) => formatChartDate(v)}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="rgba(255,255,255,0.15)"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}ms`}
        />
        <Tooltip
          contentStyle={{
            background: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
          }}
          formatter={(value, name) => [
            `${value}ms`,
            name === "avg_ms" ? "Average" : "P95",
          ]}
          labelFormatter={(v) => formatChartDate(v, true)}
        />
        <Line
          type="monotone"
          dataKey="avg_ms"
          stroke={GOLD}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="p95_ms"
          stroke="#F43F5E"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ErrorRateChartProps {
  data: { date: string; rate: number }[];
}

export function ErrorRateChart({ data }: ErrorRateChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="date"
          stroke="rgba(255,255,255,0.15)"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          tickFormatter={(v) => formatChartDate(v)}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="rgba(255,255,255,0.15)"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
          }}
          formatter={(value) => [`${Number(value).toFixed(2)}%`, "Error Rate"]}
          labelFormatter={(v) => formatChartDate(v, true)}
        />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="#F43F5E"
          strokeWidth={2}
          fill="url(#errorGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface HeatmapChartProps {
  data: { hour: number; day: number; count: number }[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HeatmapChart({ data }: HeatmapChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Hour labels */}
        <div className="mb-1 flex">
          <div className="w-10" />
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="flex-1 text-center text-[9px] text-white/20"
            >
              {i % 3 === 0 ? `${i}h` : ""}
            </div>
          ))}
        </div>
        {/* Grid */}
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="flex items-center gap-1">
            <div className="w-10 text-right text-[10px] text-white/30">
              {day}
            </div>
            <div className="flex flex-1 gap-[2px]">
              {Array.from({ length: 24 }, (_, hour) => {
                const cell = data.find(
                  (d) => d.day === dayIdx && d.hour === hour
                );
                const intensity = cell ? cell.count / maxCount : 0;
                return (
                  <div
                    key={hour}
                    className="aspect-square flex-1 rounded-[3px] transition-all hover:ring-1 hover:ring-amber-400/30"
                    style={{
                      backgroundColor:
                        intensity > 0
                          ? `rgba(212, 175, 55, ${Math.max(0.08, intensity * 0.9)})`
                          : "rgba(255,255,255,0.02)",
                    }}
                    title={`${day} ${hour}:00 - ${cell?.count || 0} translations`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
