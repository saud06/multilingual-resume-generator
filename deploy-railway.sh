#!/bin/bash

echo "🚀 Railway Deployment Script for Laravel Resume Generator"
echo "========================================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Navigate to backend directory
cd backend

echo "📋 Pre-deployment checklist:"
echo "1. ✅ Railway project created with MySQL database"
echo "2. ✅ Environment variables configured in Railway dashboard"
echo "3. ✅ Database credentials obtained from Railway"

read -p "Have you completed the above steps? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the setup steps first. Check setup-railway.md"
    exit 1
fi

echo "🔑 Logging into Railway..."
railway login

echo "🔗 Linking to Railway project..."
railway link

echo "🚀 Deploying to Railway..."
railway up

echo "📊 Running database migrations..."
railway run php artisan migrate --force

echo "🧹 Clearing caches..."
railway run php artisan config:clear
railway run php artisan cache:clear
railway run php artisan route:clear

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at your Railway domain"
echo "📝 Check Railway dashboard for logs and status"

# Show logs
echo "📋 Recent logs:"
railway logs --tail 50
