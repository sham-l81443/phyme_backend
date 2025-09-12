# PgBouncer Setup Guide for Phyme Backend

This guide will help you set up PgBouncer as a connection pooler for your PostgreSQL database to improve performance and handle more concurrent connections.

## 🚀 Quick Start

### 1. Automated Setup (Recommended)
```bash
# Run the automated setup script
npm run setup-pgbouncer
```

### 2. Manual Setup

#### Step 1: Update Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your database credentials
nano .env
```

#### Step 2: Generate Password Hash
```bash
cd pgbouncer
node generate_password.js postgres your_actual_password
# Copy the output to userlist.txt
```

#### Step 3: Start Services
```bash
# Start PgBouncer and PostgreSQL
npm run pgbouncer:start

# Check logs
npm run pgbouncer:logs
```

## 📊 Configuration Files

### Docker Compose (`docker-compose.pgbouncer.yml`)
- **PostgreSQL**: Port 5432
- **PgBouncer**: Port 6432
- **Database**: phyme_db
- **Pool Mode**: Transaction-level pooling

### PgBouncer Configuration (`pgbouncer/pgbouncer.ini`)
- **Development**: Verbose logging enabled
- **Production**: Optimized for performance
- **Pool Settings**: 20 default connections, 5 minimum

## 🔧 Environment Variables

```env
# Direct database connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/phyme_db?schema=public"

# PgBouncer connection
PGBOUNCER_URL="postgresql://postgres:password@localhost:6432/phyme_db?schema=public&pgbouncer=true"

# PgBouncer specific settings
PGBOUNCER_HOST="localhost"
PGBOUNCER_PORT=6432
PGBOUNCER_DATABASE="phyme_db"
PGBOUNCER_USER="postgres"
PGBOUNCER_PASSWORD="your_password"
```

## 🏗️ Architecture

```
Application → PgBouncer (Port 6432) → PostgreSQL (Port 5432)
```

### Benefits:
- **Connection Pooling**: Reduces connection overhead
- **Better Performance**: Handles more concurrent users
- **Resource Management**: Prevents connection exhaustion
- **Monitoring**: Built-in statistics and health checks

## 📈 Monitoring & Health Checks

### Health Check Endpoints
```bash
# Application health
curl http://localhost:3001/api/health

# PgBouncer statistics
curl http://localhost:3001/api/health/pgbouncer
```

### Real-time Monitoring
```bash
# Monitor PgBouncer stats every 30 seconds
npm run pgbouncer:monitor

# Monitor with custom interval (e.g., 10 seconds)
node scripts/monitor-pgbouncer.js 10
```

### Docker Logs
```bash
# View all logs
npm run pgbouncer:logs

# View specific service logs
docker-compose -f docker-compose.pgbouncer.yml logs pgbouncer
docker-compose -f docker-compose.pgbouncer.yml logs postgres
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run setup-pgbouncer` | Automated setup with Docker |
| `npm run pgbouncer:start` | Start PgBouncer services |
| `npm run pgbouncer:stop` | Stop PgBouncer services |
| `npm run pgbouncer:logs` | View service logs |
| `npm run pgbouncer:monitor` | Real-time monitoring |
| `npm run health` | Check application health |
| `npm run pgbouncer:stats` | Get PgBouncer statistics |

## 🔄 Switching Between Configurations

### Development (with PgBouncer)
```typescript
// Use the PgBouncer-enabled Prisma client
import prisma from './core/lib/prisma-pgbouncer';
```

### Production (with PgBouncer)
```typescript
// Use the PgBouncer-enabled Prisma client
import prisma from './core/lib/prisma-pgbouncer';
```

### Direct Database (without PgBouncer)
```typescript
// Use the original Prisma client
import prisma from './core/lib/prisma';
```

**Important Notes:**
- PgBouncer handles connection pooling at the database level
- Prisma doesn't need special pooling configuration when using PgBouncer
- The `prisma-pgbouncer.ts` client simply connects to PgBouncer's port (6432)
- PgBouncer manages the actual PostgreSQL connections internally

## 📊 Performance Tuning

### Development Settings
- **Pool Size**: 20 connections
- **Logging**: Verbose enabled
- **Monitoring**: Real-time stats

### Production Settings
- **Pool Size**: 50 connections
- **Logging**: Errors only
- **Monitoring**: Periodic stats
- **Memory**: Optimized for performance

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection Refused
```bash
# Check if services are running
docker-compose -f docker-compose.pgbouncer.yml ps

# Restart services
npm run pgbouncer:stop
npm run pgbouncer:start
```

#### 2. Authentication Failed
```bash
# Regenerate password hash
cd pgbouncer
node generate_password.js postgres your_actual_password
# Update userlist.txt with the output
```

#### 3. Pool Exhaustion
```bash
# Check current connections
npm run pgbouncer:monitor

# Increase pool size in pgbouncer.ini
default_pool_size = 50
max_client_conn = 200
```

### Log Analysis
```bash
# Check PgBouncer logs
docker-compose -f docker-compose.pgbouncer.yml logs pgbouncer

# Check PostgreSQL logs
docker-compose -f docker-compose.pgbouncer.yml logs postgres
```

## 🔒 Security Considerations

1. **Password Management**: Use strong passwords and rotate regularly
2. **Network Security**: Restrict access to PgBouncer port (6432)
3. **Authentication**: Use MD5 authentication for production
4. **Monitoring**: Set up alerts for connection issues

## 📚 Additional Resources

- [PgBouncer Documentation](https://www.pgbouncer.org/)
- [PostgreSQL Connection Pooling](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [Docker Compose Reference](https://docs.docker.com/compose/)

## 🎯 Next Steps

1. **Set up monitoring**: Configure alerts for connection issues
2. **Performance testing**: Load test with PgBouncer enabled
3. **Backup strategy**: Ensure database backups work with PgBouncer
4. **Scaling**: Consider read replicas for read-heavy workloads

---

**Need Help?** Check the logs first, then review this guide. For additional support, check the troubleshooting section above.
