import { createMollieClient } from '@mollie/api-client'

export const mollie = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY || '',
})

export const PRICE_PER_SONG = parseFloat(process.env.PRICE_PER_SONG || '5.00')
export const CURRENCY = process.env.CURRENCY || 'EUR'