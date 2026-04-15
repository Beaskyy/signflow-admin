"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type {
  LibraryVideo,
  LibraryVideoDetail,
  LibraryVideoFilters,
  PaginatedResponse,
  APIResponse,
} from "@/types/admin";

export function useLibraryVideos(filters: LibraryVideoFilters = {}) {
  return useQuery<PaginatedResponse<LibraryVideo>>({
    queryKey: ["admin", "videos", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (filters.page) searchParams.append("page", filters.page.toString());
      if (filters.page_size)
        searchParams.append("page_size", filters.page_size.toString());
      if (filters.search) searchParams.append("search", filters.search);
      if (filters.is_processed !== undefined)
        searchParams.append("is_processed", filters.is_processed.toString());
      if (filters.region) searchParams.append("region", filters.region);

      const queryString = searchParams.toString();
      const endpoint = `/translations/admin/library-videos/${queryString ? `?${queryString}` : ""}`;

      const response =
        await apiClient<APIResponse<PaginatedResponse<LibraryVideo>>>(endpoint);
      return response.data;
    },
  });
}

export function useLibraryVideo(id: string) {
  return useQuery<LibraryVideoDetail>({
    queryKey: ["admin", "videos", id],
    queryFn: async () => {
      const response = await apiClient<APIResponse<LibraryVideoDetail>>(
        `/translations/admin/library-videos/${id}/`,
      );
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUploadVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient<APIResponse<{ video_id: string }>>(
        "/translations/admin/upload-sign-video/",
        {
          method: "POST",
          body: formData,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "videos"] });
    },
  });
}

export function useUpdateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await apiClient<APIResponse<LibraryVideoDetail>>(
        `/translations/admin/library-videos/${id}/`,
        {
          method: "PATCH",
          body: formData,
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin", "videos"] });
      qc.invalidateQueries({ queryKey: ["admin", "videos", data.id] });
    },
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient<APIResponse<{}>>(
        `/translations/admin/library-videos/${id}/`,
        {
          method: "DELETE",
        },
      );
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "videos"] });
    },
  });
}
