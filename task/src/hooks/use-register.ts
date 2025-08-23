import { useState } from "react";
import api from "@/lib/axios";

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
      const response = await api.post("/auth/register", data);
      setSuccess(response.data.message || "Registration successful!");
    } catch (err: any) {
      let errorMessage = "Registration failed. Please try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw err; // Re-throw untuk handling di component
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
