"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { getPendingRequests } from "@/lib/firestore"
import { query, collection, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, userData } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user || !userData?.role) return

    let unsubscribe: (() => void) | undefined

    if (userData.role === "ngo") {
      // Listen for new pending requests for NGOs
      unsubscribe = getPendingRequests((requests) => {
        // This will trigger on initial load and updates
        // We could add logic here to only show notifications for truly new requests
        // For now, we'll keep it simple
      })
    } else if (userData.role === "restaurant") {
      // Listen for status changes on restaurant's requests
      const restaurantQuery = query(collection(db, "requests"), where("restaurantId", "==", user.uid))

      unsubscribe = onSnapshot(restaurantQuery, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            const data = change.doc.data()
            if (data.status === "accepted" && data.acceptedByName) {
              toast({
                title: "Request Accepted!",
                description: `${data.acceptedByName} has accepted your food donation request.`,
                variant: "default",
              })
            }
          }
        })
      })
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user, userData, toast])

  return <>{children}</>
}
