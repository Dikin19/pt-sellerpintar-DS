import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api";
import { type LoginFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/auth-context";
import { getRoleBasedRedirectPath } from "@/lib/role-utils";

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
        console.log("Login successful!");

        // Redirect based on user role
        const redirectPath = getRoleBasedRedirectPath(user.role);
        console.log("Redirecting to:", redirectPath);

        // Small delay to ensure auth state is updated
        setTimeout(() => {
          router.push(redirectPath);
        }, 100);
      } else {
        console.log("Login failed - missing required fields:", {
          token: !!token,
          role: !!role,
        });
        setError(
          response.message ||
            actualResponse.message ||
            "Login failed - missing token or role"
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different types of errors
      if (error.response?.status === 401) {
        setError("Invalid username or password");
      } else if (error.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
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
} // Alternative hook for more advanced authentication patterns
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

      return data;
    } catch (error: any) {
      setError(error.message);
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
