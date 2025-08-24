import { useState } from "react";
import api from "@/lib/axios";
import {
  showSuccessToast,
  showErrorToast,
  showPromiseToast,
} from "@/lib/toast-utils";

export interface RegisterData {
  username: string;
  password: string;
  role: "Admin" | "User";
}

export interface UseRegisterReturn {
  register: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  reset: () => void;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use promise toast for better UX
      const response = await showPromiseToast(
        api.post("/auth/register", data),
        {
          pending: "Creating your account...",
          success: "Registration successful!",
          error: "Registration failed",
        }
      );

      const successMessage =
        response.data.message || "Registration successful!";
      setSuccess(successMessage);

      // Also show a separate success toast for better visibility
      showSuccessToast(`Welcome! ${successMessage}`);
    } catch (err: any) {
      // Log minimal info for debugging without cluttering console
      if (err.response?.status === 409) {
        console.log("Registration failed: Username already exists");
      } else if (err.response?.status === 422) {
        console.log("Registration failed: Invalid data");
      } else if (err.response?.status >= 500) {
        console.log("Registration failed: Server error", err.response?.status);
      } else {
        console.error("Unexpected registration error:", err);
      }

      let errorMessage = "Registration failed. Please try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Handle specific error cases with user-friendly messages
      if (err.response?.status === 409) {
        errorMessage =
          "Username already exists. Please choose a different username.";
      } else if (err.response?.status === 422) {
        errorMessage = "Invalid data provided. Please check your input.";
      } else if (err.response?.status === 429) {
        errorMessage =
          "Too many registration attempts. Please try again later.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setError(errorMessage);
      showErrorToast(errorMessage);

      // Don't re-throw to prevent additional console errors
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(null);
    setIsLoading(false);
  };

  return {
    register,
    isLoading,
    error,
    success,
    reset,
  };
};
