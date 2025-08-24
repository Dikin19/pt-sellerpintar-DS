# Form Validation with Toastify Integration

## Overview

This project implements comprehensive form validation with user-friendly toast notifications using react-toastify. All forms (login, register, article creation/editing, category management) have enhanced validation with real-time feedback.

## Features

✅ **Client-side validation** with Zod schemas
✅ **Real-time field validation** with debouncing
✅ **Toast notifications** for success/error/warning messages
✅ **Enhanced error handling** with specific error messages
✅ **Password strength validation** for registration
✅ **Content quality suggestions** for articles
✅ **Network error handling** with user-friendly messages
✅ **API error interceptors** for consistent error handling

## Quick Start

### 1. Setup (Already configured)

ToastContainer is already added to the root layout with optimal settings:

```tsx
// src/app/layout.tsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// In JSX:
<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
/>;
```

### 2. Using Validation in Forms

#### Login Form

```tsx
import { ValidationCoordinator } from "@/lib/validation-setup";

const handleLogin = async (data) => {
  const result = await ValidationCoordinator.validateAndSubmitLogin(data, () =>
    loginApi(data)
  );

  if (result.success) {
    // Handle success (redirect, etc.)
  }
};
```

#### Register Form

```tsx
import { ValidationCoordinator } from "@/lib/validation-setup";

const handleRegister = async (data) => {
  const result = await ValidationCoordinator.validateAndSubmitRegister(
    data,
    () => registerApi(data)
  );

  if (result.success) {
    // Handle success
  }
};
```

#### Article Form

```tsx
import { ValidationCoordinator } from "@/lib/validation-setup";

const handleArticleSubmit = async (data, isEdit = false) => {
  const result = await ValidationCoordinator.validateAndSubmitArticle(
    data,
    () => (isEdit ? updateArticle(id, data) : createArticle(data)),
    isEdit
  );

  if (result.success) {
    // Handle success
  }
};
```

#### Category Form

```tsx
import { ValidationCoordinator } from "@/lib/validation-setup";

const handleCategorySubmit = async (data, isEdit = false) => {
  const result = await ValidationCoordinator.validateAndSubmitCategory(
    data,
    () => (isEdit ? updateCategory(id, data) : createCategory(data)),
    isEdit
  );

  if (result.success) {
    // Handle success
  }
};
```

### 3. Real-time Validation

```tsx
import { useRealTimeValidation } from "@/hooks/use-validation";

const MyForm = () => {
  const { validationStates, validateField, isFormValid } =
    useRealTimeValidation(["username", "password"]);

  return (
    <input
      onChange={(e) => validateField("username", e.target.value, "username")}
      className={
        validationStates.username?.isValid === false ? "border-red-500" : ""
      }
    />
  );
};
```

### 4. Manual Toast Usage

```tsx
import { ToastUtils } from "@/lib/validation-setup";

// Success message
ToastUtils.success("Operation completed successfully!");

// Error message
ToastUtils.error("Something went wrong");

// Warning message
ToastUtils.warning("Please check your input");

// Info message
ToastUtils.info("Here's some helpful information");
```

## Validation Rules

### Username

- ✅ Minimum 3 characters
- ✅ Maximum 20 characters
- ✅ Only letters, numbers, and underscores
- ✅ No spaces or special characters

### Password

- ✅ Minimum 6 characters
- ✅ Maximum 100 characters
- ⚠️ Warnings for weak passwords (no uppercase, numbers, special chars)
- ❌ Blocks common passwords

### Article Title

- ✅ Minimum 5 characters
- ✅ Maximum 200 characters
- ✅ Required field

### Article Content

- ✅ Minimum 50 characters
- ✅ Maximum 10,000 characters
- ✅ Required field
- ⚠️ Suggestions for better content (sentence count, word count)

### Category Name

- ✅ Minimum 2 characters
- ✅ Maximum 50 characters
- ✅ Only letters, numbers, spaces, hyphens, underscores
- ✅ Automatic trimming

