'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

interface Payment {
  id: string
  amount: number
  songCount: number
  status: string
  paidAt: string
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams?.get('payment_id')
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payments/${paymentId}`)
        if (response.ok) {
          const paymentData = await response.json()
          setPayment(paymentData)
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
      } finally {
        setLoading(false)
      }
    }

    if (paymentId) {
      checkPaymentStatus()
    }
  }, [paymentId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Betaling controleren...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {payment?.status === 'PAID' ? (
            <>
              {/* Success */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Betaling Succesvol!</h1>
              <p className="text-gray-600 mb-6">
                Je hebt succesvol {payment.songCount} {payment.songCount === 1 ? 'credit' : 'credits'} gekocht 
                voor €{payment.amount.toFixed(2)}.
              </p>
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  🎉 Je kunt nu {payment.songCount} {payment.songCount === 1 ? 'liedje' : 'liedjes'} maken!
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Pending or Failed */}
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Betaling in Behandeling</h1>
              <p className="text-gray-600 mb-6">
                Je betaling wordt nog verwerkt. Dit kan een paar minuten duren.
              </p>
              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  We sturen je een email zodra je betaling is bevestigd.
                </p>
              </div>
            </>
          )}

          {/* Payment Details */}
          {payment && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Betalingsdetails</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Bedrag:</span>
                  <span>€{payment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Credits:</span>
                  <span>{payment.songCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">{payment.status.toLowerCase()}</span>
                </div>
                {payment.paidAt && (
                  <div className="flex justify-between">
                    <span>Betaald op:</span>
                    <span>{new Date(payment.paidAt).toLocaleString('nl-NL')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            {payment?.status === 'PAID' ? (
              <>
                <Link
                  href="/create"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-medium inline-block"
                >
                  Start met Liedjes Maken
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-gray-600 hover:text-gray-700"
                >
                  Ga naar Dashboard
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Status Controleren
                </button>
                <Link
                  href="/dashboard"
                  className="block text-gray-600 hover:text-gray-700"
                >
                  Terug naar Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Pagina laden...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}