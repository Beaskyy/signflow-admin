"use client";

import { useState } from "react";
import { Plus, Search, Filter, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLibraryVideos } from "@/hooks/admin/use-videos";
import { VideoList } from "@/components/admin/videos/video-list";
import { UploadVideoDialog } from "@/components/admin/videos/upload-video-dialog";

export default function VideoLibraryPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filters = {
    search: search || undefined,
    region: region === "all" ? undefined : region,
    is_processed: status === "all" ? undefined : status === "processed",
    page,
    page_size: 10,
  };

  const { data, isLoading, refetch, isFetching } = useLibraryVideos(filters);

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white px-1">Video Library</h1>
          <p className="text-sm text-white/50 px-1">
            Manage the dataset of sign language videos and their tracking data.
          </p>
        </div>
        <Button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-amber-500 text-black hover:bg-amber-600 transition-all font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Search gloss or uploader..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-white/[0.03] border-white/[0.06] text-white focus-visible:ring-amber-500/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={region} onValueChange={(v) => { setRegion(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] bg-white/[0.03] border-white/[0.06] text-white">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="US">US (ASL)</SelectItem>
              <SelectItem value="UK">UK (BSL)</SelectItem>
              <SelectItem value="NG">Nigeria</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[160px] bg-white/[0.03] border-white/[0.06] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-white/[0.06] bg-white/[0.03] text-white hover:bg-white/[0.06]"
          >
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* List */}
      <VideoList 
        data={data} 
        isLoading={isLoading} 
        page={page} 
        onPageChange={setPage} 
      />

      {/* Upload Dialog */}
      <UploadVideoDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen} 
      />
    </div>
  );
}
