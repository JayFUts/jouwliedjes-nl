'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-2 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              JouwLiedjes
            </span>
          </Link>
        
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/create" 
              className="px-6 py-3 text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 rounded-xl hover:bg-purple-50"
            >
              ✨ Maak liedje
            </Link>
            
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="px-6 py-3 text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 rounded-xl hover:bg-purple-50"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/songs" 
                  className="px-6 py-3 text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 rounded-xl hover:bg-purple-50"
                >
                  Mijn Liedjes
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 rounded-xl hover:bg-gray-50"
                >
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 rounded-xl hover:bg-gray-50"
                >
                  Inloggen
                </Link>
                <Link 
                  href="/register" 
                  className="ml-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start gratis
                </Link>
              </>
            )}
          </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-indigo-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 md:hidden shadow-lg">
          <div className="px-4 py-6 space-y-3">
            <Link 
              href="/create" 
              className="block py-3 px-4 text-purple-600 font-semibold bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              ✨ Maak liedje
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">Dashboard</Link>
                <Link href="/songs" className="block py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">Mijn Liedjes</Link>
                <button onClick={() => signOut()} className="block py-3 px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors w-full text-left">
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-3 px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">Inloggen</Link>
                <Link href="/register" className="block py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all text-center">Start gratis</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}