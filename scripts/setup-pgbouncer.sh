#!/bin/bash

# PgBouncer Setup Script for Phyme Backend
echo "🚀 Setting up PgBouncer for Phyme Backend..."

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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are available."

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p pgbouncer
mkdir -p postgres/init

# Generate password hash for PgBouncer
print_status "Generating password hash for PgBouncer..."
cd pgbouncer
node generate_password.js postgres your_password > userlist.txt
cd ..

print_status "Password hash generated and saved to pgbouncer/userlist.txt"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file from template..."
    cp env.example .env
    print_warning "Please update the .env file with your actual database credentials!"
else
    print_status ".env file already exists."
fi

# Start PgBouncer with Docker Compose
print_status "Starting PgBouncer and PostgreSQL with Docker Compose..."
docker-compose -f docker-compose.pgbouncer.yml up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose -f docker-compose.pgbouncer.yml ps | grep -q "Up"; then
    print_status "✅ PgBouncer and PostgreSQL are running!"
    
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
    echo "  2. Run database migrations: npx prisma migrate deploy"
    echo "  3. Start your application: npm run dev"
    echo "  4. Test the health endpoints"
    
else
    print_error "Failed to start services. Check the logs with:"
    echo "docker-compose -f docker-compose.pgbouncer.yml logs"
    exit 1
fi

print_status "🎉 PgBouncer setup completed successfully!"
