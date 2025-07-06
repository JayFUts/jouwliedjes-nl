import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    // Simple endpoint to test database connection and setup
    // Only run this once after deployment
    
    const headers = request.headers
    const authHeader = headers.get('authorization')
    
    // Simple protection - you can remove this after setup
    if (authHeader !== 'Bearer setup-database-now') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Test database connection
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      userCount,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      { error: "Database connection failed", details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Database setup endpoint",
    instruction: "POST with Authorization: Bearer setup-database-now"
  })
}