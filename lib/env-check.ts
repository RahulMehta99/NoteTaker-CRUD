export function checkEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gbrkwwsscnzmwstvywfw.supabase.co"
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdicmt3d3NzY256bXdzdHZ5d2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODM2NzgsImV4cCI6MjA2NzU1OTY3OH0.6fyxUgxAAasymnHk6K7vu-Siu7MsFHUaJiZ_ipPg8JE"

  console.log("Environment check:", {
    supabaseUrl: supabaseUrl ? "✅ Set" : "❌ Missing",
    supabaseKey: supabaseKey ? "✅ Set" : "❌ Missing",
    usingEnvVars: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  })

  return {
    supabaseUrl,
    supabaseKey,
    isConfigured: !!(supabaseUrl && supabaseKey),
  }
}
