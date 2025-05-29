#!/bin/bash

echo "🚀 Building Laravel for Render..."

# Install dependencies
composer install --no-dev --optimize-autoloader --no-interaction

# Create required directories
mkdir -p storage/framework/{sessions,views,cache,testing}
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
chmod -R 755 storage bootstrap/cache

# Cache configuration for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force

echo "✅ Laravel build completed successfully!"
