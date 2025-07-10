"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !fullName) {
      setError("All fields are required")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        if (error.message.includes("User already registered")) {
          setError("An account with this email already exists. Please sign in instead.")
          return
        }
        throw error
      }

      // Check if user needs to confirm email
      if (data.user && !data.user.email_confirmed_at) {
        setMessage(
          "Please check your email and click the verification link to complete your registration. You must verify your email before you can sign in.",
        )
      } else {
        // If email is already confirmed (shouldn't happen with new signups)
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
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
      setError(error.message || "An error occurred with Google signup")
      setLoading(false)
    }
  }

  if (message) {
    return (
      <div className="welcome-page">
        <div className="welcome-container">
          <div className="welcome-header">
            <h1>📧 Check Your Email</h1>
            <p>We've sent a verification link to {email}</p>
            <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.9, marginTop: "var(--space-16)" }}>
              You must click the verification link before you can sign in to your account.
            </p>
          </div>
          <div className="auth-buttons">
            <button className="btn btn--outline btn--full-width" onClick={() => router.push("/auth/login")}>
              Go to Sign In
            </button>
            <button className="btn btn--secondary btn--full-width" onClick={() => router.push("/")}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1>Create Account</h1>
          <p>Sign up to start taking notes</p>
        </div>

        <form onSubmit={handleEmailSignUp} style={{ marginBottom: "var(--space-24)" }}>
          <div style={{ marginBottom: "var(--space-16)" }}>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
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
              placeholder="Password (min 6 characters)"
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
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

          <button type="submit" className="btn btn--primary btn--full-width" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
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
          onClick={handleGoogleSignUp}
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
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--color-btn-primary-text)", textDecoration: "underline" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
