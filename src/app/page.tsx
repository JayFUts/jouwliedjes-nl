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
      style: 'Nederlandse pop, vrolijk, zomer',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: '2', 
      title: 'Liefde in Amsterdam',
      description: 'Romantisch liedje over de hoofdstad',
      audioUrl: '/examples/amsterdam.mp3',
      style: 'Nederlandstalige ballad, romantisch',
      gradient: 'from-pink-400 to-red-500'
    },
    {
      id: '3',
      title: 'Feest in de Kroeg',
      description: 'Een echt feestnummer',
      audioUrl: '/examples/party.mp3', 
      style: 'Feestmuziek, Nederlands, uptempo',
      gradient: 'from-purple-400 to-blue-500'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern Webflow Style */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 px-4 py-24 sm:py-32">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              AI-powered muziek generatie
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Jouw idee,
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                perfect liedje
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Creëer professionele muziek in seconden. Geen ervaring nodig, 
              alleen jouw creativiteit en onze geavanceerde AI.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/create"
                className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center"
              >
                ✨ Maak je eerste liedje
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <div className="flex items-center text-white/80">
                <span className="text-sm">Slechts €5 per liedje</span>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white/20"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white/20"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border-2 border-white/20"></div>
                </div>
                <span className="ml-3 text-sm">2000+ nummers gemaakt</span>
              </div>
              <div className="text-sm">⭐ 4.9/5 tevredenheid</div>
              <div className="text-sm">🚀 Direct beschikbaar</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Modern Cards */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Zo simpel is het
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Van idee tot volledig liedje in minder dan 5 minuten
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group relative">
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Beschrijf je idee</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  "Maak een vrolijk popliedje over de zomer" of "Een romantische ballad voor mijn partner". 
                  Gewoon in je eigen woorden.
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 italic">
                    "Vrolijke Nederlandse pop over vriendschap en goede tijden"
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="group relative">
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI maakt je muziek</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Onze AI analyseert je wensen en creëert een volledig uniek liedje met tekst, 
                  melodie en professionele productie.
                </p>
                <div className="mt-6 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-6 bg-gradient-to-t from-green-400 to-green-600 rounded animate-pulse"></div>
                    <div className="w-2 h-8 bg-gradient-to-t from-blue-400 to-blue-600 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-4 bg-gradient-to-t from-purple-400 to-purple-600 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-7 bg-gradient-to-t from-pink-400 to-pink-600 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI genereert...</span>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="group relative">
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Download & deel</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Download je liedje in studio-kwaliteit. Gebruik het voor je video's, 
                  deel met vrienden, of zelfs commercieel.
                </p>
                <div className="mt-6 flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 font-medium">MP3</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-700 font-medium">WAV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Link
              href="/create"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Probeer nu gratis
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Examples - Modern Music Cards */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Luister naar voorbeelden
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ontdek de kwaliteit en diversiteit van onze AI-gegenereerde muziek
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {examples.map((example) => (
              <div key={example.id} className="group relative">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  {/* Gradient Header */}
                  <div className={`h-32 bg-gradient-to-r ${example.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => setIsPlaying(isPlaying === example.id ? null : example.id)}
                        className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
                      >
                        {isPlaying === example.id ? '⏸️' : '▶️'}
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-white/60 rounded animate-pulse"></div>
                        <div className="w-1 h-6 bg-white/80 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-3 bg-white/60 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1 h-5 bg-white/70 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                        <div className="w-1 h-4 bg-white/60 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{example.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{example.description}</p>
                    
                    {/* Style Tag */}
                    <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600 font-medium">{example.style}</span>
                    </div>
                    
                    {/* Waveform Placeholder */}
                    <div className="mt-4 flex items-center space-x-1 h-8">
                      {Array.from({length: 20}).map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1 bg-gradient-to-t ${example.gradient} rounded opacity-40`}
                          style={{
                            height: `${Math.random() * 100 + 20}%`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Text */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-6">
              Alle voorbeelden zijn gemaakt met één simpele beschrijving
            </p>
            <Link
              href="/create"
              className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              Maak jouw eigen versie
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing - Modern Glassmorphism */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Eerlijke prijzen, 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> geen verrassingen</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Betaal alleen voor wat je gebruikt. Geen abonnementen, geen verborgen kosten.
            </p>
          </div>
          
          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
              
              <div className="relative z-10">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    ⭐ Meest populair
                  </div>
                </div>
                
                <div className="pt-6 mb-8">
                  <div className="text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    €5
                  </div>
                  <div className="text-xl text-gray-600 font-medium">per uniek liedje</div>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">100% unieke muziek</span>
                      <p className="text-gray-600 text-sm">Gegenereerd speciaal voor jou</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Studio kwaliteit</span>
                      <p className="text-gray-600 text-sm">MP3 & WAV formaten</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Commerciële licentie</span>
                      <p className="text-gray-600 text-sm">Gebruik voor bedrijf & content</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Direct beschikbaar</span>
                      <p className="text-gray-600 text-sm">Download binnen 2 minuten</p>
                    </div>
                  </li>
                </ul>
                
                <Link
                  href="/create"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
                >
                  🎵 Begin direct
                </Link>
                
                <p className="text-gray-500 text-sm mt-4">
                  Geen account nodig om te beginnen
                </p>
              </div>
            </div>
          </div>
          
          {/* Trust Signals */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">2000+</div>
              <div className="text-gray-600">Liedjes gemaakt</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">4.9⭐</div>
              <div className="text-gray-600">Gemiddelde beoordeling</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">< 2min</div>
              <div className="text-gray-600">Generatie tijd</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Beschikbaar</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}