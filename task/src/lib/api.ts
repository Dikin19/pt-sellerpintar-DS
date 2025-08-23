import api from "./axios";
import { LoginFormData, RegisterFormData } from "./validations";
import { Article, Category, PaginatedResponse } from "@/types";

export async function getArticles() {
  const res = await api.get("/articles");
  return res.data;
}

// Articles API
export async function getArticlesPaginated(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.search) searchParams.append("search", params.search);
  if (params?.categoryId) searchParams.append("categoryId", params.categoryId);
  
  const res = await api.get(`/articles?${searchParams}`);
  return res.data as PaginatedResponse<Article>;
}

export async function getArticleById(id: string) {
  const res = await api.get(`/articles/${id}`);
  return res.data as Article;
}

export async function createArticle(data: {
  title: string;
  content: string;
  categoryId: string;
}) {
  const res = await api.post("/articles", data);
  return res.data as Article;
}

export async function updateArticle(id: string, data: {
  title: string;
  content: string;
  categoryId: string;
}) {
  const res = await api.put(`/articles/${id}`, data);
  return res.data as Article;
}

export async function deleteArticle(id: string) {
  const res = await api.delete(`/articles/${id}`);
  return res.data;
}

// Categories API
export async function getCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.search) searchParams.append("search", params.search);
  
  const res = await api.get(`/categories?${searchParams}`);
  return res.data as PaginatedResponse<Category>;
}

export async function getCategoryById(id: string) {
  const res = await api.get(`/categories/${id}`);
  return res.data as Category;
}

export async function createCategory(data: { name: string }) {
  const res = await api.post("/categories", data);
  return res.data as Category;
}

export async function updateCategory(id: string, data: { name: string }) {
  const res = await api.put(`/categories/${id}`, data);
  return res.data as Category;
}

export async function deleteCategory(id: string) {
  const res = await api.delete(`/categories/${id}`);
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
