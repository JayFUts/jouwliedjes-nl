'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  const { data: session } = useSession()
  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  const examples = [
    {
      id: '1',
      title: 'Zomerse Vibes',
      description: 'Een vrolijk Nederlands zomerliedje',
      audioUrl: '/examples/summer.mp3',
      style: 'Nederlandse pop, vrolijk, zomer'
    },
    {
      id: '2', 
      title: 'Liefde in Amsterdam',
      description: 'Romantisch liedje over de hoofdstad',
      audioUrl: '/examples/amsterdam.mp3',
      style: 'Nederlandstalige ballad, romantisch'
    },
    {
      id: '3',
      title: 'Feest in de Kroeg',
      description: 'Een echt feestnummer',
      audioUrl: '/examples/party.mp3', 
      style: 'Feestmuziek, Nederlands, uptempo'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Maak Je Eigen Liedje met AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Creëer unieke, professionele muziek in jouw stijl voor slechts €5 per liedje.
            Powered by geavanceerde AI technologie.
          </p>
          <div className="flex gap-4 justify-center">
            {session ? (
              <Link
                href="/create"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Maak een nieuw liedje
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Start nu gratis
                </Link>
                <Link
                  href="/login"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition"
                >
                  Inloggen
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Hoe werkt het?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Beschrijf je liedje</h3>
              <p className="text-gray-600">
                Vertel ons wat voor soort muziek je wilt. Geef een stijl, stemming of thema op.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI maakt je muziek</h3>
              <p className="text-gray-600">
                Onze geavanceerde AI genereert een uniek liedje op basis van jouw beschrijving.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download en geniet</h3>
              <p className="text-gray-600">
                Download je liedje in hoge kwaliteit en gebruik het waar je maar wilt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Voorbeelden</h2>
          <div className="space-y-6">
            {examples.map((example) => (
              <div key={example.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{example.title}</h3>
                    <p className="text-gray-600 mb-2">{example.description}</p>
                    <p className="text-sm text-gray-500">Stijl: {example.style}</p>
                  </div>
                  <button
                    onClick={() => setIsPlaying(isPlaying === example.id ? null : example.id)}
                    className="ml-4 bg-indigo-100 text-indigo-600 p-3 rounded-full hover:bg-indigo-200 transition"
                  >
                    {isPlaying === example.id ? '⏸️' : '▶️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Simpele, transparante prijzen</h2>
          <div className="bg-white border-2 border-indigo-600 rounded-lg p-8 inline-block">
            <div className="text-5xl font-bold text-indigo-600 mb-2">€5</div>
            <div className="text-xl font-medium mb-6">per liedje</div>
            <ul className="text-left space-y-2 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Volledig unieke muziek
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Hoge kwaliteit audio
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Commercieel gebruik toegestaan
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Direct downloaden
              </li>
            </ul>
            {!session && (
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition inline-block"
              >
                Begin nu
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}