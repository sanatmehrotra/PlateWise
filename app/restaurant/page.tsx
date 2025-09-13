"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { CreateRequestForm } from "@/components/restaurant/create-request-form"
import { RequestCard } from "@/components/restaurant/request-card"
import { getRestaurantRequests, type FoodRequest } from "@/lib/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle } from "lucide-react"
import { useEffect } from "react"

export default function RestaurantDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<FoodRequest[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (user) {
      const unsubscribe = getRestaurantRequests(user.uid, (fetchedRequests) => {
        setRequests(fetchedRequests)
      })

      return () => unsubscribe()
    }
  }, [user, refreshKey])

  const handleRequestCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const acceptedCount = requests.filter((r) => r.status === "accepted").length
  const completedCount = requests.filter((r) => r.status === "completed").length

  return (
    <ProtectedRoute requiredRole="restaurant">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Restaurant Dashboard</h1>
            <p className="text-muted-foreground">Manage your food donation requests and help reduce waste</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Waiting for NGO response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accepted Requests</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{acceptedCount}</div>
                <p className="text-xs text-muted-foreground">Ready for pickup</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCount}</div>
                <p className="text-xs text-muted-foreground">Successfully donated</p>
              </CardContent>
            </Card>
          </div>

          {/* Create Request Form */}
          <div className="mb-8">
            <CreateRequestForm onRequestCreated={handleRequestCreated} />
          </div>

          {/* Requests List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Food Requests</h2>
            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No requests yet</h3>
                  <p className="text-muted-foreground">Create your first food donation request to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
