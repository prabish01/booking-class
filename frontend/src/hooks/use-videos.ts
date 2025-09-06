"use client";

import { useQuery } from "@tanstack/react-query";
import { strapiAPI } from "@/lib/strapi";

// Query key factory
export const videosKeys = {
  all: ["videos"] as const,
  lists: () => [...videosKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...videosKeys.lists(), { filters }] as const,
  details: () => [...videosKeys.all, "detail"] as const,
  detail: (id: string) => [...videosKeys.details(), id] as const,
};

// Get all videos
export function useVideos(params?: { featured?: boolean }) {
  return useQuery({
    queryKey: videosKeys.list(params || {}),
    queryFn: () => strapiAPI.getVideos(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single video
export function useVideo(id: string) {
  return useQuery({
    queryKey: videosKeys.detail(id),
    queryFn: () => strapiAPI.getVideo(id),
    enabled: !!id,
  });
}
