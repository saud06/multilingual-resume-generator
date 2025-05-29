#!/bin/bash

echo "🚀 Railway Backend-Only Deployment Script"
echo "=========================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "📋 Creating backend-only deployment..."

# Create a temporary directory for backend-only deployment
TEMP_DIR="/tmp/railway-backend-deploy"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

echo "📁 Copying backend files..."
cp -r backend/* $TEMP_DIR/
cp backend/.env.example $TEMP_DIR/ 2>/dev/null || true

# Create a simple railway.json for backend only
cat > $TEMP_DIR/railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
EOF

# Copy the nixpacks.toml configuration
cp backend/nixpacks.toml $TEMP_DIR/ 2>/dev/null || true

# Navigate to temp directory
cd $TEMP_DIR

echo "🔑 Logging into Railway..."
railway login

echo "🔗 Creating new Railway project for backend..."
railway init

echo "🚀 Deploying backend to Railway..."
railway up

echo "📊 Running database migrations..."
railway run php artisan migrate --force

echo "🧹 Clearing caches..."
railway run php artisan config:clear
railway run php artisan cache:clear

echo "✅ Backend deployment completed!"
echo "🌐 Your Laravel API should be available at your Railway domain"

# Show the Railway URL
echo "📋 Getting Railway URL..."
railway status

# Clean up
cd - > /dev/null
rm -rf $TEMP_DIR

echo "🎉 Deployment finished! Check your Railway dashboard for the URL."
