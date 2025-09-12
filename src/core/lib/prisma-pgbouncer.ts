import { PrismaClient } from "@prisma/client";

class PrismaService {
  private static instance: PrismaClient;
  private constructor() { }
  
  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      // PgBouncer connection URL
      const pgbouncerUrl = process.env.PGBOUNCER_URL || process.env.DATABASE_URL?.replace(':5432', ':6432');
      
      PrismaService.instance = new PrismaClient({
        datasources: {
          db: {
            url: pgbouncerUrl,
          },
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        // PgBouncer handles connection pooling at the database level
        // No additional Prisma configuration needed
      });

      // Graceful shutdown handlers
      process.on('SIGINT', async () => {
        console.log('Received SIGINT, disconnecting Prisma...');
        await PrismaService.instance.$disconnect();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        console.log("Received SIGTERM, disconnecting Prisma...");
        await PrismaService.instance.$disconnect();
      });

      // Handle uncaught exceptions
      process.on('uncaughtException', async (error) => {
        console.error('Uncaught Exception:', error);
        await PrismaService.instance.$disconnect();
        process.exit(1);
      });

      process.on('unhandledRejection', async (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        await PrismaService.instance.$disconnect();
        process.exit(1);
      });
    }
    return PrismaService.instance;
  }

  // Health check method
  public static async healthCheck(): Promise<boolean> {
    try {
      await PrismaService.instance.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Get connection pool stats (if available)
  public static async getPoolStats(): Promise<any> {
    try {
      const result = await PrismaService.instance.$queryRaw`
        SELECT 
          datname,
          numbackends,
          xact_commit,
          xact_rollback,
          blks_read,
          blks_hit,
          tup_returned,
          tup_fetched,
          tup_inserted,
          tup_updated,
          tup_deleted
        FROM pg_stat_database 
        WHERE datname = current_database()
      `;
      return result;
    } catch (error) {
      console.error('Failed to get pool stats:', error);
      return null;
    }
  }
}

const prisma = PrismaService.getInstance();

export default prisma;
export { PrismaService };
