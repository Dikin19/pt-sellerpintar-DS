export interface User {
  id: string;
  username: string;
  role: "Admin" | "User";
  email?: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}