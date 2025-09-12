"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { strapiAPI, type CreateBookingData } from "@/lib/strapi";

// Query key factory
export const bookingsKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingsKeys.all, "list"] as const,
  list: (userId?: string) => [...bookingsKeys.lists(), { userId }] as const,
  details: () => [...bookingsKeys.all, "detail"] as const,
  detail: (id: string) => [...bookingsKeys.details(), id] as const,
};

// Get bookings for a user
export function useBookings(userId?: string) {
  return useQuery({
    queryKey: bookingsKeys.list(userId),
    queryFn: () => strapiAPI.getBookings(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Create booking mutation
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: CreateBookingData) => {
      console.log("📤 Sending booking data to backend:", bookingData);
      // Get JWT token from localStorage for authentication (optional for guest bookings)
      const token = localStorage.getItem("jwt");
      return strapiAPI.createBooking(bookingData, token || undefined);
    },
    onSuccess: () => {
      // Invalidate bookings list
      queryClient.invalidateQueries({ queryKey: bookingsKeys.lists() });
      // Also invalidate classes as booking might affect availability
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}
