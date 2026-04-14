"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, FileVideo, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateVideo } from "@/hooks/admin/use-videos";
import { toast } from "sonner";
import type { LibraryVideo } from "@/types/admin";

export function EditVideoDialog({
  video,
  open,
  onOpenChange,
}: {
  video: LibraryVideo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [gloss, setGloss] = useState(video.gloss);
  const [region, setRegion] = useState(video.region);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(video.video_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateVideo, isPending } = useUpdateVideo();

  useEffect(() => {
    setGloss(video.gloss);
    setRegion(video.region);
    setPreviewUrl(video.video_url);
    setFile(null);
  }, [video]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert("File size exceeds 50MB limit.");
        return;
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(video.video_url);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gloss) return;

    const formData = new FormData();
    formData.append("gloss", gloss.toUpperCase());
    formData.append("region", region);
    if (file) {
      formData.append("video", file);
    }

    updateVideo({ id: video.id, formData }, {
      onSuccess: () => {
        onOpenChange(false);
        toast.success("Video updated successfully!");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update video");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#0a0a0f] border-white/[0.08] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Video: {video.gloss}</DialogTitle>
          <DialogDescription className="text-white/40">
            Update video metadata or upload a replacement file.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-gloss" className="text-white/70">Gloss (Word)</Label>
              <Input
                id="edit-gloss"
                value={gloss}
                onChange={(e) => setGloss(e.target.value)}
                className="bg-white/[0.03] border-white/[0.06] text-white focus-visible:ring-amber-500/50"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-region" className="text-white/70">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-white/[0.03] border-white/[0.06] text-white">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                  <SelectItem value="US">US (ASL)</SelectItem>
                  <SelectItem value="UK">UK (BSL)</SelectItem>
                  <SelectItem value="NG">Nigeria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-white/70">Video File</Label>
                {file && (
                   <span className="text-[10px] text-amber-500 font-medium">New file selected</span>
                )}
              </div>
              
              <div className="relative rounded-xl border border-white/[0.1] bg-black overflow-hidden group">
                <video
                  key={previewUrl}
                  src={previewUrl!}
                  className="aspect-video w-full object-contain"
                  controls
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/10 text-xs gap-2"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Replace
                  </Button>
                  {file && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="h-8 w-8 rounded-full shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {file && (
                  <div className="absolute bottom-0 inset-x-0 bg-amber-500/90 backdrop-blur-sm p-1.5 flex items-center justify-center gap-2">
                    <Info className="h-3.5 w-3.5 text-black" />
                    <span className="text-[10px] text-black font-bold uppercase tracking-wider">Processing will restart after save</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/40 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || (gloss === video.gloss && region === video.region && !file)}
              className="bg-amber-500 text-black hover:bg-amber-600 font-semibold px-8"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
