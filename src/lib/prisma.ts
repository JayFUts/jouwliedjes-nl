import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we have a real database URL (not the dummy one)
const hasRealDatabase = process.env.DATABASE_URL && 
  process.env.DATABASE_URL !== 'postgresql://user:pass@localhost:5432/db?schema=public'

let prismaInstance: PrismaClient | undefined

if (hasRealDatabase) {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance
}

// Export a proxy that checks if database is available
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaInstance) {
      console.warn('Database not configured. Please set DATABASE_URL.')
      // Return mock methods that won't crash the app
      return () => {
        throw new Error('Database operations are not available. Please configure DATABASE_URL.')
      }
    }
    return (prismaInstance as any)[prop]
  }
})