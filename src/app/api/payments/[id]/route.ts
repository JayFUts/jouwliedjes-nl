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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Niet geautoriseerd" },
        { status: 401 }
      )
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      select: {
        id: true,
        amount: true,
        songCount: true,
        status: true,
        method: true,
        paidAt: true,
        createdAt: true
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Betaling niet gevonden" },
        { status: 404 }
      )
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Payment fetch error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis" },
      { status: 500 }
    )
  }
}