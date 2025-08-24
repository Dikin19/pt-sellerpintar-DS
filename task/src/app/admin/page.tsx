"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { RoleGuard } from "@/components/auth/role-guard"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/admin/articles")
  }, [router])

  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <div>Redirecting to admin articles...</div>
    </RoleGuard>
  )
}
