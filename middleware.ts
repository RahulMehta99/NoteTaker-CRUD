import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // The createMiddlewareClient automatically uses environment variables
    // NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabase = createMiddlewareClient({ req, res })

    // For now, let's disable the session check to avoid middleware issues
    // and focus on getting the basic login flow working
    console.log(`Middleware: ${req.nextUrl.pathname} - allowing all requests for testing`)
    return NextResponse.next()

    // Uncomment this section once basic login is working
    /*
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    console.log("Middleware check:", {
      path: req.nextUrl.pathname,
      hasSession: !!session,
      userEmail: session?.user?.email,
      error: error?.message,
    })

    // Protect dashboard route
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!session) {
        console.log("No session, redirecting to login")
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
    }

    // Redirect authenticated users away from auth pages
    if (
      session &&
      (req.nextUrl.pathname.startsWith("/auth/login") || req.nextUrl.pathname.startsWith("/auth/signup"))
    ) {
      console.log("User already authenticated, redirecting to dashboard")
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return res
    */
  } catch (error) {
    console.error("Middleware error:", error)
    // If middleware fails, allow the request to continue
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
