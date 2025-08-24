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
        <div className={`bg-gradient-to-r ${isAdmin() ? 'from-blue-50 to-indigo-50' : 'from-green-50 to-emerald-50'} border rounded-lg p-6 mb-6 ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${isAdmin() ? 'bg-blue-100' : 'bg-green-100'}`}>
                            {isAdmin() ? (
                                <Star className={`h-5 w-5 ${isAdmin() ? 'text-blue-600' : 'text-green-600'}`} />
                            ) : (
                                <Users className={`h-5 w-5 ${isAdmin() ? 'text-blue-600' : 'text-green-600'}`} />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Welcome back, {user.username}!
                            </h3>
                            <Badge variant={isAdmin() ? "default" : "secondary"} className="mt-1">
                                {user.role} Access
                            </Badge>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-2">{welcomeMessage}</p>
                    <p className="text-sm text-gray-600">{navigationHint}</p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                    {isAdmin() && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/articles">
                                <Shield className="h-4 w-4 mr-2" />
                                Admin Dashboard
                            </Link>
                        </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/permissions">
                            View Permissions
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Memoized export to prevent unnecessary re-renders
export const RoleWelcomeBanner = memo(RoleWelcomeBannerComponent);
