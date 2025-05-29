#!/bin/bash

echo "🚀 Simple Railway Deployment (Backend Only)"
echo "==========================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Navigate to backend directory
cd backend

echo "🔑 Logging into Railway..."
railway login

echo "🔗 Linking to existing Railway project or creating new one..."
railway link

echo "🚀 Deploying backend to Railway..."
railway up

echo "📊 Running database migrations..."
railway run php artisan migrate --force

echo "🧹 Clearing caches..."
railway run php artisan config:clear
railway run php artisan cache:clear

echo "✅ Deployment completed!"
echo "🌐 Your Laravel API should be available at your Railway domain"

# Show status
railway status

echo "🎉 Check your Railway dashboard for the live URL!"
