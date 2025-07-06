import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Niet geautoriseerd" },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const songs = await prisma.song.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        prompt: true,
        lyrics: true,
        style: true,
        audioUrl: true,
        imageUrl: true,
        videoUrl: true,
        duration: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(songs)
  } catch (error) {
    console.error("Songs fetch error:", error)
    return NextResponse.json(
      { error: "Er ging iets mis bij het ophalen van liedjes" },
      { status: 500 }
    )
  }
}