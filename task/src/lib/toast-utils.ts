import { toast } from "react-toastify";

// Toast configuration types
export interface ToastOptions {
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
}

// Default toast options
const defaultOptions: ToastOptions = {
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Success toast utility
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

// Error toast utility
export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

// Warning toast utility
export const showWarningToast = (message: string, options?: ToastOptions) => {
  toast.warn(message, {
    ...defaultOptions,
    ...options,
  });
};

// Info toast utility
export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

// Promise toast utility for async operations
export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    pending: string;
    success: string;
    error?: string;
  },
  options?: ToastOptions
) => {
  return toast.promise(
    promise,
    {
      pending: messages.pending,
      success: messages.success,
      error: messages.error || "Something went wrong!",
    },
    {
      ...defaultOptions,
      ...options,
    }
  );
};

// Validation error toast utility
export const showValidationErrorToast = (errors: Record<string, any>) => {
  const errorMessages = Object.entries(errors)
    .map(([field, error]) => {
      if (error?.message) {
        return `${field}: ${error.message}`;
      }
      return `${field}: Invalid value`;
    })
    .join("\n");

  showErrorToast(`Validation errors:\n${errorMessages}`, {
    autoClose: 7000,
  });
};

// Network error toast utility
export const showNetworkErrorToast = (error: any) => {
  let message = "Network error occurred";

  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        message = "Invalid request data";
        break;
      case 401:
        message = "Authentication required";
        break;
      case 403:
        message = "Access denied";
        break;
      case 404:
        message = "Resource not found";
        break;
      case 409:
        message = "Conflict: Resource already exists";
        break;
      case 422:
        message = "Validation failed";
        break;
      case 429:
        message = "Too many requests. Please try again later";
        break;
      case 500:
        message = "Server error. Please try again later";
        break;
      default:
        message = `Error ${error.response.status}: ${
          error.response.statusText || "Unknown error"
        }`;
    }
  } else if (error?.message) {
    message = error.message;
  }

  showErrorToast(message);
};

// Clear all toasts
export const clearAllToasts = () => {
  toast.dismiss();
};
