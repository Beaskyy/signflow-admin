"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLibraryVideo } from "@/hooks/admin/use-videos";
import { format } from "date-fns";
import { 
  FileVideo, 
  Calendar, 
  User, 
  Globe, 
  Database, 
  Activity, 
  CheckCircle2, 
  Clock,
  ExternalLink
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function VideoDetailDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: video, isLoading } = useLibraryVideo(id || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0a0a0f] border-white/[0.08] text-white p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-8 w-1/3 bg-white/[0.03]" />
            <Skeleton className="h-[300px] w-full bg-white/[0.03]" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full bg-white/[0.03]" />
              <Skeleton className="h-12 w-full bg-white/[0.03]" />
            </div>
          </div>
        ) : video ? (
          <div className="flex flex-col">
            {/* Video Preview Header */}
            <div className="relative aspect-video w-full bg-black border-b border-white/[0.06]">
              <video 
                src={video.video_url} 
                controls 
                className="h-full w-full object-contain"
              />
            </div>

            <ScrollArea className="max-h-[400px]">
              <div className="p-6 space-y-8">
                {/* Title & Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{video.gloss}</h2>
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className="bg-white/[0.03] border-white/[0.1] text-white/60">
                         {video.region}
                       </Badge>
                       {video.is_processed ? (
                         <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 hover:bg-emerald-500/20">
                           <CheckCircle2 className="h-3 w-3" />
                           Processed
                         </Badge>
                       ) : (
                         <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1 hover:bg-amber-500/20">
                           <Clock className="h-3 w-3 animate-pulse" />
                           Processing
                         </Badge>
                       )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/[0.06] bg-white/[0.03] text-white/50 hover:text-white"
                    onClick={() => window.open(video.video_url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Original
                  </Button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-white/40">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Uploader</p>
                        <p className="text-sm text-white/80">{video.added_by_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-white/40">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Created At</p>
                        <p className="text-sm text-white/80">{format(new Date(video.created_at), "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-white/40">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">File Size</p>
                        <p className="text-sm text-white/80">{(video.file_size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-white/40">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Last Updated</p>
                        <p className="text-sm text-white/80">{format(new Date(video.updated_at), "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pose Data Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                    Pose Tracking Data
                  </h3>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    {video.pose_keypoints ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                           <span className="text-xs text-white/40">GZIP Base64 Compressed String</span>
                           <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/30 font-mono">
                             {video.pose_keypoints.length.toLocaleString()} chars
                           </span>
                        </div>
                        <div className="relative group">
                          <pre className="text-[10px] font-mono text-white/20 bg-black/40 p-3 rounded-lg max-h-[100px] overflow-hidden break-all line-clamp-4">
                            {video.pose_keypoints}
                          </pre>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-60 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-white/40 italic">
                          Pose extraction completed on {video.extracted_at ? format(new Date(video.extracted_at), "MMM d, yyyy HH:mm") : "N/A"}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Activity className="h-8 w-8 text-white/10 mb-2" />
                        <p className="text-sm text-white/40">Tracking data is being extracted...</p>
                        <p className="text-[11px] text-white/20 mt-1">This usually takes 10-30 seconds after upload.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="p-8 text-center text-white/30">Failed to load video details.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
