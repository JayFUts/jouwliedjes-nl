import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getMollieClient } from "@/lib/mollie"

export async function POST(request: Request) {
  try {
    const mollieClient = getMollieClient()
    if (!mollieClient) {
      return NextResponse.json(
        { error: "Mollie not configured" },
        { status: 503 }
      )
    }
    const body = await request.text()
    const params = new URLSearchParams(body)
    const paymentId = params.get('id')

    if (!paymentId) {
      return NextResponse.json({ error: "No payment ID" }, { status: 400 })
    }

    // Get payment details from Mollie
    const payment = await mollieClient.payments.get(paymentId)
    
    // Get our payment record
    const paymentRecord = await prisma.payment.findUnique({
      where: { mollieId: paymentId }
    })

    if (!paymentRecord) {
      console.error(`Payment not found in database: ${paymentId}`)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update payment status
    let status: any = 'PENDING'
    if (payment.status === 'paid') {
      status = 'PAID'
      
      // Add credits to user
      await prisma.user.update({
        where: { id: paymentRecord.userId },
        data: {
          credits: {
            increment: paymentRecord.songCount
          }
        }
      })
    } else if (payment.status === 'failed') {
      status = 'FAILED'
    } else if (payment.status === 'canceled') {
      status = 'CANCELED'
    } else if (payment.status === 'expired') {
      status = 'EXPIRED'
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status,
        method: payment.method || undefined,
        paidAt: payment.paidAt ? new Date(payment.paidAt) : undefined,
        metadata: payment as any
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}