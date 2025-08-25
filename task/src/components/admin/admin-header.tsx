import type React from "react"
interface AdminHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function AdminHeader({ title, description, children }: AdminHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 lg:py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 truncate">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
