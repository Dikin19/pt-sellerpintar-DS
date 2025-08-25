"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { FileText, FolderOpen, LogOut, Home, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Image from "next/image"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const pollinationsUrl = user
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(
      user.username
    )}%20app%20logo?width=200&height=200&nologo=true`
    : null

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Mobile menu toggle button
  const MobileMenuToggle = () => (
    <Button
      variant="ghost"
      size="sm"
      className="lg:hidden fixed top-4 right-4 z-50 bg-blue-600 text-white hover:bg-blue-700"
      onClick={toggleMobileMenu}
    >
      {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  )

  // Mobile overlay
  const MobileOverlay = () => (
    <div
      className={cn(
        "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300",
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={closeMobileMenu}
    />
  )

  return (
    <>
      <MobileMenuToggle />
      <MobileOverlay />

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative flex h-screen flex-col bg-blue-600 text-white z-40 transition-transform duration-300",
        "w-72 sm:w-80 lg:w-64",
        // Mobile positioning
        "lg:transform-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-2 px-4 py-6 border-b border-blue-500 mt-12 lg:mt-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
            {pollinationsUrl ? (
              <Image
                src={pollinationsUrl}
                width={32}
                height={32}
                alt="App logo"
                className="object-cover"
              ></Image>
            ) : (
              <span className="text-xs text-gray-500">N/A</span>
            )}
          </div>
          <span className="font-semibold text-center text-xs sm:text-sm px-2">
            Seller Pintar Digital Asia
          </span>
          {user && (
            <span className="text-xs text-blue-100 truncate w-full text-center px-2">
              Hi, {user.username}
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" onClick={closeMobileMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-blue-500 hover:text-white text-sm sm:text-base"
            >
              <Home className="mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Back to Site</span>
            </Button>
          </Link>

          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-blue-500 hover:text-white text-sm sm:text-base",
                    isActive && "bg-blue-700"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-blue-500">
          <Button
            variant="ghost"
            onClick={() => {
              logout()
              closeMobileMenu()
            }}
            className="w-full justify-start text-white hover:bg-blue-500 hover:text-white text-sm sm:text-base"
          >
            <LogOut className="mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </Button>
        </div>
      </div>
    </>
  )
}
