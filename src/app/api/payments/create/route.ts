import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getMollieClient, PRICE_PER_SONG, CURRENCY } from "@/lib/mollie"

export async function POST(request: Request) {
  try {
    const mollieClient = getMollieClient()
    if (!mollieClient) {
      return NextResponse.json(
        { error: "Betalingen zijn momenteel niet beschikbaar" },
        { status: 503 }
      )
    }
    
    const session = await getServerSession(authOptions)
    const { songData, email, guestUser } = await request.json()
    
    // Validate required fields
    if (guestUser && !email) {
      return NextResponse.json(
        { error: "Email is verplicht voor gastgebruikers" },
        { status: 400 }
      )
    }
    
    if (!songData || !songData.prompt) {
      return NextResponse.json(
        { error: "Song data is verplicht" },
        { status: 400 }
      )
    }

    const songCount = 1 // Always 1 song for now
    const amount = PRICE_PER_SONG.toFixed(2)

    // Create payment in database
    const paymentData: any = {
      amount: parseFloat(amount),
      songCount,
      status: 'PENDING',
      mollieId: '', // Will be updated after Mollie payment creation
      songData, // Store song generation data
    }

    // Add user or guest data
    if (session?.user?.id) {
      paymentData.userId = session.user.id
    } else {
      paymentData.guestEmail = email
    }

    const paymentRecord = await prisma.payment.create({
      data: paymentData
    })

    // Create Mollie payment
    const payment = await mollieClient.payments.create({
      amount: {
        currency: CURRENCY,
        value: amount,
      },
      description: `Liedje generatie op JouwLiedjes.nl`,
      redirectUrl: `${process.env.NEXTAUTH_URL}/payment/success?payment_id=${paymentRecord.id}`,
      webhookUrl: process.env.MOLLIE_WEBHOOK_URL,
      metadata: {
        paymentId: paymentRecord.id,
        userId: session?.user?.id || '',
        guestEmail: email || '',
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