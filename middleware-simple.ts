import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // For now, let's disable middleware to test the basic flow
  // We can re-enable it once the login is working
  console.log("Simple middleware - allowing all requests for testing")
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
