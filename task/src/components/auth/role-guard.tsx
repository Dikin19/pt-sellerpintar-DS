"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, usePermission } from "@/contexts/auth-context";
import { Loader2, Shield } from "lucide-react";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: ("Admin" | "User")[];
    fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const { hasRole } = usePermission();
    const router = useRouter();

    useEffect(() => {
        // If not loading and not authenticated, redirect to login
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    const hasPermission = allowedRoles.some(role => hasRole(role));

    if (!hasPermission) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Shield className="h-16 w-16 mx-auto text-red-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">
                        You don't have permission to access this page. Required role: {allowedRoles.join(" or ")}.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Your current role: {user.role}</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

// HOC wrapper for easier use
export function withRoleGuard<P extends object>(
    Component: React.ComponentType<P>,
    allowedRoles: ("Admin" | "User")[],
    fallback?: React.ReactNode
) {
    return function RoleGuardedComponent(props: P) {
        return (
            <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
                <Component {...props} />
            </RoleGuard>
        );
    };
}