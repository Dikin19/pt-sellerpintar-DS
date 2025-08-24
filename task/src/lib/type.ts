interface User {
  id: string;
  username: string;
  role: "Admin" | "User";
  email?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: any;
}

// Form types
export interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  thumbnail?: string;
}

export interface CategoryFormData {
  name: string;
}

// Filter types
export interface ArticleFilters {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface CategoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}
