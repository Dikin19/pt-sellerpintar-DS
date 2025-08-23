import React from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps {
    label: string;
    error?: FieldError;
    children: React.ReactNode;
    required?: boolean;
    description?: string;
}

export function FormField({
    label,
    error,
    children,
    required = false,
    description
}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {description && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {children}

            {error && (
                <p className="text-sm text-red-600 flex items-center gap-1" role="alert">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {error.message}
                </p>
            )}
        </div>
    );
}

interface FormErrorProps {
    message: string;
    onClose?: () => void;
}

export function FormError({ message, onClose }: FormErrorProps) {
    return (
        <div className="flex items-center justify-between p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <span>{message}</span>
            </div>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="text-red-400 hover:text-red-600"
                    aria-label="Close error message"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            )}
        </div>
    );
}

interface FormSuccessProps {
    message: string;
    onClose?: () => void;
}

export function FormSuccess({ message, onClose }: FormSuccessProps) {
    return (
        <div className="flex items-center justify-between p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                <span>{message}</span>
            </div>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="text-green-400 hover:text-green-600"
                    aria-label="Close success message"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            )}
        </div>
    );
}
