"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser } from "@/lib/api";

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

            if (token) {
                // Verify token and get user data
                const userData = await getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error("Auth initialization error:", error);
            // Clear invalid token
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        } finally {
            setIsLoading(false);
        }
    };

    const login = (token: string, userData: User) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser(null);
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
