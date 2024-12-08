import { PrismaClient } from "@prisma/client";

class PrismaService {
  private static instance: PrismaClient;
  private constructor() {}
  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
      process.on('SIGINT', async () => {
        await PrismaService.instance.$disconnect();
        process.exit(0);
      });
    }
    return PrismaService.instance;
  }
}

 const prisma = PrismaService.getInstance();

 export default prisma;