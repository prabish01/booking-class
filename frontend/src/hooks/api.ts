import { useQuery } from "@tanstack/react-query";
import { strapiAPI } from "@/lib/strapi";

// Class Occurrences Queries
export const useClassOccurrences = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ["class-occurrences", params],
    queryFn: () => strapiAPI.getClassOccurrences(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useClassOccurrence = (id: string) => {
  return useQuery({
    queryKey: ["class-occurrence", id],
    queryFn: () => strapiAPI.getClassOccurrence(id),
    enabled: !!id,
  });
};

// Videos Queries
export const useVideos = (params?: { featured?: boolean }) => {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => strapiAPI.getVideos(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => strapiAPI.getVideo(id),
    enabled: !!id,
  });
};

// Site Settings Query
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () => strapiAPI.getSiteSettings(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Helper hook for upcoming classes (next 2 weeks)
export const useUpcomingClasses = () => {
  const now = new Date();
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  return useClassOccurrences({
    startDate: now.toISOString(),
    endDate: twoWeeksFromNow.toISOString(),
  });
};
