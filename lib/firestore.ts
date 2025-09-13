import { collection, addDoc, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface FoodRequest {
  id?: string
  restaurantId: string
  restaurantName: string
  foodDescription: string
  quantity: string
  location: string
  status: "pending" | "accepted" | "completed"
  createdAt: Date
  acceptedBy?: string
  acceptedByName?: string
}

// Create a new food request
export const createFoodRequest = async (request: Omit<FoodRequest, "id" | "createdAt" | "status">) => {
  try {
    const docRef = await addDoc(collection(db, "requests"), {
      ...request,
      status: "pending",
      createdAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating food request:", error)
    throw error
  }
}

// Get food requests for a specific restaurant
export const getRestaurantRequests = (restaurantId: string, callback: (requests: FoodRequest[]) => void) => {
  const q = query(collection(db, "requests"), where("restaurantId", "==", restaurantId), orderBy("createdAt", "desc"))

  return onSnapshot(q, (querySnapshot) => {
    const requests: FoodRequest[] = []
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as FoodRequest)
    })
    callback(requests)
  })
}

// Get all pending food requests (for NGOs)
export const getPendingRequests = (callback: (requests: FoodRequest[]) => void) => {
  const q = query(collection(db, "requests"), where("status", "==", "pending"), orderBy("createdAt", "desc"))

  return onSnapshot(q, (querySnapshot) => {
    const requests: FoodRequest[] = []
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as FoodRequest)
    })
    callback(requests)
  })
}

// Accept a food request (for NGOs)
export const acceptFoodRequest = async (requestId: string, ngoId: string, ngoName: string) => {
  try {
    const requestRef = doc(db, "requests", requestId)
    await updateDoc(requestRef, {
      status: "accepted",
      acceptedBy: ngoId,
      acceptedByName: ngoName,
    })
  } catch (error) {
    console.error("Error accepting food request:", error)
    throw error
  }
}

// Mark request as completed
export const completeRequest = async (requestId: string) => {
  try {
    const requestRef = doc(db, "requests", requestId)
    await updateDoc(requestRef, {
      status: "completed",
    })
  } catch (error) {
    console.error("Error completing request:", error)
    throw error
  }
}

// Get accepted requests for NGO
export const getAcceptedRequests = (ngoId: string, callback: (requests: FoodRequest[]) => void) => {
  const q = query(
    collection(db, "requests"),
    where("acceptedBy", "==", ngoId),
    where("status", "in", ["accepted", "completed"]),
    orderBy("createdAt", "desc"),
  )

  return onSnapshot(q, (querySnapshot) => {
    const requests: FoodRequest[] = []
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as FoodRequest)
    })
    callback(requests)
  })
}
