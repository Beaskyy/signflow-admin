"use client";

import { useState, useRef } from "react";
import { Upload, X, FileVideo, AlertCircle } from "lucide-react";
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
import { useUploadVideo } from "@/hooks/admin/use-videos";
import { toast } from "sonner";

export function UploadVideoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [gloss, setGloss] = useState("");
  const [region, setRegion] = useState("US");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadVideo, isPending } = useUploadVideo();

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
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !gloss) return;

    const formData = new FormData();
    formData.append("video", file);
    formData.append("gloss", gloss.toUpperCase());
    formData.append("region", region);

    uploadVideo(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setGloss("");
        setFile(null);
        setPreviewUrl(null);
        toast.success("Video uploaded and processing started!");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to upload video");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#0a0a0f] border-white/[0.08] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload Sign Video</DialogTitle>
          <DialogDescription className="text-white/40">
            Add a new video to the translation library. Processing will start automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="gloss" className="text-white/70">Gloss (Word)</Label>
              <Input
                id="gloss"
                placeholder="e.g. HELLO"
                value={gloss}
                onChange={(e) => setGloss(e.target.value)}
                className="bg-white/[0.03] border-white/[0.06] text-white focus-visible:ring-amber-500/50"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="region" className="text-white/70">Region</Label>
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
              <Label className="text-white/70">Video File</Label>
              {!file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-amber-500/30 cursor-pointer group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 transition-transform group-hover:scale-110">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/80">Click to upload or drag and drop</p>
                    <p className="text-xs text-white/30 mt-1">MP4, WebM up to 50MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative rounded-xl border border-white/[0.1] bg-black overflow-hidden group">
                  <video
                    src={previewUrl!}
                    className="aspect-video w-full object-contain"
                    controls
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-2 flex items-center gap-2 border-t border-white/10">
                    <FileVideo className="h-4 w-4 text-amber-400" />
                    <span className="text-xs text-white/80 truncate flex-1">{file.name}</span>
                    <span className="text-[10px] text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              )}
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
              disabled={!file || !gloss || isPending}
              className="bg-amber-500 text-black hover:bg-amber-600 font-semibold px-8"
            >
              {isPending ? "Uploading..." : "Upload Video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
