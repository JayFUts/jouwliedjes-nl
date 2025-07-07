import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { cookies } from 'next/headers'

// Import the existing Suno API functionality
import { sunoApi } from "@/lib/SunoApi"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om een liedje te maken" },
        { status: 401 }
      )
    }

    // Check if user has credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    })

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { error: "Je hebt geen credits meer. Koop eerst nieuwe credits." },
        { status: 402 }
      )
    }

    const { prompt, lyrics, style, title, mode = 'simple' } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Beschrijving is verplicht" },
        { status: 400 }
      )
    }

    // Initialize Suno API
    const suno = await sunoApi((await cookies()).toString())

    let sunoResponse
    
    try {
      if (mode === 'custom' && lyrics) {
        // Use custom generation with lyrics
        sunoResponse = await suno.custom_generate(
          lyrics,  // prompt
          style || 'pop',  // tags
          title || 'Untitled Song',  // title
          false  // make_instrumental
        )
      } else {
        // Use simple generation
        sunoResponse = await suno.generate(prompt, false)
      }

      if (!sunoResponse || sunoResponse.length === 0) {
        throw new Error('No response from Suno API')
      }

      // Take the first generated song
      const sunoSong = sunoResponse[0]

      // Create song record in database
      const song = await prisma.song.create({
        data: {
          userId: session.user.id,
          sunoId: sunoSong.id,
          title: title || sunoSong.title || 'Untitled Song',
          prompt,
          lyrics: lyrics || sunoSong.lyric || null,
          style: style || sunoSong.tags || null,
          audioUrl: sunoSong.audio_url || null,
          imageUrl: sunoSong.image_url || null,
          videoUrl: sunoSong.video_url || null,
          duration: sunoSong.duration ? parseFloat(sunoSong.duration) : null,
          status: 'GENERATING',
          metadata: sunoSong as any
        }
      })

      // Deduct credit from user
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          credits: {
            decrement: 1
          }
        }
      })

      return NextResponse.json({
        success: true,
        song: {
          id: song.id,
          sunoId: song.sunoId,
          title: song.title,
          status: song.status,
          createdAt: song.createdAt
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
    console.error("Song creation error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis bij het maken van het liedje" },
      { status: 500 }
    )
  }
}