"use client";

import { useState } from "react";
import { useSystemSettings, useUpdateSettings, useAuditLog } from "@/hooks/admin/use-settings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Settings, Globe, Shield, Bell, ScrollText, Save, Server, Gauge,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatDate(d: string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

const actionColors: Record<string, string> = {
  "user.suspend": "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "user.delete": "text-red-400 bg-red-500/10 border-red-500/20",
  "user.role_change": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "settings.update": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "moderation.approve": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

export default function SettingsPage() {
  const [tab, setTab] = useState("general");
  const { data: settings, isLoading } = useSystemSettings();
  const { data: auditData, isLoading: auditLoading } = useAuditLog();
  const updateSettings = useUpdateSettings();

  const [form, setForm] = useState({
    app_name: "",
    maintenance_mode: false,
    default_language: "ASL",
    api_url: "",
    websocket_url: "",
    rate_limit_per_user: 100,
    rate_limit_window_minutes: 60,
    blocked_words_text: "",
  });
  const [initialized, setInitialized] = useState(false);

  if (settings && !initialized) {
    setForm({
      app_name: settings.app_name,
      maintenance_mode: settings.maintenance_mode,
      default_language: settings.default_language,
      api_url: settings.api_url,
      websocket_url: settings.websocket_url,
      rate_limit_per_user: settings.rate_limit_per_user,
      rate_limit_window_minutes: settings.rate_limit_window_minutes,
      blocked_words_text: settings.blocked_words.join(", "),
    });
    setInitialized(true);
  }

  const handleSave = () => {
    updateSettings.mutate(
      { app_name: form.app_name, maintenance_mode: form.maintenance_mode, default_language: form.default_language },
      { onSuccess: () => toast.success("Settings saved", { description: "Changes applied" }) }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/40">Configure platform settings and view audit log</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="overflow-x-auto pb-2 no-scrollbar">
          <TabsList className="h-auto flex-nowrap border border-white/[0.06] !bg-[#06060a] p-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-white/40 border-none">
              <Globe className="mr-2 h-4 w-4" />General
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-white/40 border-none">
              <Server className="mr-2 h-4 w-4" />API
            </TabsTrigger>
            <TabsTrigger value="limits" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-white/40 border-none">
              <Gauge className="mr-2 h-4 w-4" />Rate Limits
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-white/40 border-none">
              <ScrollText className="mr-2 h-4 w-4" />Audit Log
            </TabsTrigger>
          </TabsList>
        </div>

        {/* General */}
        <TabsContent value="general" className="mt-6">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-6 space-y-6">
            {isLoading ? <Skeleton className="h-64 w-full bg-white/[0.04]" /> : (
              <>
                <div className="space-y-2">
                  <Label className="text-white/60">App Name</Label>
                  <Input value={form.app_name} onChange={(e) => setForm((f) => ({ ...f, app_name: e.target.value }))}
                    className="max-w-md border-white/[0.06] bg-white/[0.03] text-white focus-visible:ring-amber-500/30" />
                </div>
                <Separator className="bg-white/[0.06]" />
                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <Label className="text-white/60">Maintenance Mode</Label>
                    <p className="text-xs text-white/30 mt-0.5">Disable access for non-admin users</p>
                  </div>
                  <Switch checked={form.maintenance_mode} onCheckedChange={(v) => setForm((f) => ({ ...f, maintenance_mode: v }))} />
                </div>
                <Separator className="bg-white/[0.06]" />
                <div className="space-y-2">
                  <Label className="text-white/60">Default Language</Label>
                  <Select value={form.default_language} onValueChange={(v) => setForm((f) => ({ ...f, default_language: v }))}>
                    <SelectTrigger className="max-w-md border-white/[0.06] bg-white/[0.03] text-white/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#1a1a2e]">
                      <SelectItem value="ASL" className="text-white/60">ASL (American)</SelectItem>
                      <SelectItem value="BSL" className="text-white/60">BSL (British)</SelectItem>
                      <SelectItem value="NSL" className="text-white/60">NSL (Nigerian)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator className="bg-white/[0.06]" />
                <div className="space-y-2">
                  <Label className="text-white/60">Blocked Words</Label>
                  <Textarea value={form.blocked_words_text} onChange={(e) => setForm((f) => ({ ...f, blocked_words_text: e.target.value }))}
                    placeholder="Comma-separated words..."
                    className="max-w-md border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/25 focus-visible:ring-amber-500/30" rows={3} />
                  <p className="text-[11px] text-white/25">Separate words with commas</p>
                </div>
                <Button onClick={handleSave} className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                  <Save className="mr-2 h-4 w-4" />Save Changes
                </Button>
              </>
            )}
          </div>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="mt-6">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-6 space-y-6">
            {isLoading ? <Skeleton className="h-40 w-full bg-white/[0.04]" /> : (
              <>
                <div className="space-y-2">
                  <Label className="text-white/60">API Base URL</Label>
                  <Input value={form.api_url} onChange={(e) => setForm((f) => ({ ...f, api_url: e.target.value }))}
                    className="max-w-lg border-white/[0.06] bg-white/[0.03] text-white focus-visible:ring-amber-500/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">WebSocket URL</Label>
                  <Input value={form.websocket_url} onChange={(e) => setForm((f) => ({ ...f, websocket_url: e.target.value }))}
                    className="max-w-lg border-white/[0.06] bg-white/[0.03] text-white focus-visible:ring-amber-500/30" />
                </div>
                <Button onClick={handleSave} className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                  <Save className="mr-2 h-4 w-4" />Save Changes
                </Button>
              </>
            )}
          </div>
        </TabsContent>

        {/* Rate Limits */}
        <TabsContent value="limits" className="mt-6">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-6 space-y-6">
            {isLoading ? <Skeleton className="h-40 w-full bg-white/[0.04]" /> : (
              <>
                <div className="space-y-2">
                  <Label className="text-white/60">Translations per User</Label>
                  <Input type="number" value={form.rate_limit_per_user}
                    onChange={(e) => setForm((f) => ({ ...f, rate_limit_per_user: +e.target.value }))}
                    className="max-w-xs border-white/[0.06] bg-white/[0.03] text-white focus-visible:ring-amber-500/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Time Window (minutes)</Label>
                  <Input type="number" value={form.rate_limit_window_minutes}
                    onChange={(e) => setForm((f) => ({ ...f, rate_limit_window_minutes: +e.target.value }))}
                    className="max-w-xs border-white/[0.06] bg-white/[0.03] text-white focus-visible:ring-amber-500/30" />
                  <p className="text-[11px] text-white/25">Max {form.rate_limit_per_user} translations per {form.rate_limit_window_minutes} minutes</p>
                </div>
                <Button onClick={handleSave} className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                  <Save className="mr-2 h-4 w-4" />Save Changes
                </Button>
              </>
            )}
          </div>
        </TabsContent>

        {/* Audit Log */}
        <TabsContent value="audit" className="mt-6">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Admin</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Action</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Details</th>
                    <th className="hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30 md:table-cell">Target</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {auditLoading ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5"><Skeleton className="h-4 w-24 bg-white/[0.06]" /></td>
                    ))}</tr>
                  )) : auditData?.results.map((entry) => (
                    <tr key={entry.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm text-white/70">{entry.admin_user.full_name}</p>
                          <p className="text-[11px] text-white/25">{entry.ip_address}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className={cn("text-[11px]", actionColors[entry.action] || "text-white/40 border-white/10")}>
                          {entry.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-white/50 max-w-[200px] truncate">{entry.details}</td>
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <span className="text-xs text-white/30">{entry.target_type}/{entry.target_id}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-white/40">{formatDate(entry.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
