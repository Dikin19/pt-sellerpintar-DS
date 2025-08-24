"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser } from "@/lib/api";

// Import debug utility in development
if (process.env.NODE_ENV === "development") {
    import("@/lib/auth-debug");
}

// Types
interface User {
    id: string;
    username: string;
    role: "Admin" | "User";
    email?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to check if token is expired
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        console.error("Error checking token expiration:", error);
        return true; // Consider token as expired if we can't parse it
    }
};

// Auth Provider Props
interface AuthProviderProps {
    children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is authenticated
    const isAuthenticated = !!user;

    // Initialize auth state
    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const savedUser = localStorage.getItem("user");

            if (token && savedUser) {
                // Check if token is expired
                if (isTokenExpired(token)) {
                    console.log("Token is expired, clearing auth data");
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user");
                    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    setIsLoading(false);
                    return;
                }

                try {
                    // Parse saved user data
                    const userData = JSON.parse(savedUser);

                    // Try to verify token by getting current user data
                    try {
                        const currentUserData = await getCurrentUser();
                        // If successful, use the current user data (in case it was updated)
                        setUser(currentUserData);
                        console.log("Successfully restored auth state with fresh user data");
                    } catch (apiError) {
                        // If API fails but we have valid saved user data and non-expired token, use it
                        // This handles cases where the /auth/me endpoint might be temporarily unavailable
                        console.warn("Failed to fetch current user, using saved user data:", apiError);
                        setUser(userData);
                        console.log("Successfully restored auth state with saved user data");
                    }
                } catch (parseError) {
                    console.error("Failed to parse saved user data:", parseError);
                    // Clear invalid data
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user");
                    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }
        } catch (error) {
            console.error("Auth initialization error:", error);
            // Clear invalid token only if it's an auth-related error
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } finally {
            setIsLoading(false);
        }
    };

    const login = (token: string, userData: User) => {
        console.log("Auth context login called with:", { token: !!token, userData });

        // Store token and user data
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Also set token in cookies for middleware
        document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`; // 7 days

        setUser(userData);
        console.log("User state updated:", userData);
    };

    const logout = () => {
        console.log("Logging out user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        // Clear the cookie as well
        document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        setUser(null);

        // Redirect to login page
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    };

    const refreshUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error("Failed to refresh user data:", error);
            logout(); // Logout if refresh fails
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            // Redirect to login page
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            return null;
        }

        return <Component {...props} />;
    };
}

// Hook for role-based access control
export function usePermission() {
    const { user } = useAuth();

    const hasRole = (role: "Admin" | "User") => {
        return user?.role === role;
    };

    const isAdmin = () => hasRole("Admin");
    const isUser = () => hasRole("User");

    return {
        hasRole,
        isAdmin,
        isUser,
        currentRole: user?.role,
    };
}
