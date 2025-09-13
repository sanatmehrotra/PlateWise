"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, googleProvider, db } from "./firebase"

interface UserData {
  uid: string
  name: string
  email: string
  role?: "restaurant" | "ngo"
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserRole: (role: "restaurant" | "ngo") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      console.error("[v0] Firebase auth not initialized - check environment variables")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user && db) {
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData)
          }
        } catch (error) {
          console.error("[v0] Error fetching user data:", error)
        }
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error("Firebase is not properly configured. Please check your environment variables.")
    }

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      if (!db) {
        throw new Error("Firestore is not properly configured.")
      }

      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (!userDoc.exists()) {
        const userData: UserData = {
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email || "",
          createdAt: new Date(),
        }
        await setDoc(doc(db, "users", user.uid), userData)
        setUserData(userData)
      }
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (!auth || !db) {
      throw new Error("Firebase is not properly configured. Please check your environment variables.")
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user

      const userData: UserData = {
        uid: user.uid,
        name: name.trim() || email.split("@")[0] || "User",
        email,
        createdAt: new Date(),
      }

      await setDoc(doc(db, "users", user.uid), userData)
      setUserData(userData)
    } catch (error) {
      console.error("Error signing up with email:", error)
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase is not properly configured. Please check your environment variables.")
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing in with email:", error)
      throw error
    }
  }

  const logout = async () => {
    if (!auth) {
      throw new Error("Firebase is not properly configured. Please check your environment variables.")
    }

    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const updateUserRole = async (role: "restaurant" | "ngo") => {
    if (!user || !db) {
      if (!db) {
        throw new Error("Firebase is not properly configured. Please check your environment variables.")
      }
      return
    }

    try {
      await setDoc(doc(db, "users", user.uid), { role }, { merge: true })
      setUserData((prev) => (prev ? { ...prev, role } : null))
    } catch (error) {
      console.error("Error updating user role:", error)
      throw error
    }
  }

  const value = {
    user,
    userData,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    logout,
    updateUserRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
