/**
 * Utility functions for role-based navigation and redirects
 * Optimized for performance
 */

export type UserRole = "Admin" | "User";

// Cache for redirect paths to avoid recalculation
const redirectPathCache = new Map<UserRole, string>();

/**
 * Get the default redirect path for a specific role (cached)
 */
export function getRoleBasedRedirectPath(role: UserRole): string {
  if (redirectPathCache.has(role)) {
    return redirectPathCache.get(role)!;
  }

  let path: string;
  switch (role) {
    case "Admin":
      path = "/admin"; // Admin goes to admin dashboard
      break;
    case "User":
      path = "/articles"; // User goes to articles listing
      break;
    default:
      path = "/articles"; // Fallback to articles page
  }

  redirectPathCache.set(role, path);
  return path;
}

/**
 * Get the home page path for a specific role
 */
export function getRoleHomePage(role: UserRole): string {
  return getRoleBasedRedirectPath(role);
}

/**
 * Check if a path is accessible for a specific role
 */
export function isPathAccessibleForRole(path: string, role: UserRole): boolean {
  // Admin can access everything
  if (role === "Admin") {
    return true;
  }

  // User restrictions
  if (role === "User") {
    // User cannot access admin routes
    if (path.startsWith("/admin")) {
      return false;
    }

    // User can access these routes
    const allowedPaths = ["/articles", "/permissions"];

    const allowedPatterns = [
      /^\/articles\/[^\/]+$/, // /articles/[id]
    ];

    return (
      allowedPaths.includes(path) ||
      allowedPatterns.some((pattern) => pattern.test(path)) ||
      path === "/"
    );
  }

  return false;
}

/**
 * Get appropriate redirect if current path is not accessible for role
 */
export function getRedirectForInaccessiblePath(
  path: string,
  role: UserRole
): string | null {
  if (isPathAccessibleForRole(path, role)) {
    return null; // No redirect needed
  }

  return getRoleBasedRedirectPath(role);
}

/**
 * Role-based navigation messages
 */
export function getRoleWelcomeMessage(role: UserRole): string {
  switch (role) {
    case "Admin":
      return "Welcome to Admin Dashboard! You have full access to manage all content.";
    case "User":
      return "Welcome! You can browse and read all articles. Some features require admin access.";
    default:
      return "Welcome to the application!";
  }
}

/**
 * Get role-specific menu items
 */
export function getRoleMenuItems(role: UserRole) {
  const commonItems = [
    { label: "Articles", path: "/articles", icon: "📰" },
    { label: "Permissions", path: "/permissions", icon: "🔒" },
  ];

  if (role === "Admin") {
    return [
      { label: "Admin Dashboard", path: "/admin/articles", icon: "⚡" },
      { label: "Manage Categories", path: "/admin/categories", icon: "📁" },
      ...commonItems,
    ];
  }

  return commonItems;
}

/**
 * Get role-specific navigation hints
 */
export function getRoleNavigationHint(role: UserRole): string {
  switch (role) {
    case "Admin":
      return "You can manage all content, create new articles, and configure categories.";
    case "User":
      return "You can browse articles, view details, and search content. Contact admin for edit access.";
    default:
      return "Navigate through the available content.";
  }
}
