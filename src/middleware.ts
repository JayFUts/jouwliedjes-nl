import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Create middleware that checks database configuration at runtime
export default function middleware(req: NextRequest) {
  // Check if database is configured at runtime
  const isDatabaseConfigured = process.env.DATABASE_URL && 
    process.env.DATABASE_URL !== 'postgresql://user:pass@localhost:5432/db?schema=public'

  if (!isDatabaseConfigured) {
    // If accessing protected routes without database, redirect to demo
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
                           req.nextUrl.pathname.startsWith('/create') ||
                           req.nextUrl.pathname.startsWith('/songs')
    
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/demo', req.url))
    }
    
    return NextResponse.next()
  }

  // If database is configured, use auth middleware
  return (withAuth as any)(req)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create/:path*",
    "/songs/:path*",
  ]
}