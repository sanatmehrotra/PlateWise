"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { completeRequest, type FoodRequest } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { Clock, MapPin, Package, Building2, Phone, CheckCircle } from "lucide-react"

interface AcceptedRequestCardProps {
  request: FoodRequest
}

export function AcceptedRequestCard({ request }: AcceptedRequestCardProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCompleteRequest = async () => {
    if (!request.id) return

    setLoading(true)
    try {
      await completeRequest(request.id)

      toast({
        title: "Request Completed!",
        description: "The food donation has been marked as successfully collected.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error completing request:", error)
      toast({
        title: "Error",
        description: "Failed to complete request. Please try again.",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{request.foodDescription}</CardTitle>
          <Badge className={getStatusColor(request.status)} variant="outline">
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
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

        <div className="pt-2 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Phone className="h-4 w-4 mr-2" />
            Contact Restaurant
          </Button>
          {request.status === "accepted" && (
            <Button size="sm" className="flex-1" onClick={handleCompleteRequest} disabled={loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {loading ? "Completing..." : "Mark as Collected"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
