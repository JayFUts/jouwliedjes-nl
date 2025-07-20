import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from 'next/headers'

// Import the existing Suno API functionality
import { sunoApi } from "@/lib/SunoApi"

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { paymentId, songData, email, userId } = await request.json()
    
    if (!paymentId || !songData || !songData.prompt) {
      return NextResponse.json(
        { error: "Payment ID and song data are required" },
        { status: 400 }
      )
    }

    // Verify payment exists and is paid
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment || payment.status !== 'PAID') {
      return NextResponse.json(
        { error: "Payment not found or not paid" },
        { status: 400 }
      )
    }

    // Initialize Suno API
    const suno = await sunoApi((await cookies()).toString())

    let sunoResponse
    
    try {
      // Use simple generation with the user's prompt and style
      const prompt = `${songData.prompt}${songData.style ? ` in ${songData.style} style` : ''}${songData.mood ? ` with a ${songData.mood} mood` : ''}`
      sunoResponse = await suno.generate(prompt, false)

      if (!sunoResponse || sunoResponse.length === 0) {
        throw new Error('No response from Suno API')
      }

      // Take the first generated song
      const sunoSong = sunoResponse[0]

      // Create song record in database
      const songRecord = await prisma.song.create({
        data: {
          userId: userId || null,
          guestEmail: email || null,
          sunoId: sunoSong.id,
          title: sunoSong.title || 'Jouw Liedje',
          prompt: songData.prompt,
          lyrics: sunoSong.lyric || null,
          style: songData.style || sunoSong.tags || null,
          audioUrl: sunoSong.audio_url || null,
          imageUrl: sunoSong.image_url || null,
          videoUrl: sunoSong.video_url || null,
          duration: sunoSong.duration ? parseFloat(sunoSong.duration) : null,
          status: 'GENERATING',
          metadata: sunoSong as any
        }
      })

      // TODO: Send email notification to guest users when song is ready
      // This would need an email service like SendGrid or Nodemailer
      
      return NextResponse.json({
        success: true,
        song: {
          id: songRecord.id,
          sunoId: songRecord.sunoId,
          title: songRecord.title,
          status: songRecord.status,
          createdAt: songRecord.createdAt
        }
      })

    } catch (sunoError) {
      console.error("Suno API error:", sunoError)
      return NextResponse.json(
        { error: "Er ging iets mis bij het genereren van de muziek. Probeer het later opnieuw." },
        { status: 503 }
      )
    }

  } catch (error) {
    console.error("Song generation error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis bij het maken van het liedje" },
      { status: 500 }
    )
  }
}