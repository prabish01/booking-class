import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

// User hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: { email: string; password: string; firstName: string; lastName: string; phone?: string; address: string; dateOfBirth: string; gender: string; heardAboutUs: string }) => {
      return await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Video hooks
export const useVideos = () => {
  return useQuery({
    queryKey: ["videos"],
    queryFn: () => apiClient("/videos"),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Class Occurrence hooks
export const useClassOccurrences = () => {
  return useQuery({
    queryKey: ["classOccurrences"],
    queryFn: () => apiClient("/classes"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpcomingClasses = () => {
  return useQuery({
    queryKey: ["upcomingClasses"],
    queryFn: () => apiClient("/classes"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Authentication hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    },
  });
};

// Site Settings hooks (placeholder for now)
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: () => Promise.resolve({}), // Placeholder
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
