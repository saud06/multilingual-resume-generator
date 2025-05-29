# Railway Database Setup Guide

## Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Provision MySQL"

## Step 2: Get Database Credentials

1. In your Railway dashboard, click on the MySQL service
2. Go to "Variables" tab
3. Copy these values:
   - `MYSQL_HOST`
   - `MYSQL_PORT` 
   - `MYSQL_DATABASE`
   - `MYSQL_USERNAME`
   - `MYSQL_PASSWORD`

## Step 3: Update Your .env File

Create a `.env` file in the backend directory with:

```env
APP_NAME="Resume Generator"
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=https://your-railway-app.railway.app

# Database Configuration (replace with your Railway values)
DB_CONNECTION=mysql
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=6543
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=your-railway-password

# Hugging Face Configuration
HUGGINGFACE_API_TOKEN=your-huggingface-token
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models/

# JWT Configuration
JWT_SECRET=your-jwt-secret-here

# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Queue Configuration
QUEUE_CONNECTION=database

# Cache Configuration
CACHE_STORE=database
```

## Step 4: Deploy to Railway

### Option A: Connect GitHub Repository
1. In Railway, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will auto-deploy

### Option B: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Step 5: Set Environment Variables

In Railway dashboard:
1. Go to your project
2. Click on your service
3. Go to "Variables" tab
4. Add all the environment variables from your .env file

## Step 6: Run Migrations

After deployment, run migrations:
```bash
railway run php artisan migrate --force
```

Or set up automatic migrations by adding to your Railway service variables:
```
RAILWAY_RUN_MIGRATIONS=true
```

## Step 7: Test Your Application

1. Get your Railway app URL from the dashboard
2. Test the API endpoints
3. Verify database connection

## Troubleshooting

### Common Issues:

1. **Docker "max depth exceeded" Error**: 
   - This happens when Railway tries to build frontend and backend together
   - **Solution**: Use the backend-only deployment script: `./deploy-backend-only.sh`
   - Or deploy from the `backend/` directory directly

2. **Migration Errors**: Ensure all environment variables are set
3. **Connection Timeout**: Check if Railway MySQL service is running
4. **Permission Errors**: Verify database credentials
5. **Build Failures**: Check Railway logs for specific error messages

### Useful Commands:
```bash
# Check logs
railway logs

# Run artisan commands
railway run php artisan migrate
railway run php artisan config:clear
railway run php artisan cache:clear

# Connect to database
railway connect mysql
```
