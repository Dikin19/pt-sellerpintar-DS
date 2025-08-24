// Debug utilities for authentication
export function debugAuth() {
  if (typeof window === "undefined") {
    console.log("Auth Debug: Running in server environment");
    return;
  }

  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");

  console.log("🔍 Auth Debug Information:");
  console.log("- Token exists:", !!token);
  console.log(
    "- Token preview:",
    token ? `${token.substring(0, 20)}...` : "null"
  );
  console.log("- User data exists:", !!user);

  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log("- User data:", userData);
    } catch (e) {
      console.log("- User data parse error:", e);
    }
  }

  // Check token expiration if token exists
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      const isExpired = payload.exp < currentTime;

      console.log(
        "- Token expiration:",
        new Date(payload.exp * 1000).toLocaleString()
      );
      console.log("- Token expired:", isExpired);
      console.log(
        "- Time until expiry:",
        Math.round((payload.exp - currentTime) / 60),
        "minutes"
      );
    } catch (e) {
      console.log("- Token decode error:", e);
    }
  }

  // Check cookies
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  console.log("- Auth cookie exists:", !!cookies.authToken);
  console.log("- All cookies:", Object.keys(cookies));
}

// Add to global scope for easy debugging
if (typeof window !== "undefined") {
  (window as any).debugAuth = debugAuth;
}
