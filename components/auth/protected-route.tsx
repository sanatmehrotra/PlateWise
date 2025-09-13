"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "restaurant" | "ngo"
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredRole, redirectTo = "/" }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to auth page
      if (!user) {
        router.push("/auth")
        return
      }

      // If user doesn't have a role yet, redirect to home (role selection)
      if (!userData?.role) {
        router.push("/")
        return
      }

      // If specific role is required and user doesn't have it, redirect
      if (requiredRole && userData.role !== requiredRole) {
        router.push(redirectTo)
        return
      }
    }
  }, [user, userData, loading, router, requiredRole, redirectTo])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated or wrong role
  if (!user || !userData?.role || (requiredRole && userData.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
