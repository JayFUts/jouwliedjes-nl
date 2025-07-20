import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sunoApi } from "@/lib/SunoApi"
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // This endpoint can be called by a cron job to update song statuses
    
    const song = await prisma.song.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        sunoId: true,
        status: true,
        userId: true
      }
    })

    if (!song) {
      return NextResponse.json(
        { error: "Liedje niet gevonden" },
        { status: 404 }
      )
    }

    // Only update songs that are still generating
    if (song.status !== 'GENERATING') {
      return NextResponse.json({ message: "Song already processed" })
    }

    // Get updated info from Suno
    const suno = await sunoApi((await cookies()).toString())
    const sunoSongs = await suno.get([song.sunoId])
    
    if (!sunoSongs || sunoSongs.length === 0) {
      return NextResponse.json(
        { error: "Song niet gevonden in Suno API" },
        { status: 404 }
      )
    }

    const sunoSong = sunoSongs[0]
    let newStatus: 'GENERATING' | 'COMPLETED' | 'FAILED' = 'GENERATING'

    // Determine status based on Suno response
    if (sunoSong.audio_url && sunoSong.status === 'complete') {
      newStatus = 'COMPLETED'
    } else if (sunoSong.status === 'error' || sunoSong.status === 'failed') {
      newStatus = 'FAILED'
    }

    // Update song in database
    const updatedSong = await prisma.song.update({
      where: { id: song.id },
      data: {
        status: newStatus as any,
        audioUrl: sunoSong.audio_url || undefined,
        imageUrl: sunoSong.image_url || undefined,
        videoUrl: sunoSong.video_url || undefined,
        duration: sunoSong.duration ? parseFloat(sunoSong.duration) : undefined,
        lyrics: sunoSong.lyric || undefined,
        metadata: sunoSong as any
      }
    })

    return NextResponse.json({
      success: true,
      song: {
        id: updatedSong.id,
        status: updatedSong.status,
        audioUrl: updatedSong.audioUrl
      }
    })

  } catch (error) {
    console.error("Song status update error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis bij het updaten van de song status" },
      { status: 500 }
    )
  }
}