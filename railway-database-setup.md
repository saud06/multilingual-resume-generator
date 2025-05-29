# Railway Database-Only Setup Guide

## Step 1: Add MySQL Database to Railway Project

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Open your project**: `zooming-perception`
3. **Add MySQL Database**:
   - Click "New Service" or "+"
   - Select "Database"
   - Choose "MySQL"
   - Railway will provision a MySQL database

## Step 2: Get Database Connection Details

Once MySQL is added:

1. **Click on the MySQL service** in your Railway dashboard
2. **Go to "Variables" tab**
3. **Copy these connection details**:

```env
MYSQL_HOST=containers-us-west-xxx.railway.app
MYSQL_PORT=3306
MYSQL_DATABASE=railway
MYSQL_USERNAME=root
MYSQL_PASSWORD=your-generated-password
MYSQL_URL=mysql://root:password@host:port/railway
```

## Step 3: Update Your Local Laravel .env

Create/update your `backend/.env` file with Railway database credentials:

```env
APP_NAME="Resume Generator"
APP_ENV=local
APP_KEY=base64:b5Di9OTFu2FgU54YL0SipExZYzw3wNSzRXerz6DQxYQ=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Railway MySQL Database
DB_CONNECTION=mysql
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=your-railway-mysql-password

# Hugging Face API
HUGGINGFACE_API_TOKEN=your-token-here
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models/

# Other Laravel settings
SESSION_DRIVER=database
SESSION_LIFETIME=120
QUEUE_CONNECTION=database
CACHE_STORE=database
```

## Step 4: Test Database Connection

```bash
cd backend
php artisan migrate
```

## Step 5: Verify Connection

```bash
php artisan tinker
# Then run: DB::connection()->getPdo();
```

## Current Status

- ✅ Railway project exists: `zooming-perception`
- ⏳ Need to add MySQL database service
- ⏳ Need to get connection credentials
- ⏳ Need to update local .env file

## Next Steps

1. Add MySQL database in Railway dashboard
2. Get connection credentials
3. Update local Laravel configuration
4. Test connection and run migrations
