import { useState, useCallback } from "react";
import { validateFieldRealTime } from "@/lib/form-validation";

export interface ValidationState {
  isValid: boolean;
  message?: string;
  isChecking?: boolean;
}

export interface UseRealTimeValidationReturn {
  validationStates: Record<string, ValidationState>;
  validateField: (
    fieldName: string,
    value: string,
    validationType:
      | "username"
      | "password"
      | "title"
      | "content"
      | "categoryName"
  ) => void;
  clearValidation: (fieldName: string) => void;
  clearAllValidations: () => void;
  isFormValid: boolean;
}

export function useRealTimeValidation(
  requiredFields: string[] = []
): UseRealTimeValidationReturn {
  const [validationStates, setValidationStates] = useState<
    Record<string, ValidationState>
  >({});

  const validateField = useCallback(
    (
      fieldName: string,
      value: string,
      validationType:
        | "username"
        | "password"
        | "title"
        | "content"
        | "categoryName"
    ) => {
      // Set checking state
      setValidationStates((prev) => ({
        ...prev,
        [fieldName]: { isValid: false, isChecking: true },
      }));

      // Debounced validation
      const timeoutId = setTimeout(() => {
        const result = validateFieldRealTime(fieldName, value, validationType);

        setValidationStates((prev) => ({
          ...prev,
          [fieldName]: {
            isValid: result.isValid,
            message: result.message,
            isChecking: false,
          },
        }));
      }, 300); // 300ms debounce

      // Cleanup timeout on next call
      return () => clearTimeout(timeoutId);
    },
    []
  );

  const clearValidation = useCallback((fieldName: string) => {
    setValidationStates((prev) => {
      const newState = { ...prev };
      delete newState[fieldName];
      return newState;
    });
  }, []);

  const clearAllValidations = useCallback(() => {
    setValidationStates({});
  }, []);

  // Check if form is valid (all required fields are valid)
  const isFormValid = requiredFields.every(
    (field) => validationStates[field]?.isValid === true
  );

  return {
    validationStates,
    validateField,
    clearValidation,
    clearAllValidations,
    isFormValid,
  };
}

// Hook for form submission with enhanced validation
export function useFormSubmission<T = any>() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const submitForm = useCallback(
    async (
      submitFunction: () => Promise<T>,
      options?: {
        onSuccess?: (result: T) => void;
        onError?: (error: any) => void;
        successMessage?: string;
        loadingMessage?: string;
      }
    ) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      try {
        const result = await submitFunction();

        const successMsg =
          options?.successMessage || "Operation completed successfully";
        setSubmitSuccess(successMsg);

        if (options?.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "An error occurred";
        setSubmitError(errorMsg);

        if (options?.onError) {
          options.onError(error);
        }

        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setSubmitError(null);
    setSubmitSuccess(null);
  }, []);

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submitForm,
    clearMessages,
  };
}

// Hook for field-level validation with debouncing
export function useFieldValidation(
  initialValue: string = "",
  validationType: "username" | "password" | "title" | "content" | "categoryName"
) {
  const [value, setValue] = useState(initialValue);
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: false,
  });

  const validateValue = useCallback(
    (newValue: string) => {
      setValidationState({ isValid: false, isChecking: true });

      const timeoutId = setTimeout(() => {
        const result = validateFieldRealTime("field", newValue, validationType);
        setValidationState({
          isValid: result.isValid,
          message: result.message,
          isChecking: false,
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [validationType]
  );

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      validateValue(newValue);
    },
    [validateValue]
  );

  const reset = useCallback(() => {
    setValue(initialValue);
    setValidationState({ isValid: false });
  }, [initialValue]);

  return {
    value,
    validationState,
    handleChange,
    reset,
  };
}
