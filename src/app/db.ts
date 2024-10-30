import { PrismaClient } from "@prisma/client"
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma = globalForPrisma.prisma || new PrismaClient()
globalForPrisma.prisma = prisma
 
// May need to add back if we ever go to prod lol.
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma