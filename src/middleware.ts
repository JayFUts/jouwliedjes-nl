import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Check if database is configured
const isDatabaseConfigured = process.env.DATABASE_URL && 
  process.env.DATABASE_URL !== 'postgresql://user:pass@localhost:5432/db?schema=public'

// If no database, bypass auth middleware
if (!isDatabaseConfigured) {
  export default function middleware(req: NextRequest) {
    // Redirect protected routes to demo page
    return NextResponse.redirect(new URL('/demo', req.url))
  }
} else {
  export default withAuth(
    function middleware(req) {
      return NextResponse.next()
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token
      },
    }
  )
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create/:path*",
    "/songs/:path*",
  ]
}