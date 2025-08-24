"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { FileText, FolderOpen, LogOut, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    name: "Category",
    href: "/admin/categories",
    icon: FolderOpen,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const pollinationsUrl = user
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(
      user.username
    )}%20app%20logo?width=200&height=200&nologo=true`
    : null

  return (
    <div className="flex h-screen w-64 flex-col bg-blue-600 text-white">
      {/* Logo & Brand */}
      <div className="flex flex-col items-center gap-2 px-4 py-6 border-b border-blue-500">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
          {pollinationsUrl ? (
            <img
              src={pollinationsUrl}
              alt="App Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500">N/A</span>
          )}
        </div>
        <span className="font-semibold text-center text-sm">
          Seller Pintar Digital Asia
        </span>
        {user && <span className="text-xs text-blue-100">Hi, {user.username}</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href="/admin">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-500 hover:text-white"
          >
            <Home className="mr-3 h-5 w-5" />
            Back to Site
          </Button>
        </Link>

        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:bg-blue-500 hover:text-white",
                  isActive && "bg-blue-700"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-blue-500">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-white hover:bg-blue-500 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
