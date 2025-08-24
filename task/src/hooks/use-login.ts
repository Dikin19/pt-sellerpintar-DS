import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api";
import { type LoginFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/auth-context";
import { getRoleBasedRedirectPath } from "@/lib/role-utils";
import {
  showSuccessToast,
  showErrorToast,
  showPromiseToast,
} from "@/lib/toast-utils";

interface UseLoginReturn {
  loginUser: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login: contextLogin } = useAuth();

  const clearError = () => setError(null);

  const loginUser = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the login API
      const response = await login(data);

      // Debug logging
      console.log("Login API Response:", response);
      console.log("Response structure:", {
        success: response.success,
        token: response.token,
        user: response.user,
        role: response.role,
        keys: Object.keys(response),
      });

      // Check if response might be nested under data property
      const actualResponse = response.data || response;
      console.log("Actual response after checking .data:", actualResponse);

      // Handle the actual response format: {token, role}
      const token = response.token || actualResponse.token;
      const role = response.role || actualResponse.role;

      if (token && role) {
        // Decode user ID from JWT token
        let userId = "user-id";
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.userId || "user-id";
        } catch (e) {
          console.warn("Could not decode JWT token:", e);
        }

        // Create user object from the response
        const user = {
          id: userId,
          username: data.username, // Use the username from login form
          role: role as "Admin" | "User",
          email: "", // This could be decoded from JWT or fetched separately
        };

        console.log("Using token:", !!token, "and user:", user);

        // Use auth context to set authentication state
        contextLogin(token, user);

        // Show success message
        showSuccessToast("Login successful!");

        // Redirect based on user role
        const redirectPath = getRoleBasedRedirectPath(user.role);
        console.log("Redirecting to:", redirectPath);

        // Small delay to ensure auth state is updated
        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      } else {
        console.log("Login failed - missing required fields:", {
          token: !!token,
          role: !!role,
        });
        const errorMessage =
          response.message ||
          actualResponse.message ||
          "Login failed - missing token or role";
        setError(errorMessage);
        showErrorToast(errorMessage);
      }
    } catch (error: any) {
      // Only log relevant details, not the full error stack for known errors
      if (error.status === 401) {
        console.log("Authentication failed: Invalid credentials");
      } else if (error.status >= 500) {
        console.log("Server error during login:", error.status);
      } else if (error.isNetworkError) {
        console.log("Network error during login");
      } else {
        console.error("Unexpected login error:", error);
      }

      // Handle different types of errors with user-friendly messages
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.status === 401) {
        errorMessage = "Invalid username or password";
      } else if (error.status === 422) {
        errorMessage = "Invalid data provided";
      } else if (error.status === 429) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.isNetworkError) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
    error,
    clearError,
  };
}

// Alternative hook for more advanced authentication patterns
export function useAuthLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithCredentials = async (credentials: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      showSuccessToast("Login successful!");
      return data;
    } catch (error: any) {
      const errorMessage = error.message || "Login failed";
      setError(errorMessage);
      showErrorToast(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginWithCredentials,
    isLoading,
    error,
    setError,
  };
}
