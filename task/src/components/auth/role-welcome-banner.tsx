"use client";

import { memo } from "react";
import { useAuth, usePermission } from "@/contexts/auth-context";
import { getRoleWelcomeMessage, getRoleNavigationHint } from "@/lib/role-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Star, Users } from "lucide-react";
import Link from "next/link";

interface RoleWelcomeBannerProps {
    className?: string;
}

function RoleWelcomeBannerComponent({ className }: RoleWelcomeBannerProps) {
    const { user } = useAuth();
    const { isAdmin } = usePermission();

    if (!user) return null;

    const welcomeMessage = getRoleWelcomeMessage(user.role);
    const navigationHint = getRoleNavigationHint(user.role);

    return (
        <div className={`bg-gradient-to-r ${isAdmin() ? 'from-blue-50 to-indigo-50' : 'from-green-50 to-emerald-50'} border rounded-lg p-3 sm:p-4 md:p-6 mb-6 ${className}`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${isAdmin() ? 'bg-blue-100' : 'bg-green-100'} self-start sm:self-auto`}>
                            {isAdmin() ? (
                                <Star className={`h-4 w-4 sm:h-5 sm:w-5 ${isAdmin() ? 'text-blue-600' : 'text-green-600'}`} />
                            ) : (
                                <Users className={`h-4 w-4 sm:h-5 sm:w-5 ${isAdmin() ? 'text-blue-600' : 'text-green-600'}`} />
                            )}
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                                Welcome back, {user.username}!
                            </h3>
                            <Badge variant={isAdmin() ? "default" : "secondary"} className="mt-1 text-xs sm:text-sm">
                                {user.role} Access
                            </Badge>
                        </div>
                    </div>

                    <p className="text-sm sm:text-base text-gray-700 mb-2">{welcomeMessage}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{navigationHint}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:ml-4">
                    {isAdmin() && (
                        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                            <Link href="/admin/articles" className="flex items-center justify-center">
                                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                <span className="text-xs sm:text-sm">Admin Dashboard</span>
                            </Link>
                        </Button>
                    )}
                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                        <Link href="/permissions" className="flex items-center justify-center">
                            <span className="text-xs sm:text-sm">View Permissions</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Memoized export to prevent unnecessary re-renders
export const RoleWelcomeBanner = memo(RoleWelcomeBannerComponent);
