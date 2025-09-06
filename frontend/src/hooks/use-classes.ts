"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { strapiAPI, type ClassOccurrence } from "@/lib/strapi";

// Query key factory
export const classesKeys = {
  all: ["classes"] as const,
  lists: () => [...classesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...classesKeys.lists(), { filters }] as const,
  details: () => [...classesKeys.all, "detail"] as const,
  detail: (id: string) => [...classesKeys.details(), id] as const,
};

// Get all classes
export function useClasses(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: classesKeys.list(params || {}),
    queryFn: () => strapiAPI.getClassOccurrences(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single class
export function useClass(id: string) {
  return useQuery({
    queryKey: classesKeys.detail(id),
    queryFn: () => strapiAPI.getClassOccurrence(id),
    enabled: !!id,
  });
}

// Create class mutation (if needed for admin)
export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classData: Partial<ClassOccurrence>) => strapiAPI.createClassOccurrence(classData),
    onSuccess: () => {
      // Invalidate and refetch classes list
      queryClient.invalidateQueries({ queryKey: classesKeys.lists() });
    },
  });
}

// Update class mutation
export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClassOccurrence> }) => strapiAPI.updateClassOccurrence(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific class and lists
      queryClient.invalidateQueries({ queryKey: classesKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: classesKeys.lists() });
    },
  });
}

// Delete class mutation
export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => strapiAPI.deleteClassOccurrence(id),
    onSuccess: () => {
      // Invalidate classes list
      queryClient.invalidateQueries({ queryKey: classesKeys.lists() });
    },
  });
}
