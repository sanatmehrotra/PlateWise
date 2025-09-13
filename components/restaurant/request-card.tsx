"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { completeRequest, type FoodRequest } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { Clock, MapPin, Package, User, CheckCircle } from "lucide-react"

interface RequestCardProps {
  request: FoodRequest
}

export function RequestCard({ request }: RequestCardProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCompleteRequest = async () => {
    if (!request.id) return

    setLoading(true)
    try {
      await completeRequest(request.id)

      toast({
        title: "Request Completed!",
        description: "The food donation has been marked as completed.",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{request.foodDescription}</CardTitle>
          <Badge className={getStatusColor(request.status)} variant="outline">
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
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
          <span>Created {formatDate(request.createdAt)}</span>
        </div>

        {request.acceptedByName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Accepted by {request.acceptedByName}</span>
          </div>
        )}

        {request.status === "accepted" && (
          <div className="pt-2">
            <Button size="sm" onClick={handleCompleteRequest} disabled={loading} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              {loading ? "Completing..." : "Mark as Completed"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
