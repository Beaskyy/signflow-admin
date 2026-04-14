"use client";

import { useModerationQueue, useModerateItem } from "@/hooks/admin/use-moderation";
import type { ModerationAction, FlagReason } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Shield, CheckCircle, XCircle, AlertTriangle, Ban,
  Clock, Flag, Bot, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";

const flagCfg: Record<FlagReason, { label: string; icon: typeof Flag; color: string }> = {
  offensive: { label: "Offensive", icon: AlertTriangle, color: "text-red-400 bg-red-500/10 border-red-500/20" },
  spam: { label: "Spam", icon: Ban, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  inappropriate: { label: "Inappropriate", icon: XCircle, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  reported: { label: "User Report", icon: Flag, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  auto_flagged: { label: "Auto-flagged", icon: Bot, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
};

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function ModerationPage() {
  const { data: queue, isLoading } = useModerationQueue();
  const moderate = useModerateItem();
  const [confirm, setConfirm] = useState<{ id: string; action: ModerationAction; name: string } | null>(null);

  const act = (id: string, action: ModerationAction) => {
    moderate.mutate({ itemId: id, action }, {
      onSuccess: () => {
        toast.success(`Action: ${action}`, { description: "Moderation action completed" });
        setConfirm(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Content Moderation</h1>
          <p className="mt-1 text-sm text-white/40">Review and manage flagged translations</p>
        </div>
        <Badge variant="outline" className="w-fit border-amber-500/20 bg-amber-500/10 text-amber-400">
          <Clock className="mr-1.5 h-3 w-3" />
          {queue?.filter((q) => q.status === "pending").length ?? 0} Pending
        </Badge>
      </div>

      <div className="space-y-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl bg-white/[0.04]" />
        )) : !queue?.length ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0d0d14] py-16">
            <Shield className="h-12 w-12 text-emerald-400/30" />
            <h3 className="mt-4 text-lg font-semibold text-white/60">All Clear</h3>
            <p className="mt-1 text-sm text-white/30">No flagged content</p>
          </div>
        ) : queue.map((item) => {
          const fc = flagCfg[item.flag_reason];
          const FI = fc.icon;
          return (
            <div key={item.id} className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-5 transition-all hover:border-white/[0.1]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 text-[10px] font-bold text-amber-400">
                        {item.user.full_name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/70">{item.user.full_name}</p>
                        <p className="text-[11px] text-white/25">{item.user.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[11px]", fc.color)}>
                      <FI className="mr-1 h-3 w-3" />{fc.label}
                    </Badge>
                    <span className="text-[11px] text-white/20">{timeAgo(item.timestamp)}</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
                    <p className="text-sm text-white/60">&ldquo;{item.input_text}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-white/25">
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />Conv: {item.conversation_id}</span>
                    <span>Msg: {item.message_id}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                  <Button size="sm" variant="outline" className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10" onClick={() => act(item.id, "approve")}>
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" />Approve
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10" onClick={() => act(item.id, "remove")}>
                    <XCircle className="mr-1.5 h-3.5 w-3.5" />Remove
                  </Button>
                  <Button size="sm" variant="outline" className="border-orange-500/20 text-orange-400 hover:bg-orange-500/10" onClick={() => setConfirm({ id: item.id, action: "warn", name: item.user.full_name })}>
                    <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />Warn
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={() => setConfirm({ id: item.id, action: "ban", name: item.user.full_name })}>
                    <Ban className="mr-1.5 h-3.5 w-3.5" />Ban
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!confirm} onOpenChange={() => setConfirm(null)}>
        <DialogContent className="max-w-sm border-white/[0.06] bg-[#0d0d14] text-white">
          <DialogHeader>
            <DialogTitle>{confirm?.action === "ban" ? "Ban User" : "Warn User"}</DialogTitle>
            <DialogDescription className="text-white/40">
              {confirm?.action === "ban" ? `Ban ${confirm.name}? They won't be able to access the platform.` : `Send a warning to ${confirm?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirm(null)} className="border-white/10 text-white/60 hover:bg-white/[0.06]">Cancel</Button>
            <Button onClick={() => confirm && act(confirm.id, confirm.action)} className={confirm?.action === "ban" ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"}>
              {confirm?.action === "ban" ? "Ban User" : "Send Warning"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
