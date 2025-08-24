// Enhanced form validation setup with toastify integration
// This file provides a complete validation system for all forms in the application

export * from "./form-validation";
export * from "./toast-utils";
export * from "./api-error-handler";
export {
  useRealTimeValidation,
  useFormSubmission,
  useFieldValidation,
} from "../hooks/use-validation";

import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
} from "./toast-utils";
import {
  ApiErrorHandler,
  handleFormSubmissionError,
} from "./api-error-handler";
import {
  validateLoginForm,
  validateRegisterForm,
  validateArticleForm,
  validateCategoryForm,
  displayValidationResults,
  displayFormErrors,
} from "./form-validation";

// Central validation coordinator
export class ValidationCoordinator {
  // Login form validation
  static async validateAndSubmitLogin(
    data: { username: string; password: string },
    submitFunction: () => Promise<any>
  ) {
    // Client-side validation
    const validationResult = validateLoginForm(data);

    if (!validationResult.isValid) {
      displayValidationResults(validationResult);
      return { success: false, error: "Validation failed" };
    }

    // Display warnings if any
    if (validationResult.warnings.length > 0) {
      displayValidationResults(validationResult, true);
    }

    try {
      const result = await submitFunction();
      showSuccessToast("Login successful!");
      return { success: true, data: result };
    } catch (error) {
      handleFormSubmissionError(error, "login");
      return { success: false, error };
    }
  }

  // Register form validation
  static async validateAndSubmitRegister(
    data: { username: string; password: string; role: string },
    submitFunction: () => Promise<any>
  ) {
    // Client-side validation
    const validationResult = validateRegisterForm(data);

    if (!validationResult.isValid) {
      displayValidationResults(validationResult);
      return { success: false, error: "Validation failed" };
    }

    // Display warnings if any
    if (validationResult.warnings.length > 0) {
      displayValidationResults(validationResult, true);
    }

    try {
      const result = await submitFunction();
      showSuccessToast("Registration successful! Welcome aboard!");
      return { success: true, data: result };
    } catch (error) {
      handleFormSubmissionError(error, "register");
      return { success: false, error };
    }
  }

  // Article form validation
  static async validateAndSubmitArticle(
    data: { title: string; content: string; categoryId: string },
    submitFunction: () => Promise<any>,
    isEdit: boolean = false
  ) {
    // Client-side validation
    const validationResult = validateArticleForm(data);

    if (!validationResult.isValid) {
      displayValidationResults(validationResult);
      return { success: false, error: "Validation failed" };
    }

    // Display warnings if any
    if (validationResult.warnings.length > 0) {
      displayValidationResults(validationResult, true);
    }

    try {
      const result = await submitFunction();
      const message = isEdit
        ? "Article updated successfully!"
        : "Article created successfully!";
      showSuccessToast(message);
      return { success: true, data: result };
    } catch (error) {
      handleFormSubmissionError(error, "article");
      return { success: false, error };
    }
  }

  // Category form validation
  static async validateAndSubmitCategory(
    data: { name: string },
    submitFunction: () => Promise<any>,
    isEdit: boolean = false
  ) {
    // Client-side validation
    const validationResult = validateCategoryForm(data);

    if (!validationResult.isValid) {
      displayValidationResults(validationResult);
      return { success: false, error: "Validation failed" };
    }

    // Display warnings if any
    if (validationResult.warnings.length > 0) {
      displayValidationResults(validationResult, true);
    }

    try {
      const result = await submitFunction();
      const message = isEdit
        ? "Category updated successfully!"
        : "Category created successfully!";
      showSuccessToast(message);
      return { success: true, data: result };
    } catch (error) {
      handleFormSubmissionError(error, "category");
      return { success: false, error };
    }
  }

  // Generic form validation
  static async validateAndSubmitGeneric(
    validationFunction: () => {
      isValid: boolean;
      errors: string[];
      warnings: string[];
    },
    submitFunction: () => Promise<any>,
    successMessage: string = "Operation completed successfully",
    formType: string = "generic"
  ) {
    const validationResult = validationFunction();

    if (!validationResult.isValid) {
      displayValidationResults(validationResult);
      return { success: false, error: "Validation failed" };
    }

    if (validationResult.warnings.length > 0) {
      displayValidationResults(validationResult, true);
    }

    try {
      const result = await submitFunction();
      showSuccessToast(successMessage);
      return { success: true, data: result };
    } catch (error) {
      handleFormSubmissionError(error, formType);
      return { success: false, error };
    }
  }
}

// Validation utilities for components
export const ValidationUtils = {
  // Show validation errors for react-hook-form
  showFormErrors: displayFormErrors,

  // Show validation results
  showValidationResults: displayValidationResults,

  // Handle API errors
  handleApiError: ApiErrorHandler.handle,

  // Show success message
  showSuccess: showSuccessToast,

  // Show error message
  showError: showErrorToast,

  // Show warning message
  showWarning: showWarningToast,

  // Show info message
  showInfo: showInfoToast,

  // Validate individual fields
  validateField: (
    fieldName: string,
    value: string,
    type: "username" | "password" | "title" | "content" | "categoryName"
  ) => {
    // You can add field validation logic here
    return { isValid: true, message: "" };
  },
};

// Export commonly used validation functions
export const CommonValidations = {
  login: validateLoginForm,
  register: validateRegisterForm,
  article: validateArticleForm,
  category: validateCategoryForm,
};

// Export toast utilities
export const ToastUtils = {
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
};

export default ValidationCoordinator;
