#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

class PgBouncerTester {
  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.PGBOUNCER_URL || process.env.DATABASE_URL?.replace(':5432', ':6432'),
        },
      },
    });
  }

  async testConnection() {
    console.log('🔍 Testing PgBouncer connection...\n');
    
    try {
      // Test basic connection
      console.log('1. Testing basic connection...');
      await this.prisma.$queryRaw`SELECT 1 as test`;
      console.log('   ✅ Basic connection successful');
      
      // Test database info
      console.log('2. Getting database information...');
      const dbInfo = await this.prisma.$queryRaw`
        SELECT 
          current_database() as database_name,
          current_user as current_user,
          version() as postgres_version,
          now() as current_time
      `;
      console.log('   ✅ Database info retrieved:');
      console.log(`      Database: ${dbInfo[0].database_name}`);
      console.log(`      User: ${dbInfo[0].current_user}`);
      console.log(`      PostgreSQL Version: ${dbInfo[0].postgres_version.split(' ')[0]}`);
      console.log(`      Current Time: ${dbInfo[0].current_time}`);
      
      // Test connection pool stats
      console.log('3. Getting connection statistics...');
      const stats = await this.prisma.$queryRaw`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `;
      console.log('   ✅ Connection stats retrieved:');
      console.log(`      Total Connections: ${stats[0].total_connections}`);
      console.log(`      Active Connections: ${stats[0].active_connections}`);
      console.log(`      Idle Connections: ${stats[0].idle_connections}`);
      
      // Test a simple query
      console.log('4. Testing sample query...');
      const result = await this.prisma.$queryRaw`
        SELECT 
          'PgBouncer Test' as test_name,
          'Connection successful' as status,
          now() as timestamp
      `;
      console.log('   ✅ Sample query successful:');
      console.log(`      Test: ${result[0].test_name}`);
      console.log(`      Status: ${result[0].status}`);
      console.log(`      Timestamp: ${result[0].timestamp}`);
      
      console.log('\n🎉 All tests passed! PgBouncer is working correctly.');
      return true;
      
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      console.error('   Error details:', error);
      return false;
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing performance...\n');
    
    const iterations = 10;
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      try {
        await this.prisma.$queryRaw`SELECT 1 as test`;
        const duration = Date.now() - start;
        times.push(duration);
        console.log(`   Query ${i + 1}: ${duration}ms`);
      } catch (error) {
        console.error(`   Query ${i + 1} failed:`, error.message);
        return false;
      }
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    console.log('\n📊 Performance Results:');
    console.log(`   Average: ${avgTime.toFixed(2)}ms`);
    console.log(`   Minimum: ${minTime}ms`);
    console.log(`   Maximum: ${maxTime}ms`);
    
    if (avgTime < 50) {
      console.log('   ✅ Excellent performance!');
    } else if (avgTime < 100) {
      console.log('   ✅ Good performance!');
    } else {
      console.log('   ⚠️  Performance could be improved');
    }
    
    return true;
  }

  async runTests() {
    console.log('🚀 PgBouncer Test Suite');
    console.log('======================\n');
    
    const connectionTest = await this.testConnection();
    if (!connectionTest) {
      console.log('\n❌ Connection test failed. Please check your PgBouncer setup.');
      await this.disconnect();
      process.exit(1);
    }
    
    const performanceTest = await this.testPerformance();
    if (!performanceTest) {
      console.log('\n❌ Performance test failed.');
      await this.disconnect();
      process.exit(1);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('   PgBouncer is ready for use with your application.');
    
    await this.disconnect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new PgBouncerTester();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Test interrupted. Disconnecting...');
    await tester.disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Test terminated. Disconnecting...');
    await tester.disconnect();
    process.exit(0);
  });

  // Run the tests
  tester.runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = PgBouncerTester;
