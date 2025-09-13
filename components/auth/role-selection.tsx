"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Building2, Heart, Leaf } from "lucide-react"

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<"restaurant" | "ngo" | null>(null)
  const [loading, setLoading] = useState(false)
  const { updateUserRole } = useAuth()

  const handleRoleSubmit = async () => {
    if (!selectedRole) return

    setLoading(true)
    try {
      await updateUserRole(selectedRole)
    } catch (error) {
      console.error("Error updating role:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-primary mr-2" />
            <span className="text-2xl font-bold text-primary">PlateWise</span>
          </div>
          <CardTitle className="text-2xl">Choose Your Role</CardTitle>
          <CardDescription>Select how you'd like to participate in reducing food waste</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRole === "restaurant" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-secondary/50"
              }`}
              onClick={() => setSelectedRole("restaurant")}
            >
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Restaurant</h3>
                <p className="text-sm text-muted-foreground">
                  I have surplus food to donate and want to connect with NGOs to help those in need.
                </p>
                <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                  <li>• Create food donation requests</li>
                  <li>• Track donation status</li>
                  <li>• Connect with local NGOs</li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRole === "ngo" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-secondary/50"
              }`}
              onClick={() => setSelectedRole("ngo")}
            >
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">NGO</h3>
                <p className="text-sm text-muted-foreground">
                  I work with an NGO and want to collect surplus food to distribute to communities in need.
                </p>
                <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                  <li>• Browse available food donations</li>
                  <li>• Accept donation requests</li>
                  <li>• Coordinate food collection</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleRoleSubmit} disabled={!selectedRole || loading} className="px-8 py-2" size="lg">
              {loading ? "Setting up your account..." : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
