#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

class PgBouncerMonitor {
  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.PGBOUNCER_URL || process.env.DATABASE_URL?.replace(':5432', ':6432'),
        },
      },
    });
  }

  async getPgBouncerStats() {
    try {
      // Get PgBouncer statistics
      const stats = await this.prisma.$queryRaw`
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
          tup_deleted,
          conflicts,
          temp_files,
          temp_bytes,
          deadlocks,
          checksum_failures,
          checksum_last_failure
        FROM pg_stat_database 
        WHERE datname = current_database()
      `;

      return stats[0];
    } catch (error) {
      console.error('Error getting PgBouncer stats:', error);
      return null;
    }
  }

  async getConnectionStats() {
    try {
      // Get current connection count
      const connections = await this.prisma.$queryRaw`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections,
          count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `;

      return connections[0];
    } catch (error) {
      console.error('Error getting connection stats:', error);
      return null;
    }
  }

  async getDatabaseSize() {
    try {
      const size = await this.prisma.$queryRaw`
        SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
      `;

      return size[0];
    } catch (error) {
      console.error('Error getting database size:', error);
      return null;
    }
  }

  async monitor() {
    console.log('🔍 PgBouncer Monitor - Starting...\n');

    const stats = await this.getPgBouncerStats();
    const connections = await this.getConnectionStats();
    const dbSize = await this.getDatabaseSize();

    console.log('📊 Database Statistics:');
    console.log('=====================');
    if (stats) {
      console.log(`Database: ${stats.datname}`);
      console.log(`Backend Connections: ${stats.numbackends}`);
      console.log(`Transactions Committed: ${stats.xact_commit}`);
      console.log(`Transactions Rolled Back: ${stats.xact_rollback}`);
      console.log(`Blocks Read: ${stats.blks_read}`);
      console.log(`Blocks Hit: ${stats.blks_hit}`);
      console.log(`Cache Hit Ratio: ${((stats.blks_hit / (stats.blks_hit + stats.blks_read)) * 100).toFixed(2)}%`);
      console.log(`Tuples Returned: ${stats.tup_returned}`);
      console.log(`Tuples Fetched: ${stats.tup_fetched}`);
      console.log(`Tuples Inserted: ${stats.tup_inserted}`);
      console.log(`Tuples Updated: ${stats.tup_updated}`);
      console.log(`Tuples Deleted: ${stats.tup_deleted}`);
      console.log(`Deadlocks: ${stats.deadlocks}`);
    }

    console.log('\n🔗 Connection Statistics:');
    console.log('========================');
    if (connections) {
      console.log(`Total Connections: ${connections.total_connections}`);
      console.log(`Active Connections: ${connections.active_connections}`);
      console.log(`Idle Connections: ${connections.idle_connections}`);
      console.log(`Idle in Transaction: ${connections.idle_in_transaction}`);
    }

    console.log('\n💾 Database Size:');
    console.log('================');
    if (dbSize) {
      console.log(`Size: ${dbSize.database_size}`);
    }

    console.log('\n⏰ Timestamp:', new Date().toISOString());
    console.log('=====================================\n');
  }

  async startMonitoring(intervalMs = 30000) {
    console.log(`Starting PgBouncer monitoring (every ${intervalMs/1000}s)...\n`);
    
    // Initial check
    await this.monitor();
    
    // Set up interval
    setInterval(async () => {
      await this.monitor();
    }, intervalMs);
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

// CLI usage
if (require.main === module) {
  const monitor = new PgBouncerMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down monitor...');
    await monitor.disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down monitor...');
    await monitor.disconnect();
    process.exit(0);
  });

  // Start monitoring
  const interval = process.argv[2] ? parseInt(process.argv[2]) * 1000 : 30000;
  monitor.startMonitoring(interval);
}

module.exports = PgBouncerMonitor;
