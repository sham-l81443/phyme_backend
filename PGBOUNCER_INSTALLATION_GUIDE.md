# PgBouncer Installation Guide

This guide provides multiple options for setting up PgBouncer with your Phyme backend application.

## 🎯 Installation Options

### Option 1: Docker Installation (Recommended for Development)
- **Pros**: Easy setup, isolated environment, consistent across systems
- **Cons**: Requires Docker installation
- **Best for**: Development, testing, containerized deployments

### Option 2: Native Installation (macOS)
- **Pros**: No Docker required, better performance, system integration
- **Cons**: Platform-specific, requires system-level installation
- **Best for**: Production, local development without Docker

### Option 3: Manual Installation
- **Pros**: Full control, custom configuration
- **Cons**: More complex setup, platform-specific
- **Best for**: Advanced users, custom requirements

## 🐳 Option 1: Docker Installation

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Setup
```bash
# Run the automated setup
npm run setup-pgbouncer
```

### Manual Setup
```bash
# 1. Start services
npm run pgbouncer:start

# 2. Check logs
npm run pgbouncer:logs

# 3. Monitor
npm run pgbouncer:monitor
```

### Service Management
```bash
# Start services
npm run pgbouncer:start

# Stop services
npm run pgbouncer:stop

# View logs
npm run pgbouncer:logs

# Monitor performance
npm run pgbouncer:monitor
```

## 🍎 Option 2: Native Installation (macOS)

### Prerequisites
- macOS system
- Homebrew installed
- PostgreSQL installed (or will be installed)

### Quick Setup
```bash
# Run the native installation script
bash scripts/install-pgbouncer-native.sh
```

### Manual Setup
```bash
# 1. Install PgBouncer
brew install pgbouncer

# 2. Install PostgreSQL (if not installed)
brew install postgresql@15
brew services start postgresql@15

# 3. Create configuration directory
sudo mkdir -p /usr/local/etc/pgbouncer
sudo chown $(whoami) /usr/local/etc/pgbouncer

# 4. Copy configuration files
cp pgbouncer/pgbouncer.ini /usr/local/etc/pgbouncer/
cp pgbouncer/userlist.txt /usr/local/etc/pgbouncer/

# 5. Create log directory
sudo mkdir -p /usr/local/var/log/pgbouncer
sudo chown $(whoami) /usr/local/var/log/pgbouncer

# 6. Start PgBouncer
pgbouncer -u $(whoami) /usr/local/etc/pgbouncer/pgbouncer.ini
```

### Service Management (macOS)
```bash
# Start service
launchctl start com.pgbouncer

# Stop service
launchctl stop com.pgbouncer

# Restart service
launchctl unload ~/Library/LaunchAgents/com.pgbouncer.plist
launchctl load ~/Library/LaunchAgents/com.pgbouncer.plist

# View logs
tail -f /usr/local/var/log/pgbouncer/pgbouncer.log
```

## 🔧 Option 3: Manual Installation

### Ubuntu/Debian
```bash
# Install PgBouncer
sudo apt-get update
sudo apt-get install pgbouncer

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Configure PgBouncer
sudo cp pgbouncer/pgbouncer.ini /etc/pgbouncer/
sudo cp pgbouncer/userlist.txt /etc/pgbouncer/
sudo chown postgres:postgres /etc/pgbouncer/*

# Start service
sudo systemctl start pgbouncer
sudo systemctl enable pgbouncer
```

### CentOS/RHEL
```bash
# Install PgBouncer
sudo yum install pgbouncer

# Install PostgreSQL
sudo yum install postgresql-server postgresql-contrib

# Configure PgBouncer
sudo cp pgbouncer/pgbouncer.ini /etc/pgbouncer/
sudo cp pgbouncer/userlist.txt /etc/pgbouncer/
sudo chown postgres:postgres /etc/pgbouncer/*

# Start service
sudo systemctl start pgbouncer
sudo systemctl enable pgbouncer
```

## 🔍 Verification

### Check PgBouncer Status
```bash
# Check if PgBouncer is running
ps aux | grep pgbouncer

# Check port 6432
netstat -an | grep 6432

# Test connection
psql -h localhost -p 6432 -U postgres -d phyme_db
```

### Health Check
```bash
# Application health
curl http://localhost:3001/api/health

# PgBouncer statistics
curl http://localhost:3001/api/health/pgbouncer
```

## ⚙️ Configuration

### Environment Variables
```env
# PgBouncer connection
PGBOUNCER_URL="postgresql://postgres:password@localhost:6432/phyme_db?schema=public&pgbouncer=true"

# Direct database connection (for migrations)
DATABASE_URL="postgresql://postgres:password@localhost:5432/phyme_db?schema=public"
```

### Prisma Configuration
```typescript
// Use PgBouncer for application queries
import prisma from './core/lib/prisma-pgbouncer';

// Use direct connection for migrations
// npx prisma migrate deploy --schema=./prisma/schema.prisma
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port 6432
lsof -i :6432

# Kill the process
kill -9 <PID>
```

#### 2. Permission Denied
```bash
# Fix ownership
sudo chown -R $(whoami):$(whoami) /usr/local/etc/pgbouncer
sudo chown -R $(whoami):$(whoami) /usr/local/var/log/pgbouncer
```

#### 3. Authentication Failed
```bash
# Regenerate password hash
cd pgbouncer
node generate_password.js postgres your_actual_password
# Update userlist.txt with the output
```

#### 4. Service Won't Start
```bash
# Check logs
tail -f /usr/local/var/log/pgbouncer/pgbouncer.error.log

# Test configuration
pgbouncer -t /usr/local/etc/pgbouncer/pgbouncer.ini
```

## 📊 Monitoring

### Real-time Monitoring
```bash
# Monitor PgBouncer stats
npm run pgbouncer:monitor

# Custom interval (10 seconds)
node scripts/monitor-pgbouncer.js 10
```

### Log Analysis
```bash
# View logs
tail -f /usr/local/var/log/pgbouncer/pgbouncer.log

# Search for errors
grep -i error /usr/local/var/log/pgbouncer/pgbouncer.log

# Monitor connections
grep -i "login\|logout" /usr/local/var/log/pgbouncer/pgbouncer.log
```

## 🔄 Migration from Direct Connection

### Step 1: Update Environment
```env
# Add PgBouncer URL
PGBOUNCER_URL="postgresql://postgres:password@localhost:6432/phyme_db?schema=public&pgbouncer=true"
```

### Step 2: Update Code
```typescript
// Replace direct Prisma import
// import prisma from './core/lib/prisma';
import prisma from './core/lib/prisma-pgbouncer';
```

### Step 3: Test Application
```bash
# Start application
npm run dev

# Test health endpoint
curl http://localhost:3001/api/health

# Monitor performance
npm run pgbouncer:monitor
```

## 🎯 Next Steps

1. **Choose your installation method** based on your needs
2. **Follow the setup instructions** for your chosen method
3. **Update your environment variables** with correct credentials
4. **Test the setup** using the verification steps
5. **Monitor performance** and adjust configuration as needed

## 📚 Additional Resources

- [PgBouncer Documentation](https://www.pgbouncer.org/)
- [PostgreSQL Connection Pooling](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Homebrew Installation Guide](https://brew.sh/)

---

**Need Help?** Check the troubleshooting section above or review the logs for specific error messages.
