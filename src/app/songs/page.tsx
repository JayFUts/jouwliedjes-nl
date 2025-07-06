'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Song {
  id: string
  title: string
  prompt: string
  lyrics?: string
  style?: string
  audioUrl?: string
  imageUrl?: string
  videoUrl?: string
  duration?: number
  status: string
  createdAt: string
}

export default function SongsPage() {
  const { data: session } = useSession()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [playingSong, setPlayingSong] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchSongs()
    }
  }, [session])

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs')
      if (response.ok) {
        const songsData = await response.json()
        setSongs(songsData)
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'generating':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Voltooid'
      case 'generating':
        return 'Wordt gemaakt'
      case 'failed':
        return 'Mislukt'
      case 'pending':
        return 'In wachtrij'
      default:
        return status
    }
  }

  const handlePlay = (songId: string) => {
    setPlayingSong(playingSong === songId ? null : songId)
  }

  const handleDownload = async (song: Song) => {
    if (!song.audioUrl) return
    
    try {
      const response = await fetch(song.audioUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${song.title}.mp3`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Liedjes laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mijn Liedjes</h1>
            <p className="text-gray-600 mt-1">
              {songs.length} {songs.length === 1 ? 'liedje' : 'liedjes'} gevonden
            </p>
          </div>
          <Link
            href="/create"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nieuw Liedje
          </Link>
        </div>

        {/* Songs List */}
        {songs.length > 0 ? (
          <div className="space-y-6">
            {songs.map((song) => (
              <div key={song.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{song.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(song.status)}`}>
                        {getStatusText(song.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{song.prompt}</p>
                    
                    {song.style && (
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Stijl:</span> {song.style}
                      </p>
                    )}
                    
                    {song.duration && (
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Duur:</span> {Math.round(song.duration)}s
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      Gemaakt op {new Date(song.createdAt).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>

                    {/* Lyrics */}
                    {song.lyrics && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium">
                          Bekijk songtekst
                        </summary>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700">{song.lyrics}</pre>
                        </div>
                      </details>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-6">
                    {song.audioUrl && song.status.toLowerCase() === 'completed' && (
                      <>
                        <button
                          onClick={() => handlePlay(song.id)}
                          className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition"
                        >
                          {playingSong === song.id ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                              </svg>
                              Pause
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Afspelen
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDownload(song)}
                          className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </button>
                      </>
                    )}
                    
                    {song.status.toLowerCase() === 'generating' && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                        <span className="text-sm">Wordt gemaakt...</span>
                      </div>
                    )}
                    
                    {song.status.toLowerCase() === 'failed' && (
                      <div className="text-red-600 text-sm">
                        Generatie mislukt
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio Player */}
                {song.audioUrl && playingSong === song.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <audio
                      controls
                      className="w-full"
                      src={song.audioUrl}
                      autoPlay
                      onEnded={() => setPlayingSong(null)}
                    >
                      Je browser ondersteunt geen audio element.
                    </audio>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Geen liedjes gevonden</h3>
            <p className="text-gray-600 mb-6">Je hebt nog geen liedjes gemaakt</p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Maak je eerste liedje
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}