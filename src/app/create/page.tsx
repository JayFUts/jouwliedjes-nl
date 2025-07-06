'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  credits: number
}

export default function CreatePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    lyrics: '',
    style: '',
    mode: 'simple'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.prompt.trim()) {
      setError('Beschrijving is verplicht')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/songs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Er ging iets mis')
      }

      // Redirect to dashboard with success message
      router.push(`/dashboard?created=${data.song.id}`)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (user.credits === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Geen Credits</h1>
            <p className="text-gray-600 mb-6">
              Je hebt geen credits meer om liedjes te maken. Koop credits om door te gaan.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleBuyCredits}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Koop 1 Credit voor €5
              </button>
              <Link
                href="/dashboard"
                className="block text-gray-600 hover:text-gray-700"
              >
                Terug naar dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Maak een Nieuw Liedje</h1>
          <p className="text-gray-600">
            Je hebt <span className="font-semibold text-indigo-600">{user.credits}</span> credits beschikbaar
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maak Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="simple"
                    checked={formData.mode === 'simple'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="mr-2"
                  />
                  <span>Simpel (AI schrijft alles)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="custom"
                    checked={formData.mode === 'custom'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="mr-2"
                  />
                  <span>Custom (eigen tekst)</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titel (optioneel)
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Bijv. Zomerse Vibes"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Prompt */}
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijving *
              </label>
              <textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="Beschrijf het liedje dat je wilt maken. Bijv. 'Een vrolijk Nederlands liedje over de zomer met gitaar en vrolijke melodie'"
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Style */}
            <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
                Muziekstijl (optioneel)
              </label>
              <input
                type="text"
                id="style"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                placeholder="Bijv. Nederlandse pop, ballad, rock, elektronisch"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Custom Lyrics */}
            {formData.mode === 'custom' && (
              <div>
                <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-2">
                  Eigen Songtekst
                </label>
                <textarea
                  id="lyrics"
                  value={formData.lyrics}
                  onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                  placeholder="Schrijf hier je eigen songtekst..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-gray-400"
              >
                {loading ? 'Liedje wordt gemaakt...' : 'Maak Liedje (1 Credit)'}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Annuleren
              </Link>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">💡 Tips voor betere resultaten</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Wees specifiek over de gewenste stijl en stemming</li>
            <li>• Vermeld instrumenten die je wilt horen</li>
            <li>• Geef aan in welke taal de tekst moet zijn</li>
            <li>• Beschrijf het tempo (slow, medium, fast)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}