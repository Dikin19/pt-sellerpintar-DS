import axios from "axios";

// Create a separate axios instance for server-side API calls
export const createAuthenticatedApi = (token?: string) => {
  const api = axios.create({
    baseURL: "https://test-fe.mysellerpintar.com/api",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return api;
};

// Helper function to extract token from request headers
export const getTokenFromRequest = (request: Request): string | null => {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
};
