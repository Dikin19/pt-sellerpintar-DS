"use client";

import { memo } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getRoleWelcomeMessage } from "@/lib/role-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Settings, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

interface AdminWelcomeBannerProps {
    className?: string;
}

function AdminWelcomeBannerComponent({ className }: AdminWelcomeBannerProps) {
    const { user } = useAuth();

    if (!user || user.role !== "Admin") return null;

    const welcomeMessage = getRoleWelcomeMessage(user.role);

    return (
        <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 mb-6 ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-white/20">
                            <Crown className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                Welcome to Admin Dashboard, {user.username}!
                            </h2>
                            <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-white/30">
                                Administrator
                            </Badge>
                        </div>
                    </div>

                    <p className="text-blue-100 mb-4">{welcomeMessage}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="h-5 w-5" />
                                <span className="font-semibold">Content Management</span>
                            </div>
                            <p className="text-sm text-blue-100">
                                Create, edit, and manage all articles and categories
                            </p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-5 w-5" />
                                <span className="font-semibold">User Access Control</span>
                            </div>
                            <p className="text-sm text-blue-100">
                                Monitor user activities and manage permissions
                            </p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Settings className="h-5 w-5" />
                                <span className="font-semibold">System Administration</span>
                            </div>
                            <p className="text-sm text-blue-100">
                                Configure application settings and preferences
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/articles">
                            View Public Site
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10" asChild>
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
export const AdminWelcomeBanner = memo(AdminWelcomeBannerComponent);
