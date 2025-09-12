import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../../core/lib/prisma-pgbouncer';
import createSuccessResponse from '../../../core/utils/responseCreator';

export class HealthController {
  static async healthCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const startTime = Date.now();
      
      // Check database connectivity
      const isDbHealthy = await PrismaService.healthCheck();
      const dbResponseTime = Date.now() - startTime;
      
      // Get pool statistics
      const poolStats = await PrismaService.getPoolStats();
      
      const healthData = {
        status: isDbHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          status: isDbHealthy ? 'connected' : 'disconnected',
          responseTime: `${dbResponseTime}ms`,
          poolStats: poolStats || 'unavailable'
        },
        application: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version,
          platform: process.platform
        }
      };

      const statusCode = isDbHealthy ? 200 : 503;
      const responseData = createSuccessResponse({ 
        data: healthData, 
        message: isDbHealthy ? 'All systems operational' : 'Database connection failed' 
      });

      res.status(statusCode).json(responseData);
    } catch (error) {
      console.error('Health check failed:', error);
      const responseData = createSuccessResponse({ 
        data: { 
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }, 
        message: 'Health check failed' 
      });
      res.status(503).json(responseData);
    }
  }

  static async pgbouncerStats(req: Request, res: Response, next: NextFunction) {
    try {
      // This would require PgBouncer admin interface access
      // For now, we'll return basic connection info
      const poolStats = await PrismaService.getPoolStats();
      
      const statsData = {
        timestamp: new Date().toISOString(),
        pgbouncer: {
          status: 'connected',
          stats: poolStats
        }
      };

      const responseData = createSuccessResponse({ 
        data: statsData, 
        message: 'PgBouncer statistics retrieved successfully' 
      });

      res.status(200).json(responseData);
    } catch (error) {
      console.error('Failed to get PgBouncer stats:', error);
      const responseData = createSuccessResponse({ 
        data: { 
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }, 
        message: 'Failed to retrieve PgBouncer statistics' 
      });
      res.status(500).json(responseData);
    }
  }
}
