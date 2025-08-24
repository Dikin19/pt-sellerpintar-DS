"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { PermissionsDashboard } from "@/components/auth/permissions-dashboard";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function PermissionsPage() {
    const { user, logout } = useAuth();

    return (
        <RoleGuard allowedRoles={["Admin", "User"]}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/articles">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Articles
                                    </Link>
                                </Button>
                                <h1 className="text-lg font-semibold">Permissions & Access</h1>
                            </div>

                            <div className="flex items-center gap-4">
                                {user && (
                                    <>
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="h-4 w-4" />
                                            <span>{user.username}</span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                                {user.role}
                                            </span>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={logout}>
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Access Control Dashboard</h2>
                        <p className="text-lg text-gray-600">
                            Understand your permissions and what actions you can perform in the system.
                        </p>
                    </div>

                    <PermissionsDashboard />
                </main>
            </div>
        </RoleGuard>
    );
}
