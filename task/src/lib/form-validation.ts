import { FieldErrors } from "react-hook-form";
import { showErrorToast} from "./toast-utils";

// Form validation utilities
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Enhanced validation for login form
export const validateLoginForm = (data: {
  username: string;
  password: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Username validation
//   if (!data.username) {
//     errors.push("Username is required");
//   } else if (data.username.length < 3) {
//     errors.push("Username must be at least 3 characters");
//   } else if (data.username.length > 20) {
//     errors.push("Username must be less than 20 characters");
//   } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
//     errors.push("Username can only contain letters, numbers, and underscores");
//   }

  // Password validation
//   if (!data.password) {
//     errors.push("Password is required");
//   } else if (data.password.length < 6) {
//     errors.push("Password must be at least 6 characters");
//   } else if (data.password.length > 100) {
//     errors.push("Password must be less than 100 characters");
//   }

  // Password strength warnings
  if (data.password && data.password.length >= 6) {
    if (!/[A-Z]/.test(data.password)) {
      warnings.push("Consider adding uppercase letters for stronger security");
    }
    if (!/[0-9]/.test(data.password)) {
      warnings.push("Consider adding numbers for stronger security");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
      warnings.push("Consider adding special characters for stronger security");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Enhanced validation for register form
export const validateRegisterForm = (data: {
  username: string;
  password: string;
  role: string;
  confirmPassword?: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Username validation (same as login)
  if (!data.username) {
    errors.push("Username is required");
  } else if (data.username.length < 3) {
    errors.push("Username must be at least 3 characters");
  } else if (data.username.length > 20) {
    errors.push("Username must be less than 20 characters");
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  // Password validation
  if (!data.password) {
    errors.push("Password is required");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  } else if (data.password.length > 100) {
    errors.push("Password must be less than 100 characters");
  }

  // Password confirmation validation
  if (data.confirmPassword !== undefined) {
    if (!data.confirmPassword) {
      errors.push("Password confirmation is required");
    } else if (data.password !== data.confirmPassword) {
      errors.push("Passwords do not match");
    }
  }

  // Role validation
  if (!data.role) {
    errors.push("Role is required");
  } else if (!["Admin", "User"].includes(data.role)) {
    errors.push("Please select a valid role");
  }

  // Password strength validation (more strict for registration)
  if (data.password && data.password.length >= 6) {
    let strengthScore = 0;

    if (/[a-z]/.test(data.password)) strengthScore++;
    if (/[A-Z]/.test(data.password)) strengthScore++;
    if (/[0-9]/.test(data.password)) strengthScore++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) strengthScore++;
    if (data.password.length >= 8) strengthScore++;

    if (strengthScore < 3) {
      warnings.push(
        "Password is weak. Consider using a mix of uppercase, lowercase, numbers, and special characters"
      );
    } else if (strengthScore < 4) {
      warnings.push(
        "Password is moderate. Consider adding more character types for better security"
      );
    }
  }

  // Common password check
  const commonPasswords = [
    "password",
    "123456",
    "password123",
    "admin",
    "user",
    "qwerty",
  ];
  if (data.password && commonPasswords.includes(data.password.toLowerCase())) {
    errors.push(
      "This password is too common. Please choose a more secure password"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Enhanced validation for article form
export const validateArticleForm = (data: {
  title: string;
  content: string;
  categoryId: string;
  excerpt?: string;
  thumbnail?: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!data.title) {
    errors.push("Title is required");
  } else if (data.title.length < 5) {
    errors.push("Title must be at least 5 characters");
  } else if (data.title.length > 200) {
    errors.push("Title must be less than 200 characters");
  }

  // Content validation
  if (!data.content) {
    errors.push("Content is required");
  } else if (data.content.length < 50) {
    errors.push("Content must be at least 50 characters");
  } else if (data.content.length > 10000) {
    errors.push("Content must be less than 10,000 characters");
  }

  // Category validation
  if (!data.categoryId) {
    errors.push("Category is required");
  }

  // Excerpt validation (if provided)
  if (data.excerpt !== undefined && data.excerpt !== "") {
    if (data.excerpt.length < 10) {
      errors.push("Excerpt must be at least 10 characters");
    } else if (data.excerpt.length > 500) {
      errors.push("Excerpt must be less than 500 characters");
    }
  }

  // Thumbnail validation (if provided)
  if (data.thumbnail !== undefined && data.thumbnail !== "") {
    try {
      new URL(data.thumbnail);
    } catch {
      errors.push("Thumbnail must be a valid URL");
    }
  }

  // Content quality warnings
  if (data.content && data.content.length >= 50) {
    const sentences = data.content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    if (sentences.length < 3) {
      warnings.push("Consider adding more sentences for better readability");
    }

    const words = data.content.trim().split(/\s+/);
    if (words.length < 100) {
      warnings.push(
        "Consider expanding your content for better SEO and reader engagement"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Enhanced validation for category form
export const validateCategoryForm = (data: {
  name: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Name validation
  if (!data.name) {
    errors.push("Category name is required");
  } else {
    const trimmedName = data.name.trim();

    if (trimmedName.length < 2) {
      errors.push("Category name must be at least 2 characters");
    } else if (trimmedName.length > 50) {
      errors.push("Category name must be less than 50 characters");
    } else if (!/^[a-zA-Z0-9\s-_]+$/.test(trimmedName)) {
      errors.push(
        "Category name can only contain letters, numbers, spaces, hyphens, and underscores"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Display validation results using toasts
export const displayValidationResults = (
  result: ValidationResult,
) => {
  if (result.errors.length > 0) {
    const errorMessage = result.errors.join("\n");
    showErrorToast(`Validation Error:\n${errorMessage}`, { autoClose: 7000 });
  }

//   if (showWarnings && result.warnings.length > 0) {
//     const warningMessage = result.warnings.join("\n");
//     showWarningToast(`Suggestions:\n${warningMessage}`, { autoClose: 5000 });
//   }
};

// Convert react-hook-form errors to toast messages
export const displayFormErrors = (errors: FieldErrors) => {
  const errorMessages = Object.entries(errors)
    .map(([field, error]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      if (error?.message) {
        return `${error.message}`;
      }
      return `${fieldName}: Invalid value`;
    })
    .join("\n");

  if (errorMessages) {
    showErrorToast(`Attention :\n${errorMessages}`, {
      autoClose: 7000,
    });
  }
};

// Real-time validation function
export const validateFieldRealTime = (
  fieldName: string,
  value: string,
  validationType: "username" | "password" | "title" | "content" | "categoryName"
): { isValid: boolean; message?: string } => {
  switch (validationType) {
    case "username":
      if (!value) return { isValid: false, message: "Username is required" };
      if (value.length < 3)
        return { isValid: false, message: "Too short (min 3 characters)" };
      if (value.length > 20)
        return { isValid: false, message: "Too long (max 20 characters)" };
      if (!/^[a-zA-Z0-9_]+$/.test(value))
        return {
          isValid: false,
          message: "Only letters, numbers, and underscores allowed",
        };
      return { isValid: true };

    case "password":
      if (!value) return { isValid: false, message: "Password is required" };
      if (value.length < 6)
        return { isValid: false, message: "Too short (min 6 characters)" };
      if (value.length > 100)
        return { isValid: false, message: "Too long (max 100 characters)" };
      return { isValid: true };

    case "title":
      if (!value) return { isValid: false, message: "Title is required" };
      if (value.length < 5)
        return { isValid: false, message: "Too short (min 5 characters)" };
      if (value.length > 200)
        return { isValid: false, message: "Too long (max 200 characters)" };
      return { isValid: true };

    case "content":
      if (!value) return { isValid: false, message: "Content is required" };
      if (value.length < 50)
        return { isValid: false, message: "Too short (min 50 characters)" };
      if (value.length > 10000)
        return { isValid: false, message: "Too long (max 10,000 characters)" };
      return { isValid: true };

    case "categoryName":
      if (!value)
        return { isValid: false, message: "Category name is required" };
      const trimmed = value.trim();
      if (trimmed.length < 2)
        return { isValid: false, message: "Too short (min 2 characters)" };
      if (trimmed.length > 50)
        return { isValid: false, message: "Too long (max 50 characters)" };
      if (!/^[a-zA-Z0-9\s-_]+$/.test(trimmed))
        return { isValid: false, message: "Invalid characters" };
      return { isValid: true };

    default:
      return { isValid: true };
  }
};
