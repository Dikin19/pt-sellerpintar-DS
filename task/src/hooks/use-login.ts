import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api";
import { type LoginFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/auth-context";

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

      // Handle successful login
      if (response.success && response.token && response.user) {
        // Use auth context to set authentication state
        contextLogin(response.token, response.user);

        // Show success message (you can add a toast library later)
        console.log("Login successful!");

        // Redirect to dashboard or home page
        router.push("/dashboard");
      } else {
        setError(response.message || "Login failed");
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
