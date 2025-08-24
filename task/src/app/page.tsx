"use client"

<<<<<<< HEAD
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getRoleBasedRedirectPath } from "@/lib/role-utils"

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on user role
        const redirectPath = getRoleBasedRedirectPath(user.role);
        router.push(redirectPath);
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
=======
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
}
