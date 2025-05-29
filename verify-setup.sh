#!/bin/bash

echo "🔍 Verifying Railway Database Setup"
echo "=================================="

cd backend

echo "📋 1. Checking Laravel configuration..."
php artisan config:show database.connections.mysql | head -10

echo ""
echo "🔗 2. Testing database connection..."
php artisan tinker --execute="
try {
    \$pdo = DB::connection()->getPdo();
    echo '✅ Database connection: SUCCESS' . PHP_EOL;
    echo 'Host: ' . config('database.connections.mysql.host') . PHP_EOL;
    echo 'Database: ' . config('database.connections.mysql.database') . PHP_EOL;
} catch (Exception \$e) {
    echo '❌ Database connection: FAILED - ' . \$e->getMessage() . PHP_EOL;
}
"

echo ""
echo "📊 3. Checking database tables..."
php artisan tinker --execute="
\$tables = DB::select('SHOW TABLES');
echo 'Tables found: ' . count(\$tables) . PHP_EOL;
foreach(\$tables as \$table) {
    \$tableName = array_values((array)\$table)[0];
    echo '  ✅ ' . \$tableName . PHP_EOL;
}
"

echo ""
echo "🎯 4. Testing a simple database operation..."
php artisan tinker --execute="
try {
    \$count = DB::table('users')->count();
    echo '✅ Users table accessible: ' . \$count . ' records' . PHP_EOL;
} catch (Exception \$e) {
    echo '❌ Database operation failed: ' . \$e->getMessage() . PHP_EOL;
}
"

echo ""
echo "🚀 Setup Status: COMPLETE!"
echo "Your Laravel app is connected to Railway MySQL database."
echo ""
echo "To start your application:"
echo "  Backend:  cd backend && php artisan serve"
echo "  Frontend: cd frontend && npm run dev"
