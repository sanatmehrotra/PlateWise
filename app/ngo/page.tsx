"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { AvailableRequestCard } from "@/components/ngo/available-request-card"
import { AcceptedRequestCard } from "@/components/ngo/accepted-request-card"
import { getPendingRequests, getAcceptedRequests, type FoodRequest } from "@/lib/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Package, Clock, CheckCircle } from "lucide-react"

export default function NGODashboard() {
  const { user } = useAuth()
  const [availableRequests, setAvailableRequests] = useState<FoodRequest[]>([])
  const [acceptedRequests, setAcceptedRequests] = useState<FoodRequest[]>([])

  useEffect(() => {
    if (user) {
      // Listen to pending requests
      const unsubscribePending = getPendingRequests((requests) => {
        setAvailableRequests(requests)
      })

      const unsubscribeAccepted = getAcceptedRequests(user.uid, (requests) => {
        setAcceptedRequests(requests)
      })

      return () => {
        unsubscribePending()
        unsubscribeAccepted()
      }
    }
  }, [user])

  const pendingCount = acceptedRequests.filter((r) => r.status === "accepted").length
  const completedCount = acceptedRequests.filter((r) => r.status === "completed").length

  return (
    <ProtectedRoute requiredRole="ngo">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">NGO Dashboard</h1>
            <p className="text-muted-foreground">Find and collect surplus food to help your community</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Requests</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableRequests.length}</div>
                <p className="text-xs text-muted-foreground">Ready to be accepted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Collection</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Waiting for pickup</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCount}</div>
                <p className="text-xs text-muted-foreground">Successfully collected</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Available and My Requests */}
          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">Available Requests</TabsTrigger>
              <TabsTrigger value="accepted">My Accepted Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Available Food Donations</h2>
                {availableRequests.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No available requests</h3>
                      <p className="text-muted-foreground">Check back later for new food donation opportunities</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {availableRequests.map((request) => (
                      <AvailableRequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-4">My Accepted Requests</h2>
                {acceptedRequests.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No accepted requests yet</h3>
                      <p className="text-muted-foreground">
                        Accept available requests to start collecting food donations
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {acceptedRequests.map((request) => (
                      <AcceptedRequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
