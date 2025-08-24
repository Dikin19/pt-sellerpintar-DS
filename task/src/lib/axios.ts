import axios from "axios";

const api = axios.create({
  baseURL: "https://test-fe.mysellerpintar.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 (Unauthorized) response, it likely means the token is invalid/expired
    if (error.response?.status === 401) {
      // Clear the invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        document.cookie =
          "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        // Only redirect to login if we're not already on the login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
