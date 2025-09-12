#!/bin/bash

# Native PgBouncer Installation Script for macOS
echo "🚀 Installing PgBouncer natively on macOS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    print_error "Homebrew is not installed. Please install Homebrew first:"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

print_status "Homebrew is available."

# Install PgBouncer
print_status "Installing PgBouncer..."
brew install pgbouncer

# Install PostgreSQL if not already installed
if ! command -v psql &> /dev/null; then
    print_status "Installing PostgreSQL..."
    brew install postgresql@15
    brew services start postgresql@15
else
    print_status "PostgreSQL is already installed."
fi

# Create PgBouncer configuration directory
print_status "Creating PgBouncer configuration directory..."
sudo mkdir -p /usr/local/etc/pgbouncer
sudo chown $(whoami) /usr/local/etc/pgbouncer

# Copy configuration files
print_status "Setting up PgBouncer configuration..."
cp pgbouncer/pgbouncer.ini /usr/local/etc/pgbouncer/
cp pgbouncer/userlist.txt /usr/local/etc/pgbouncer/

# Create PgBouncer log directory
print_status "Creating log directory..."
sudo mkdir -p /usr/local/var/log/pgbouncer
sudo chown $(whoami) /usr/local/var/log/pgbouncer

# Create launchd plist for PgBouncer service
print_status "Creating PgBouncer service..."
cat > ~/Library/LaunchAgents/com.pgbouncer.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.pgbouncer</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/pgbouncer</string>
        <string>-u</string>
        <string>$(whoami)</string>
        <string>/usr/local/etc/pgbouncer/pgbouncer.ini</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/usr/local/var/log/pgbouncer/pgbouncer.log</string>
    <key>StandardErrorPath</key>
    <string>/usr/local/var/log/pgbouncer/pgbouncer.error.log</string>
</dict>
</plist>
EOF

# Load the service
print_status "Loading PgBouncer service..."
launchctl load ~/Library/LaunchAgents/com.pgbouncer.plist

# Start the service
print_status "Starting PgBouncer service..."
launchctl start com.pgbouncer

# Wait a moment for the service to start
sleep 3

# Check if PgBouncer is running
if pgrep -f pgbouncer > /dev/null; then
    print_status "✅ PgBouncer is running!"
    
    # Display connection information
    echo ""
    echo "📊 Connection Information:"
    echo "  PostgreSQL: localhost:5432"
    echo "  PgBouncer: localhost:6432"
    echo "  Database: phyme_db"
    echo "  Username: postgres"
    echo "  Password: your_password"
    echo ""
    echo "🔍 Health Check Endpoints:"
    echo "  http://localhost:3001/api/health"
    echo "  http://localhost:3001/api/health/pgbouncer"
    echo ""
    echo "📝 Next Steps:"
    echo "  1. Update your .env file with the correct database credentials"
    echo "  2. Create your database: createdb phyme_db"
    echo "  3. Run database migrations: npx prisma migrate deploy"
    echo "  4. Start your application: npm run dev"
    echo "  5. Test the health endpoints"
    echo ""
    echo "🛠️ Service Management:"
    echo "  Start: launchctl start com.pgbouncer"
    echo "  Stop: launchctl stop com.pgbouncer"
    echo "  Restart: launchctl unload ~/Library/LaunchAgents/com.pgbouncer.plist && launchctl load ~/Library/LaunchAgents/com.pgbouncer.plist"
    echo "  Logs: tail -f /usr/local/var/log/pgbouncer/pgbouncer.log"
    
else
    print_error "Failed to start PgBouncer. Check the logs:"
    echo "  tail -f /usr/local/var/log/pgbouncer/pgbouncer.error.log"
    exit 1
fi

print_status "🎉 PgBouncer native installation completed successfully!"
