import api from "./axios";
import { LoginFormData, RegisterFormData } from "./validations";

export async function getArticles() {
  const res = await api.get("/articles");
  return res.data;
}

// Authentication API functions
export async function login(credentials: LoginFormData) {
  const res = await api.post("/auth/login", credentials);
  return res.data;
}

export async function register(userData: RegisterFormData) {
  const res = await api.post("/auth/register", userData);
  return res.data;
}

export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}

// User profile API functions
export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function refreshToken() {
  const res = await api.post("/auth/refresh");
  return res.data;
}
