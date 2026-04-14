"use client";

import { useState } from "react";
import { useAdminConversations, useConversationMessages } from "@/hooks/admin/use-conversations";
import type { ConversationFilters, ConversationStatus } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  archived: "bg-white/5 text-white/40 border-white/10",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
};

const langColors: Record<string, string> = {
  ASL: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  BSL: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  NSL: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationsPage() {
  const [filters, setFilters] = useState<ConversationFilters>({
    page: 1,
    page_size: 10,
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  const { data, isLoading } = useAdminConversations(filters);
  const { data: messages, isLoading: messagesLoading } =
    useConversationMessages(selectedConvId || "");

  const selectedConv = data?.results.find((c) => c.id === selectedConvId);
  const totalPages = Math.ceil((data?.count || 0) / (filters.page_size || 10));

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setTimeout(() => {
      setFilters((f) => ({ ...f, search: value, page: 1 }));
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Conversations
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Monitor all translation conversations across users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Search conversations..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full border-white/[0.06] bg-white/[0.03] pl-10 text-white placeholder:text-white/25 focus-visible:ring-amber-500/30"
          />
        </div>
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <Select
            value={filters.status || "all"}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                status: v === "all" ? undefined : (v as ConversationStatus),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-full border-white/[0.06] bg-white/[0.03] text-white/60 sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1a1a2e]">
              <SelectItem value="all" className="text-white/60">All Status</SelectItem>
              <SelectItem value="active" className="text-white/60">Active</SelectItem>
              <SelectItem value="archived" className="text-white/60">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.language || "all"}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                language: v === "all" ? undefined : v,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-full border-white/[0.06] bg-white/[0.03] text-white/60 sm:w-[130px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1a1a2e]">
              <SelectItem value="all" className="text-white/60">All Languages</SelectItem>
              <SelectItem value="ASL" className="text-white/60">ASL</SelectItem>
              <SelectItem value="BSL" className="text-white/60">BSL</SelectItem>
              <SelectItem value="NSL" className="text-white/60">NSL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0d14]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                  User
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                  Conversation
                </th>
                <th className="hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30 md:table-cell">
                  Language
                </th>
                <th className="hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30 md:table-cell">
                  Messages
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                  Status
                </th>
                <th className="hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30 lg:table-cell">
                  Created
                </th>
                <th className="hidden px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30 lg:table-cell">
                  Duration
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-white/30">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3.5">
                          <Skeleton className="h-4 w-full max-w-[120px] bg-white/[0.06]" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.results.map((conv) => (
                    <tr
                      key={conv.id}
                      className="group cursor-pointer transition-colors hover:bg-white/[0.02]"
                      onClick={() => setSelectedConvId(conv.id)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 text-[10px] font-bold text-amber-400">
                            {conv.user.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/70 group-hover:text-white/90">
                              {conv.user.full_name}
                            </p>
                            <p className="text-[11px] text-white/25">
                              {conv.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-white/60">{conv.title}</p>
                      </td>
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px]",
                            langColors[conv.language]
                          )}
                        >
                          {conv.language}
                        </Badge>
                      </td>
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-white/50">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {conv.message_count}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px] capitalize",
                            statusColors[conv.status]
                          )}
                        >
                          {conv.status}
                        </Badge>
                      </td>
                      <td className="hidden px-4 py-3.5 text-xs text-white/40 lg:table-cell">
                        {formatDate(conv.created_at)}
                      </td>
                      <td className="hidden px-4 py-3.5 lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-white/40">
                          <Clock className="h-3 w-3" />
                          {conv.duration}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-white/20 hover:bg-white/[0.06] hover:text-amber-400"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/30">
            {data ? `${data.count} total conversations` : "Loading..."}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={!data?.previous}
              onClick={() =>
                setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))
              }
              className="h-8 w-8 p-0 text-white/30 hover:bg-white/[0.06]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                className={cn(
                  "h-8 w-8 p-0 text-xs",
                  (filters.page || 1) === i + 1
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-white/30 hover:bg-white/[0.06]"
                )}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              disabled={!data?.next}
              onClick={() =>
                setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))
              }
              className="h-8 w-8 p-0 text-white/30 hover:bg-white/[0.06]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Conversation Detail Dialog */}
      <Dialog
        open={!!selectedConvId}
        onOpenChange={() => setSelectedConvId(null)}
      >
        <DialogContent className="max-w-2xl border-white/[0.06] bg-[#0d0d14] text-white">
          {selectedConv && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-lg">
                      {selectedConv.title}
                    </DialogTitle>
                    <p className="mt-1 text-sm text-white/40">
                      {selectedConv.user.full_name} •{" "}
                      {formatDate(selectedConv.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px]",
                        langColors[selectedConv.language]
                      )}
                    >
                      {selectedConv.language}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] capitalize",
                        statusColors[selectedConv.status]
                      )}
                    >
                      {selectedConv.status}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="mt-4 max-h-[400px]">
                <div className="space-y-3 pr-4">
                  {messagesLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className="h-16 w-full bg-white/[0.04]"
                        />
                      ))
                    : messages?.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "rounded-xl border p-4 transition-colors",
                            msg.status === "error"
                              ? "border-red-500/20 bg-red-500/5"
                              : "border-white/[0.06] bg-white/[0.02]"
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-[10px] uppercase border-white/10 text-white/40"
                                >
                                  {msg.message_type === "text_to_sign"
                                    ? "Text → Sign"
                                    : "Sign → Text"}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] capitalize",
                                    statusColors[msg.status]
                                  )}
                                >
                                  {msg.status === "completed" && (
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                  )}
                                  {msg.status === "error" && (
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                  )}
                                  {msg.status === "processing" && (
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  )}
                                  {msg.status}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-white/70">
                                  <span className="text-white/30">Input: </span>
                                  {msg.input_preview}
                                </p>
                                <p className="text-sm text-white/50">
                                  <span className="text-white/30">Gloss: </span>
                                  <code className="rounded bg-white/[0.04] px-1.5 py-0.5 text-xs text-amber-400/80">
                                    {msg.output_preview}
                                  </code>
                                </p>
                              </div>
                            </div>
                            <span className="shrink-0 text-[11px] text-white/20">
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
