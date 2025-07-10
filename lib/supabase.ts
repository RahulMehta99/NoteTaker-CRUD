import { createClient } from "@supabase/supabase-js"

// Use environment variables if available, otherwise fall back to hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gbrkwwsscnzmwstvywfw.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdicmt3d3NzY256bXdzdHZ5d2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODM2NzgsImV4cCI6MjA2NzU1OTY3OH0.6fyxUgxAAasymnHk6K7vu-Siu7MsFHUaJiZ_ipPg8JE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
})

export type Note = {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
}
