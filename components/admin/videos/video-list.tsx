"use client";

import { useState } from "react";
import { 
  MoreVertical, 
  Eye, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { LibraryVideo, PaginatedResponse } from "@/types/admin";
import { format } from "date-fns";
import { VideoDetailDialog } from "./video-detail-dialog";
import { useDeleteVideo } from "@/hooks/admin/use-videos";
import { toast } from "sonner";
import { EditVideoDialog } from "./edit-video-dialog";

export function VideoList({ 
  data, 
  isLoading, 
  page, 
  onPageChange 
}: { 
  data?: PaginatedResponse<LibraryVideo>; 
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}) {
  const [editingVideo, setEditingVideo] = useState<LibraryVideo | null>(null);
  const [viewingVideoId, setViewingVideoId] = useState<string | null>(null);
  const { mutate: deleteVideo } = useDeleteVideo();

  const handleDelete = (id: string, gloss: string) => {
    if (confirm(`Are you sure you want to delete video "${gloss}"?`)) {
      deleteVideo(id, {
        onSuccess: () => {
          toast.success(`Video "${gloss}" has been successfully removed.`);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to delete video");
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-white/[0.03]" />
          ))}
        </div>
      </div>
    );
  }

  const results = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 10) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="hover:bg-transparent border-white/[0.06]">
              <TableHead className="text-white/40 font-medium">Video</TableHead>
              <TableHead className="text-white/40 font-medium">Gloss</TableHead>
              <TableHead className="text-white/40 font-medium">Region</TableHead>
              <TableHead className="text-white/40 font-medium">Status</TableHead>
              <TableHead className="text-white/40 font-medium">Added By</TableHead>
              <TableHead className="text-white/40 font-medium">Created At</TableHead>
              <TableHead className="text-right text-white/40 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-white/30">
                  No videos found.
                </TableCell>
              </TableRow>
            ) : (
              results.map((video) => (
                <TableRow key={video.id} className="hover:bg-white/[0.02] border-white/[0.06] transition-colors group">
                  <TableCell>
                    <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-white/[0.06] bg-black">
                      <video 
                        src={video.video_url} 
                        className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        muted
                        onMouseOver={(e) => e.currentTarget.play()}
                        onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-white">{video.gloss}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/[0.1] bg-white/[0.03] text-white/70">
                      {video.region}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {video.is_processed ? (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-medium">Processed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Clock className="h-4 w-4 animate-pulse" />
                        <span className="text-xs font-medium">Processing</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-white/50 text-sm">{video.added_by_email}</TableCell>
                  <TableCell className="text-white/30 text-xs">
                    {format(new Date(video.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white/30 hover:text-white hover:bg-white/[0.06]">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-white/10 text-white">
                        <DropdownMenuItem className="focus:bg-white/[0.06] focus:text-white cursor-pointer" onClick={() => setViewingVideoId(video.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/[0.06] focus:text-white cursor-pointer" onClick={() => setEditingVideo(video)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="focus:bg-red-500/20 focus:text-red-400 text-red-400 cursor-pointer"
                          onClick={() => handleDelete(video.id, video.gloss)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-white/30">
            Showing {results.length} of {data?.count} videos
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="border-white/[0.06] bg-white/[0.03] text-white/70 hover:bg-white/[0.06] disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange(i + 1)}
                  className={`w-8 h-8 p-0 rounded-lg transition-all ${
                    page === i + 1 
                      ? "bg-amber-500 text-black font-bold hover:bg-amber-600" 
                      : "text-white/40 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="border-white/[0.06] bg-white/[0.03] text-white/70 hover:bg-white/[0.06] disabled:opacity-30"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVideo && (
        <EditVideoDialog
          video={editingVideo}
          open={!!editingVideo}
          onOpenChange={(open) => !open && setEditingVideo(null)}
        />
      )}

      {/* Detail Modal */}
      <VideoDetailDialog
        id={viewingVideoId}
        open={!!viewingVideoId}
        onOpenChange={(open) => !open && setViewingVideoId(null)}
      />
    </div>
  );
}