## Error Handling

### API Errors

- **400**: Invalid request data
- **401**: Authentication required → Auto-redirect to login
- **403**: Access denied
- **404**: Resource not found
- **409**: Conflict (username/category already exists)
- **422**: Validation failed
- **429**: Rate limiting → Show retry time
- **500+**: Server errors → User-friendly messages

### Network Errors

- Connection timeout
- No internet connection
- Server unavailable

### Validation Errors

- Field-level validation with specific messages
- Form-level validation summary
- Real-time feedback as user types

## Toast Types and When to Use

### Success Toast (Green)

- ✅ Login successful
- ✅ Registration completed
- ✅ Article/category created/updated
- ✅ Data saved successfully

### Error Toast (Red)

- ❌ Login failed
- ❌ Network errors
- ❌ Server errors
- ❌ Validation failures

### Warning Toast (Orange)

- ⚠️ Session expired
- ⚠️ Access denied
- ⚠️ Weak password detected
- ⚠️ Data conflicts

### Info Toast (Blue)

- ℹ️ Rate limiting messages
- ℹ️ Helpful tips
- ℹ️ Status updates
- ℹ️ Instructions

## Customization

### Toast Appearance

```tsx
// Modify in src/lib/toast-utils.ts
const defaultOptions = {
  autoClose: 5000, // 5 seconds
  hideProgressBar: false, // Show progress bar
  closeOnClick: true, // Click to dismiss
  pauseOnHover: true, // Pause on hover
  draggable: true, // Allow dragging
};
```

### Validation Messages

```tsx
// Modify in src/lib/form-validation.ts
if (data.username.length < 3) {
  errors.push("Username must be at least 3 characters");
}
```

### Error Handling

```tsx
// Modify in src/lib/api-error-handler.ts
case 401:
  message = 'Authentication required. Please log in.';
  break;
```

## Best Practices

1. **Always validate on both client and server**
2. **Provide specific, actionable error messages**
3. **Use progressive enhancement** (warnings vs errors)
4. **Debounce real-time validation** to avoid performance issues
5. **Clear errors when user starts correcting**
6. **Provide context-specific help**
7. **Handle network issues gracefully**
8. **Keep users informed with loading states**

## Testing Validation

### Test Cases

1. **Valid inputs** → Success toasts
2. **Invalid inputs** → Error toasts with specific messages
3. **Network failures** → Network error handling
4. **Server errors** → User-friendly error messages
5. **Rate limiting** → Appropriate waiting messages
6. **Authentication failures** → Redirect to login

### Example Test Data

```tsx
// Valid login
{ username: "testuser", password: "password123" }

// Invalid login
{ username: "ab", password: "12345" } // Too short

// Valid article
{ title: "Great Article Title", content: "This is a comprehensive article with enough content...", categoryId: "1" }

// Invalid article
{ title: "Hi", content: "Short", categoryId: "" } // All too short/empty
```

## Troubleshooting

### Common Issues

1. **Toasts not showing**

   - Check if ToastContainer is added to layout
   - Verify CSS import: `import 'react-toastify/dist/ReactToastify.css'`

2. **Validation not working**

   - Check Zod schema definitions
   - Verify form field names match schema

3. **Real-time validation too sensitive**

   - Increase debounce delay in useRealTimeValidation

4. **API errors not handled properly**
   - Check axios interceptor setup
   - Verify error response structure

### Debug Mode

```tsx
// Enable console logging for validation
const validationResult = validateLoginForm(data);
console.log("Validation result:", validationResult);
```

## Future Enhancements

- [ ] Email validation for user profiles
- [ ] File upload validation for article images
- [ ] Bulk operations with batch validation
- [ ] Custom validation rules per organization
- [ ] Accessibility improvements for screen readers
- [ ] Multi-language error messages
- [ ] Integration with analytics for error tracking
