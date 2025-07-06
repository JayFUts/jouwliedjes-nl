import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { mollie, PRICE_PER_SONG, CURRENCY } from "@/lib/mollie"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om een betaling te starten" },
        { status: 401 }
      )
    }

    const { songCount = 1 } = await request.json()
    const amount = (PRICE_PER_SONG * songCount).toFixed(2)

    // Create payment in database
    const paymentRecord = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: parseFloat(amount),
        songCount,
        status: 'PENDING',
        mollieId: '', // Will be updated after Mollie payment creation
      }
    })

    // Create Mollie payment
    const payment = await mollie.payments.create({
      amount: {
        currency: CURRENCY,
        value: amount,
      },
      description: `${songCount} liedje${songCount > 1 ? 's' : ''} op JouwLiedjes.nl`,
      redirectUrl: `${process.env.NEXTAUTH_URL}/payment/success?payment_id=${paymentRecord.id}`,
      webhookUrl: process.env.MOLLIE_WEBHOOK_URL,
      metadata: {
        paymentId: paymentRecord.id,
        userId: session.user.id,
        songCount: songCount.toString(),
      },
    })

    // Update payment record with Mollie ID
    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: { mollieId: payment.id }
    })

    return NextResponse.json({
      checkoutUrl: payment.getCheckoutUrl(),
      paymentId: paymentRecord.id,
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis bij het aanmaken van de betaling" },
      { status: 500 }
    )
  }
}