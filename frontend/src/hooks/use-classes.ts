"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { strapiAPI, type ClassOccurrence } from "@/lib/strapi";
import { generateSlug } from "@/lib/utils";

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

// Get single class by slug
export function useClassBySlug(slug: string) {
  return useQuery({
    queryKey: [...classesKeys.details(), "slug", slug],
    queryFn: () => strapiAPI.getClassOccurrenceBySlug(slug),
    enabled: !!slug,
  });
}

// Get single class by ID or slug (auto-detects)
export function useClassByIdOrSlug(idOrSlug: string) {
  // A slug should have at least one hyphen to distinguish from documentId
  const isSlugParam = /^[a-z0-9]+-[a-z0-9-]+$/.test(idOrSlug);

  return useQuery({
    queryKey: isSlugParam ? [...classesKeys.details(), "slug", idOrSlug] : classesKeys.detail(idOrSlug),
    queryFn: async () => {
      try {
        if (isSlugParam) {
          // Since we don't have slug field in Strapi yet, we need to find by matching title
          const classesResponse = await strapiAPI.getClassOccurrences();
          const matchingClass = classesResponse.data.find((classItem: ClassOccurrence) => generateSlug(classItem.title) === idOrSlug);

          if (!matchingClass) {
            throw new Error("Class not found");
          }

          // Return in the same format as individual class fetch
          return { data: matchingClass };
        } else {
          return await strapiAPI.getClassOccurrence(idOrSlug);
        }
      } catch (error) {
        // If slug lookup fails, it might be because slug field doesn't exist in Strapi yet
        if (isSlugParam) {
          console.warn(`Slug lookup failed for "${idOrSlug}". Make sure the slug field exists in your Strapi content type.`);
        }
        throw error;
      }
    },
    enabled: !!idOrSlug,
    retry: (failureCount) => {
      // Don't retry if it's a slug-related 400 error
      if (isSlugParam && failureCount > 0) {
        return false;
      }
      return failureCount < 3;
    },
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
