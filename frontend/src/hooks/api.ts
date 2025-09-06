import { useQuery } from "@tanstack/react-query";

// API client function
const apiClient = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "An error occurred");
  }

  return response.json();
};

// Class Occurrences Queries
export const useClassOccurrences = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ["class-occurrences", params],
    queryFn: () => apiClient("/classes"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useClassOccurrence = (id: string) => {
  return useQuery({
    queryKey: ["class-occurrence", id],
    queryFn: () => apiClient(`/classes/${id}`),
    enabled: !!id,
  });
};

// Videos Queries
export const useVideos = (params?: { featured?: boolean }) => {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => apiClient("/videos"),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => apiClient(`/videos/${id}`),
    enabled: !!id,
  });
};

// Site Settings Query
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () => Promise.resolve({}), // Placeholder for now
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Helper hook for upcoming classes (next 2 weeks)
export const useUpcomingClasses = () => {
  return useQuery({
    queryKey: ["upcoming-classes"],
    queryFn: () => apiClient("/classes"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
