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
