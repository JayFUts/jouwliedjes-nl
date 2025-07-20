'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreatePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: describe, 2: preview, 3: payment
  const [formData, setFormData] = useState({
    prompt: '',
    style: '',
    mood: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const styles = [
    { id: 'pop', name: 'Pop', emoji: '🎵', description: 'Catchy en mainstream' },
    { id: 'rock', name: 'Rock', emoji: '🎸', description: 'Krachtig en energiek' },
    { id: 'electronic', name: 'Electronic', emoji: '🎛️', description: 'Modern en synthetisch' },
    { id: 'acoustic', name: 'Acoustic', emoji: '🪕', description: 'Natuurlijk en intiem' },
    { id: 'hiphop', name: 'Hip-Hop', emoji: '🎤', description: 'Rhythmisch en urban' },
    { id: 'jazz', name: 'Jazz', emoji: '🎺', description: 'Smooth en geïmproviseerd' },
    { id: 'classical', name: 'Classical', emoji: '🎼', description: 'Elegant en tijdloos' },
    { id: 'country', name: 'Country', emoji: '🤠', description: 'Authentiek en verhalend' }
  ]

  const moods = [
    { id: 'happy', name: 'Vrolijk', emoji: '😊', color: 'from-yellow-400 to-orange-500' },
    { id: 'romantic', name: 'Romantisch', emoji: '💕', color: 'from-pink-400 to-red-500' },
    { id: 'energetic', name: 'Energiek', emoji: '⚡', color: 'from-blue-400 to-purple-500' },
    { id: 'calm', name: 'Rustig', emoji: '🧘', color: 'from-green-400 to-blue-500' },
    { id: 'nostalgic', name: 'Nostalgisch', emoji: '🌅', color: 'from-purple-400 to-pink-500' },
    { id: 'empowering', name: 'Krachtig', emoji: '💪', color: 'from-red-400 to-yellow-500' }
  ]

  const handleCreateSong = async () => {
    if (!formData.prompt.trim()) {
      setError('Beschrijf je liedje om te beginnen')
      return
    }
    setError('')
    setStep(2)
  }

  const handlePayment = async () => {
    if (!formData.email.trim()) {
      setError('Email adres is verplicht voor de download link')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Create payment and song generation in one go
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          songData: formData,
          email: formData.email,
          guestUser: !session
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        // Redirect to Mollie payment
        window.location.href = result.checkoutUrl
      } else {
        setError(result.error || 'Er ging iets mis bij het aanmaken van de betaling')
      }
    } catch (error) {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Maak je unieke liedje
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Van idee tot volledig liedje in minder dan 5 minuten
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNumber 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-20 h-1 mx-4 ${
                    step > stepNumber ? 'bg-purple-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Beschrijf</span>
            <span>Controleer</span>
            <span>Betaal</span>
          </div>
        </div>

        {/* Step 1: Describe Song */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Beschrijf je droomliedje
              </h2>
              
              {/* Main Prompt */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Waar gaat je liedje over? ✨
                </label>
                <textarea
                  value={formData.prompt}
                  onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                  placeholder="Bijvoorbeeld: Een vrolijk zomerliedje over vriendschap en goede tijden, of een romantische ballad over de liefde van mijn leven..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-2xl text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Style Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Welke stijl? 🎵
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setFormData({...formData, style: style.id})}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                        formData.style === style.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{style.emoji}</div>
                      <div className="font-semibold text-gray-900">{style.name}</div>
                      <div className="text-sm text-gray-600">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Welke stemming? 🎭
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setFormData({...formData, mood: mood.id})}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                        formData.mood === mood.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{mood.emoji}</div>
                      <div className="font-semibold text-gray-900">{mood.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  {error}
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleCreateSong}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Volgende stap 🎵
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preview & Email */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Controleer je bestelling
              </h2>
              
              {/* Song Preview */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Je liedje wordt:</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-20 text-gray-600 font-medium">Thema:</span>
                    <span className="text-gray-900">{formData.prompt}</span>
                  </div>
                  {formData.style && (
                    <div className="flex items-center">
                      <span className="w-20 text-gray-600 font-medium">Stijl:</span>
                      <span className="text-gray-900">
                        {styles.find(s => s.id === formData.style)?.name}
                      </span>
                    </div>
                  )}
                  {formData.mood && (
                    <div className="flex items-center">
                      <span className="w-20 text-gray-600 font-medium">Stemming:</span>
                      <span className="text-gray-900">
                        {moods.find(m => m.id === formData.mood)?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Email voor download link 📧
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="jouw@email.nl"
                  className="w-full p-4 border border-gray-200 rounded-2xl text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-2">
                  We sturen je liedje direct naar dit adres zodra het klaar is (binnen 2 minuten)
                </p>
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Totaal:</span>
                  <span className="text-3xl font-bold text-purple-600">€5,00</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Inclusief BTW • Eenmalige betaling • Geen abonnement
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Terug
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Bezig...' : 'Betaal & maak liedje 🎵'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}