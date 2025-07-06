'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="flex w-full justify-center py-4 items-center border-b border-gray-300 backdrop-blur-2xl font-mono text-sm px-4 lg:px-0">
      <div className="max-w-6xl flex w-full items-center justify-between">
        <div className="font-medium text-xl text-indigo-900 flex items-center gap-2">
          <span className="bg-indigo-900 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
            </svg>
          </span>
          <Link href="/">JouwLiedjes</Link>
        </div>
        
        <div className="hidden md:flex items-center justify-center gap-1 text-sm font-light text-indigo-900/90">
          {session ? (
            <>
              <Link 
                href="/dashboard" 
                className="p-2 lg:px-6 lg:py-3 rounded-full flex justify-center items-center lg:hover:bg-indigo-300 duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/create" 
                className="p-2 lg:px-6 lg:py-3 rounded-full flex justify-center items-center lg:hover:bg-indigo-300 duration-200"
              >
                Nieuw Liedje
              </Link>
              <Link 
                href="/songs" 
                className="p-2 lg:px-6 lg:py-3 rounded-full flex justify-center items-center lg:hover:bg-indigo-300 duration-200"
              >
                Mijn Liedjes
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2 lg:px-6 lg:py-3 rounded-full flex justify-center items-center lg:hover:bg-indigo-300 duration-200"
              >
                Uitloggen
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="p-2 lg:px-6 lg:py-3 rounded-full flex justify-center items-center lg:hover:bg-indigo-300 duration-200"
              >
                Inloggen
              </Link>
              <Link 
                href="/register" 
                className="p-2 lg:px-6 lg:py-3 bg-indigo-600 text-white rounded-full flex justify-center items-center lg:hover:bg-indigo-700 duration-200"
              >
                Gratis Starten
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
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-300 md:hidden">
          <div className="px-4 py-2 space-y-1">
            {session ? (
              <>
                <Link href="/dashboard" className="block py-2 text-indigo-900">Dashboard</Link>
                <Link href="/create" className="block py-2 text-indigo-900">Nieuw Liedje</Link>
                <Link href="/songs" className="block py-2 text-indigo-900">Mijn Liedjes</Link>
                <button onClick={() => signOut()} className="block py-2 text-indigo-900 w-full text-left">
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-indigo-900">Inloggen</Link>
                <Link href="/register" className="block py-2 text-indigo-900 font-medium">Gratis Starten</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}