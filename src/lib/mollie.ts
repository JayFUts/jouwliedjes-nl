import { createMollieClient, MollieClient } from '@mollie/api-client'

let mollieClient: MollieClient | null = null

export const getMollieClient = () => {
  if (!mollieClient && process.env.MOLLIE_API_KEY) {
    mollieClient = createMollieClient({
      apiKey: process.env.MOLLIE_API_KEY,
    })
  }
  return mollieClient
}

export const mollie = new Proxy({} as MollieClient, {
  get(target, prop) {
    const client = getMollieClient()
    if (!client) {
      throw new Error('Mollie client not initialized. Please set MOLLIE_API_KEY environment variable.')
    }
    return client[prop as keyof MollieClient]
  }
})

export const PRICE_PER_SONG = parseFloat(process.env.PRICE_PER_SONG || '5.00')
export const CURRENCY = process.env.CURRENCY || 'EUR'