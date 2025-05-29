#!/bin/bash

echo "🗄️ Testing Railway Database Connection"
echo "======================================"

cd backend

echo "📋 Checking database configuration..."
php artisan config:show database

echo ""
echo "🔗 Testing database connection..."
php artisan tinker --execute="
try {
    \$pdo = DB::connection()->getPdo();
    echo '✅ Database connection successful!' . PHP_EOL;
    echo 'Database: ' . \$pdo->getAttribute(PDO::ATTR_SERVER_INFO) . PHP_EOL;
} catch (Exception \$e) {
    echo '❌ Database connection failed: ' . \$e->getMessage() . PHP_EOL;
}
"

echo ""
echo "📊 Running migrations..."
php artisan migrate --pretend

echo ""
echo "🎯 To run actual migrations:"
echo "php artisan migrate"
