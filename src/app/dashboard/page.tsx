'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  credits: number
  _count: {
    songs: number
    payments: number
  }
}

interface Song {
  id: string
  title: string
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [recentSongs, setRecentSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
      fetchRecentSongs()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchRecentSongs = async () => {
    try {
      const response = await fetch('/api/songs?limit=5')
      if (response.ok) {
        const songs = await response.json()
        setRecentSongs(songs)
      }
    } catch (error) {
      console.error('Error fetching recent songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyCredits = async () => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ songCount: 1 })
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      console.error('Error creating payment:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welkom terug, {user?.name || session?.user?.name}!
          </h1>
          <p className="text-gray-600">
            Hier kun je al je liedjes beheren en nieuwe muziek maken.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Credits</h3>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {user?.credits || 0}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Beschikbare liedjes om te maken
            </p>
            {(user?.credits || 0) === 0 && (
              <button
                onClick={handleBuyCredits}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
              >
                Koop Credits (€5)
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gemaakte Liedjes</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {user?._count?.songs || 0}
            </div>
            <p className="text-sm text-gray-600">
              Totaal aantal liedjes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Uitgegeven</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              €{((user?._count?.songs || 0) * 5).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">
              Totale uitgaven
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Snelle Acties</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/create"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nieuw Liedje Maken
            </Link>
            <Link
              href="/songs"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Mijn Liedjes
            </Link>
            {(user?.credits || 0) === 0 && (
              <button
                onClick={handleBuyCredits}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Credits Kopen
              </button>
            )}
          </div>
        </div>

        {/* Recent Songs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recente Liedjes</h2>
            <Link
              href="/songs"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Bekijk alle liedjes →
            </Link>
          </div>
          {recentSongs.length > 0 ? (
            <div className="space-y-3">
              {recentSongs.map((song) => (
                <div key={song.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{song.title}</h3>
                    <p className="text-sm text-gray-600">
                      Status: <span className="capitalize">{song.status.toLowerCase()}</span>
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(song.createdAt).toLocaleDateString('nl-NL')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-gray-600 mb-4">Je hebt nog geen liedjes gemaakt</p>
              <Link
                href="/create"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Maak je eerste liedje
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}