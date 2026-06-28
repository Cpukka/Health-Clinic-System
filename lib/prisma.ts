// /lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";  // Use @ alias

// Or use relative path
// import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

// Global instance for development
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString });
    globalForPrisma.prisma = new PrismaClient({ 
      adapter,
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };
export default prisma;