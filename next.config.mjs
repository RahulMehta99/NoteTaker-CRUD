/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gbrkwwsscnzmwstvywfw.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdicmt3d3NzY256bXdzdHZ5d2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODM2NzgsImV4cCI6MjA2NzU1OTY3OH0.6fyxUgxAAasymnHk6K7vu-Siu7MsFHUaJiZ_ipPg8JE'
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
