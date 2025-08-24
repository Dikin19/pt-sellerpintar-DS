"use client";

import React from "react";
import { AlertTriangle, Shield, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, usePermission } from "@/contexts/auth-context";

interface PermissionsDashboardProps {
    className?: string;
}

export function PermissionsDashboard({ className }: PermissionsDashboardProps) {
    const { user } = useAuth();
    const { isAdmin, isUser } = usePermission();

    if (!user) return null;

    const permissions = {
        admin: [
            "Create new articles",
            "Edit existing articles",
            "Delete articles",
            "Create categories",
            "Edit categories",
            "Delete categories",
            "Access admin dashboard",
            "Manage all content",
            "View all articles and details",
        ],
        user: [
            "View articles list",
            "Read article details",
            "View categories",
            "Search and filter articles",
            "Navigate between pages",
        ],
        restricted: isAdmin() ? [] : [
            "Create new articles",
            "Edit existing articles",
            "Delete articles",
            "Create categories",
            "Edit categories",
            "Delete categories",
            "Access admin dashboard",
        ]
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                            <CardTitle className="text-lg">Your Access Permissions</CardTitle>
                            <CardDescription>
                                Current role: <Badge variant="secondary">{user.role}</Badge>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Allowed Permissions */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <UserCheck className="h-4 w-4 text-green-600" />
                                <h3 className="font-semibold text-green-700">What you can do:</h3>
                            </div>
                            <ul className="space-y-2">
                                {(isAdmin() ? permissions.admin : permissions.user).map((permission, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                                        <span className="text-green-700">{permission}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Restricted Permissions */}
                        {permissions.restricted.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <h3 className="font-semibold text-red-700">Restricted actions:</h3>
                                </div>
                                <ul className="space-y-2">
                                    {permissions.restricted.map((permission, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm">
                                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                                            <span className="text-red-600">{permission}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        <strong>Note:</strong> These actions require Admin role. Contact your administrator for access.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Role Information */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Role Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Admin Role</h4>
                            <p className="text-sm text-blue-700 mb-3">
                                Full access to all application features including content management, user management, and system administration.
                            </p>
                            <div className="flex items-center gap-2">
                                {isAdmin() ? (
                                    <Badge variant="default" className="bg-blue-600">Your current role</Badge>
                                ) : (
                                    <Badge variant="outline">Not assigned</Badge>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">User Role</h4>
                            <p className="text-sm text-green-700 mb-3">
                                Read-only access to articles and categories. Can browse, search, and view content but cannot modify anything.
                            </p>
                            <div className="flex items-center gap-2">
                                {isUser() && !isAdmin() ? (
                                    <Badge variant="default" className="bg-green-600">Your current role</Badge>
                                ) : (
                                    <Badge variant="outline">Not assigned</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
