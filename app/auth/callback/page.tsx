"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const [message, setMessage] = useState("Completing authentication...")
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session after the callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          setMessage("Authentication failed. Redirecting...")
          setTimeout(() => {
            router.push("/auth/login?error=Authentication failed")
          }, 2000)
          return
        }

        if (data.session && data.session.user) {
          const user = data.session.user

          // Check if email is verified
          if (!user.email_confirmed_at) {
            setMessage("Email verification required. Redirecting...")
            // Sign out unverified user
            await supabase.auth.signOut()
            setTimeout(() => {
              router.push("/auth/login?error=Please verify your email before signing in")
            }, 2000)
            return
          }

          // Success - user is verified
          setMessage("Authentication successful! Redirecting to dashboard...")
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        } else {
          setMessage("No session found. Redirecting...")
          setTimeout(() => {
            router.push("/auth/login")
          }, 2000)
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setMessage("Authentication failed. Redirecting...")
        setTimeout(() => {
          router.push("/auth/login?error=Authentication failed")
        }, 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  )
}
