'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerFormSchema, type RegisterFormData } from '@/lib/validations'
import { useRegister } from '@/hooks/use-register'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from "next/link"
import { Input } from '../ui/input'
import { Label } from '@radix-ui/react-label'

export default function RegisterForm() {

    const { register: registerUser, isLoading, error, success, } = useRegister()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        mode: 'onChange',
        defaultValues: {
            username: '',
            password: '',
            role: 'User'
        }
    })

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser({
                username: data.username,
                password: data.password,
                role: data.role
            })

        } catch (error) {
            // Error sudah di-handle di hook
            console.error('Registration failed:', error)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>Sign up to start managing articles</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="space-y-2">
                        <Label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            {...register("username")}
                            suppressHydrationWarning
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300'
                                }`}
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300'
                                }`}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Role Field */}
                    <div>
                        <Label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Role
                        </Label>
                        <select
                            id="role"
                            {...register('role')}
                            suppressHydrationWarning
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300'
                                }`}
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isLoading || !isValid}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${isLoading || !isValid
                            ? 'bg-white-400 cursor-not-allowed text-black-700'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </span>
                        ) : (
                            'Register'
                        )}
                    </Button>

                    {/* Success/Error Message */}
                    {success && (
                        <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200">
                            <p className="text-sm text-green-800">{success}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-black-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="inline-block px-4 py-2 rounded-md font-medium text-blue-600 
                                        cursor-pointer transition-colors duration-200 
                                        hover:bg-blue-600 hover:text-white"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

            </CardContent>
        </Card>
    )
}