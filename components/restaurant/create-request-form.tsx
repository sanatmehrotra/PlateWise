"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { createFoodRequest } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

interface CreateRequestFormProps {
  onRequestCreated: () => void
}

export function CreateRequestForm({ onRequestCreated }: CreateRequestFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    foodDescription: "",
    quantity: "",
    location: "",
  })

  const { user, userData } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !userData) return

    if (!userData.name || userData.name.trim() === "") {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile with a name before creating requests.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Creating request with data:", {
        restaurantId: user.uid,
        restaurantName: userData.name,
        foodDescription: formData.foodDescription,
        quantity: formData.quantity,
        location: formData.location,
      })

      await createFoodRequest({
        restaurantId: user.uid,
        restaurantName: userData.name,
        foodDescription: formData.foodDescription,
        quantity: formData.quantity,
        location: formData.location,
      })

      toast({
        title: "Request Created!",
        description: "Your food donation request has been posted and NGOs will be notified.",
        variant: "default",
      })

      setFormData({ foodDescription: "", quantity: "", location: "" })
      setIsOpen(false)
      onRequestCreated()
    } catch (error) {
      console.error("Error creating request:", error)
      toast({
        title: "Error",
        description: "Failed to create request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Create Food Request
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Food Request</CardTitle>
        <CardDescription>Share details about the surplus food you'd like to donate</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="foodDescription">Food Description</Label>
            <Textarea
              id="foodDescription"
              placeholder="Describe the type of food, preparation method, ingredients, etc."
              value={formData.foodDescription}
              onChange={(e) => setFormData({ ...formData, foodDescription: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              placeholder="e.g., 50 meals, 20 kg, 100 portions"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Pickup Location</Label>
            <Input
              id="location"
              placeholder="Restaurant address or pickup instructions"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Request"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
