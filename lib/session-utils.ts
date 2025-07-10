import { supabase } from "./supabase"

export async function clearAllSessionData() {
  try {
    console.log("Clearing all session data...")

    // Sign out from Supabase
    await supabase.auth.signOut()

    // Clear browser storage
    if (typeof window !== "undefined") {
      // Clear localStorage
      localStorage.clear()

      // Clear sessionStorage
      sessionStorage.clear()

      // Clear specific Supabase keys that might remain
      const keysToRemove = ["supabase.auth.token", "sb-gbrkwwsscnzmwstvywfw-auth-token", "supabase-auth-token"]

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })

      console.log("Session data cleared successfully")
    }
  } catch (error) {
    console.error("Error clearing session data:", error)
  }
}

export function isRefreshTokenError(error: any): boolean {
  if (!error) return false

  const message = error.message || error.toString()
  return (
    message.includes("refresh_token_not_found") ||
    message.includes("Invalid Refresh Token") ||
    message.includes("Refresh Token Not Found") ||
    message.includes("JWT expired")
  )
}
