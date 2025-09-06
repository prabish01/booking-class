"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { strapiAPI } from "@/lib/strapi";
import { toast } from "@/lib/toast";

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => strapiAPI.login(credentials),
    onSuccess: (data) => {
      // Store the JWT token and user data
      localStorage.setItem("authToken", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show success toast
      toast.success(`Welcome back, ${data.user.firstName || data.user.username}! 🎉`);

      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => strapiAPI.register(userData),
    onSuccess: (data) => {
      // Store the JWT token and user data
      localStorage.setItem("authToken", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show success toast
      toast.success(`Welcome to Masala Moves, ${data.user.firstName || data.user.username}! 🕺💃`);

      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again or contact support.");
    },
  });
}

// Logout function
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return Promise.resolve();
    },
    onSuccess: () => {
      // Show logout toast
      toast.info("You've been logged out successfully. See you soon! 👋");

      // Clear all cached data
      queryClient.clear();
    },
  });
}
