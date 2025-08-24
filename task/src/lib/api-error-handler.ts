import { showErrorToast, showWarningToast, showInfoToast } from "./toast-utils";

// API Error types
export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  data?: any;
}

// Enhanced API error handler
export class ApiErrorHandler {
  static handle(error: any): ApiError {
    console.error("API Error:", error);

    let apiError: ApiError = {
      message: "An unexpected error occurred",
      status: 500,
      statusText: "Internal Server Error",
    };

    if (error.response) {
      // Server responded with error status
      const { status, statusText, data } = error.response;

      apiError = {
        status,
        statusText,
        message: this.getErrorMessage(status, data),
        data,
      };

      // Show appropriate toast based on error type
      this.showErrorToast(apiError);
    } else if (error.request) {
      // Network error - no response received
      apiError = {
        message: "Network error. Please check your connection and try again.",
        status: 0,
        statusText: "Network Error",
      };

      showErrorToast(apiError.message);
    } else {
      // Something else happened
      apiError = {
        message: error.message || "An unexpected error occurred",
        status: 500,
        statusText: "Unknown Error",
      };

      showErrorToast(apiError.message);
    }

    return apiError;
  }

  private static getErrorMessage(status: number, data: any): string {
    // Try to extract message from response data
    let message = data?.message || data?.error || data?.detail;

    if (!message) {
      // Fallback to status-based messages
      switch (status) {
        case 400:
          message = "Invalid request. Please check your input.";
          break;
        case 401:
          message = "Authentication required. Please log in.";
          break;
        case 403:
          message =
            "Access denied. You do not have permission to perform this action.";
          break;
        case 404:
          message = "Resource not found.";
          break;
        case 409:
          message =
            "Conflict. The resource already exists or there's a data conflict.";
          break;
        case 422:
          message = "Validation failed. Please check your input.";
          break;
        case 429:
          message = "Too many requests. Please try again later.";
          break;
        case 500:
          message = "Server error. Please try again later.";
          break;
        case 502:
          message = "Bad gateway. The server is temporarily unavailable.";
          break;
        case 503:
          message = "Service unavailable. Please try again later.";
          break;
        case 504:
          message = "Gateway timeout. The request took too long to process.";
          break;
        default:
          message = `Error ${status}: ${data?.statusText || "Unknown error"}`;
      }
    }

    return message;
  }

  private static showErrorToast(apiError: ApiError) {
    const { status, message } = apiError;

    if (status === 401) {
      showWarningToast("Session expired. Please log in again.");
    } else if (status === 403) {
      showWarningToast("Access denied. Please contact an administrator.");
    } else if (status === 429) {
      showInfoToast("Rate limit reached. Please wait before trying again.");
    } else if (status >= 500) {
      showErrorToast("Server error. Our team has been notified.");
    } else {
      showErrorToast(message);
    }
  }

  // Validation error handler
  static handleValidationErrors(errors: Record<string, any>): void {
    const errorMessages = Object.entries(errors)
      .map(([field, error]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        if (Array.isArray(error)) {
          return `${fieldName}: ${error.join(", ")}`;
        } else if (typeof error === "object" && error.message) {
          return `${fieldName}: ${error.message}`;
        } else if (typeof error === "string") {
          return `${fieldName}: ${error}`;
        }
        return `${fieldName}: Invalid value`;
      })
      .join("\n");

    showErrorToast(`Validation Errors:\n${errorMessages}`, { autoClose: 8000 });
  }

  // Network timeout handler
  static handleTimeout(): void {
    showErrorToast(
      "Request timeout. Please check your connection and try again."
    );
  }

  // Authentication error handler
  static handleAuthError(): void {
    showWarningToast("Authentication failed. Please log in again.");

    // Clear stored auth data
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }

  // Permission error handler
  static handlePermissionError(): void {
    showWarningToast("You do not have permission to perform this action.");
  }

  // Rate limiting handler
  static handleRateLimit(retryAfter?: number): void {
    const message = retryAfter
      ? `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
      : "Rate limit exceeded. Please try again later.";

    showInfoToast(message);
  }
}

// Axios interceptor setup function
export const setupApiErrorInterceptors = (axiosInstance: any) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: any) => {
      // Add auth token if available
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      const apiError = ApiErrorHandler.handle(error);

      // Handle specific error cases
      if (apiError.status === 401) {
        ApiErrorHandler.handleAuthError();
      } else if (apiError.status === 403) {
        ApiErrorHandler.handlePermissionError();
      } else if (apiError.status === 429) {
        const retryAfter = error.response?.headers?.["retry-after"];
        ApiErrorHandler.handleRateLimit(retryAfter);
      }

      return Promise.reject(apiError);
    }
  );
};

// Form submission error handler
export const handleFormSubmissionError = (error: any, formType: string) => {
  const apiError = ApiErrorHandler.handle(error);

  // Additional context for form errors
  let contextMessage = "";
  switch (formType) {
    case "login":
      if (apiError.status === 401) {
        contextMessage = "Please check your username and password.";
      }
      break;
    case "register":
      if (apiError.status === 409) {
        contextMessage =
          "This username is already taken. Please choose another.";
      }
      break;
    case "article":
      if (apiError.status === 422) {
        contextMessage =
          "Please check that all required fields are filled correctly.";
      }
      break;
    case "category":
      if (apiError.status === 409) {
        contextMessage = "A category with this name already exists.";
      }
      break;
  }

  if (contextMessage) {
    showInfoToast(contextMessage);
  }

  return apiError;
};
