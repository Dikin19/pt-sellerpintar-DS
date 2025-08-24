"use client";

import React from "react";
import { LoginForm } from "@/components/auth/login-form";
import { useLogin } from "@/hooks/use-login";

export default function LoginPage() {

    const { loginUser, isLoading, error, clearError } = useLogin();

    React.useEffect(() => {
        return () => clearError();
    }, [clearError]);

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to your account to continue
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <LoginForm
                        onSubmit={loginUser}
                        isLoading={isLoading}
                        error={error}
                        clearError={clearError}
                    />
                </div>
            </div>
        </div>
    );
}
