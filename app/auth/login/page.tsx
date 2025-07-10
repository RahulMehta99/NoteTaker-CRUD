"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendingEmail, setResendingEmail] = useState(false)
  const [showResendOption, setShowResendOption] = useState(false)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setLoading(true)
    setError("")
    setShowResendOption(false)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.includes("signup_disabled")) {
          setError("Please verify your email address before signing in. Check your inbox for the verification link.")
          setShowResendOption(true)
          return
        }
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.")
          return
        }
        throw error
      }

      // Check if user email is verified
      if (data.user && !data.user.email_confirmed_at) {
        setError("Please verify your email address before signing in. Check your inbox for the verification link.")
        setShowResendOption(true)
        // Sign out the user since they're not verified
        await supabase.auth.signOut()
        return
      }

      // Success - redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      setError("Please enter your email address first")
      return
    }

    setResendingEmail(true)
    setError("")

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setError("")
      alert("Verification email sent! Please check your inbox and click the verification link.")
    } catch (error: any) {
      setError(error.message || "Failed to resend verification email")
    } finally {
      setResendingEmail(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || "An error occurred with Google login")
      setLoading(false)
    }
  }

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleEmailLogin} style={{ marginBottom: "var(--space-24)" }}>
          <div style={{ marginBottom: "var(--space-16)" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={{
                width: "100%",
                padding: "var(--space-12)",
                borderRadius: "var(--radius-base)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "var(--color-btn-primary-text)",
                fontSize: "var(--font-size-base)",
              }}
            />
          </div>
          <div style={{ marginBottom: "var(--space-16)" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{
                width: "100%",
                padding: "var(--space-12)",
                borderRadius: "var(--radius-base)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "var(--color-btn-primary-text)",
                fontSize: "var(--font-size-base)",
              }}
            />
          </div>

          {error && (
            <div className="status status--error" style={{ marginBottom: "var(--space-16)", width: "100%" }}>
              {error}
            </div>
          )}

          {showResendOption && (
            <div style={{ marginBottom: "var(--space-16)", textAlign: "center" }}>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingEmail}
                className="btn btn--outline btn--full-width"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "var(--color-btn-primary-text)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                {resendingEmail ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>
          )}

          <button type="submit" className="btn btn--primary btn--full-width" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", margin: "var(--space-24) 0", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "1px",
              background: "rgba(255, 255, 255, 0.3)",
            }}
          ></div>
          <span
            style={{
              background: "var(--color-primary)",
              padding: "0 var(--space-16)",
              color: "var(--color-btn-primary-text)",
              fontSize: "var(--font-size-sm)",
            }}
          >
            or
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn--outline btn--full-width"
          disabled={loading}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            color: "var(--color-btn-primary-text)",
            marginBottom: "var(--space-24)",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "var(--font-size-lg)" }}>G</span>
          Continue with Google
        </button>

        <div style={{ textAlign: "center", fontSize: "var(--font-size-sm)" }}>
          Don't have an account?{" "}
          <Link href="/auth/signup" style={{ color: "var(--color-btn-primary-text)", textDecoration: "underline" }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
