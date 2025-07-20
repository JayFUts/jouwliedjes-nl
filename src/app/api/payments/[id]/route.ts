import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // For guest users, we need to verify ownership differently
    // They can only access their payment through the direct payment ID
    const payment = await prisma.payment.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        amount: true,
        songCount: true,
        status: true,
        method: true,
        paidAt: true,
        createdAt: true,
        userId: true,
        guestEmail: true,
        songData: true
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Betaling niet gevonden" },
        { status: 404 }
      )
    }

    // If payment belongs to a user, verify the session
    if (payment.userId && (!session?.user?.id || payment.userId !== session.user.id)) {
      return NextResponse.json(
        { error: "Niet geautoriseerd" },
        { status: 401 }
      )
    }

    // Remove sensitive data for response
    const { userId, guestEmail, songData, ...safePayment } = payment

    return NextResponse.json({
      ...safePayment,
      isGuest: !payment.userId
    })
  } catch (error) {
    console.error("Payment fetch error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis" },
      { status: 500 }
    )
  }
}