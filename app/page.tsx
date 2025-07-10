"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { checkEnvironment } from "@/lib/env-check"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check environment configuration
    const envCheck = checkEnvironment()
    console.log("Environment configuration:", envCheck)

    const checkUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("Home page session check:", { session: !!session, error })

        if (session) {
          router.push("/dashboard")
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1>Welcome to Notes</h1>
          <p>Your personal note-taking companion</p>
        </div>
        <div className="auth-buttons">
          <button className="btn btn--primary btn--full-width" onClick={() => router.push("/auth/login")}>
            <span>📝</span>
            Sign In
          </button>
          <button className="btn btn--outline btn--full-width" onClick={() => router.push("/auth/signup")}>
            <span>👤</span>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
