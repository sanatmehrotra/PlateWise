"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { RoleSelection } from "@/components/auth/role-selection"
import { Navbar } from "@/components/layout/navbar"

export default function HomePage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to auth page if not logged in
        router.push("/auth")
      } else if (userData?.role === "restaurant") {
        // Redirect to restaurant dashboard
        router.push("/restaurant")
      } else if (userData?.role === "ngo") {
        // Redirect to NGO dashboard
        router.push("/ngo")
      }
      // If user exists but no role, show role selection (handled by render below)
    }
  }, [user, userData, loading, router])

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

  if (!user) {
    return null // Will redirect to auth
  }

  if (user && !userData?.role) {
    return (
      <div>
        <Navbar />
        <RoleSelection />
      </div>
    )
  }

  return null // Will redirect to appropriate dashboard
}
