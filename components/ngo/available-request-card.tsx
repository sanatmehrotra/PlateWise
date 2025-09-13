"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { acceptFoodRequest, type FoodRequest } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { Clock, MapPin, Package, Building2 } from "lucide-react"

interface AvailableRequestCardProps {
  request: FoodRequest
}

export function AvailableRequestCard({ request }: AvailableRequestCardProps) {
  const [loading, setLoading] = useState(false)
  const { user, userData } = useAuth()
  const { toast } = useToast()

  const handleAcceptRequest = async () => {
    if (!user || !userData || !request.id) return

    if (!userData.name || userData.name.trim() === "") {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile with a name before accepting requests.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await acceptFoodRequest(request.id, user.uid, userData.name)

      toast({
        title: "Request Accepted!",
        description: `You have successfully accepted the food donation from ${request.restaurantName}.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error accepting request:", error)
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{request.foodDescription}</CardTitle>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200" variant="outline">
            Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{request.restaurantName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>Quantity: {request.quantity}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{request.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Posted {formatDate(request.createdAt)}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleAcceptRequest} disabled={loading} className="w-full">
            {loading ? "Accepting..." : "Accept Request"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
