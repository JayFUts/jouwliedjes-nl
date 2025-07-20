import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sunoApi } from "@/lib/SunoApi"
import { cookies } from 'next/headers'

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Get all songs that are still generating (last 24 hours)
    const generatingSongs = await prisma.song.findMany({
      where: {
        status: 'GENERATING',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: {
        id: true,
        sunoId: true,
        status: true
      }
    })

    if (generatingSongs.length === 0) {
      return NextResponse.json({ message: "No songs to update" })
    }

    const suno = await sunoApi((await cookies()).toString())
    const sunoIds = generatingSongs.map(song => song.sunoId)
    
    try {
      const sunoSongs = await suno.get(sunoIds)
      const updatePromises = []

      for (const song of generatingSongs) {
        const sunoSong = sunoSongs?.find((s: any) => s.id === song.sunoId)
        
        if (!sunoSong) continue

        let newStatus: 'GENERATING' | 'COMPLETED' | 'FAILED' = 'GENERATING'
        
        if (sunoSong.audio_url && sunoSong.status === 'complete') {
          newStatus = 'COMPLETED'
        } else if (sunoSong.status === 'error' || sunoSong.status === 'failed') {
          newStatus = 'FAILED'
        }

        if (newStatus !== song.status) {
          updatePromises.push(
            prisma.song.update({
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
          )
        }
      }

      await Promise.all(updatePromises)

      return NextResponse.json({
        success: true,
        updated: updatePromises.length,
        total: generatingSongs.length
      })

    } catch (sunoError) {
      console.error("Suno API error:", sunoError)
      return NextResponse.json(
        { error: "Error fetching from Suno API" },
        { status: 503 }
      )
    }

  } catch (error) {
    console.error("Bulk status update error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis bij het updaten van song statuses" },
      { status: 500 }
    )
  }
}