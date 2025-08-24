"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { loginFormSchema, type LoginFormData } from "@/lib/validations";
import { validateLoginForm, displayValidationResults, displayFormErrors } from "@/lib/form-validation";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";
import Link from "next/link";

interface LoginFormProps {
    onSubmit?: (data: LoginFormData) => Promise<void> | void;
    isLoading?: boolean;
    error?: string | null;
    clearError?: () => void;
}

export function LoginForm({ onSubmit, isLoading = false, error, clearError }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const handleFormSubmit = async (data: LoginFormData) => {
        try {
            // Client-side validation with enhanced checks
            const validationResult = validateLoginForm(data);

            // Display validation results
            if (!validationResult.isValid) {
                displayValidationResults(validationResult);
                return;
            }

            // Display warnings if any (non-blocking)
            if (validationResult.warnings.length > 0) {
                displayValidationResults(validationResult, true);
            }

            if (onSubmit) {
                await onSubmit(data);
                // Reset form on successful submission
                reset();
                // showSuccessToast("Login form submitted successfully!");
            }
        } catch (error) {
            // console.error("Login failed:", error);
            showErrorToast("Login failed. Please try again.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                    Enter your credentials to access your account
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Username Field */}
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            {...register("username", {
                                onChange: (e) => {
                                    // Clear previous errors when user starts typing
                                    if (errors.username && clearError) {
                                        clearError();
                                    }
                                }
                            })}
                            // aria-invalid={errors.username ? "true" : "false"}
                            // className={errors.username ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-600" role="alert">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...register("password", {
                                    onChange: (e) => {
                                        // Clear previous errors when user starts typing
                                        if (errors.password && clearError) {
                                            clearError();
                                        }
                                    }
                                })}
                                // aria-invalid={errors.password ? "true" : "false"}
                                // className={`pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={togglePasswordVisibility}
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600" role="alert">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || isLoading}
                        onClick={() => {
                            // Display form errors if there are any
                            setTimeout(() => {
                                if (Object.keys(errors).length > 0) {
                                    displayFormErrors(errors);
                                }
                            }, 100);
                        }}
                    >
                        {(isSubmitting || isLoading) ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn className="h-4 w-4 mr-2" />
                                Sign In
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-black-500">
                        Already have an account?{" "}
                        <Link
                            href="/register"
                            className="inline-block px-4 py-2 rounded-md font-medium text-blue-600 
                                        cursor-pointer transition-colors duration-200 
                                        hover:bg-blue-600 hover:text-white"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default LoginForm;
