# Railway GitHub Deployment Guide

## Alternative Deployment Method (Recommended)

Since the CLI upload is timing out, let's use GitHub integration which is more reliable:

### Step 1: Push to GitHub
```bash
# Make sure your code is committed and pushed to GitHub
git add .
git commit -m "Add Railway configuration"
git push origin main
```

### Step 2: Connect GitHub to Railway

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**: `multilingual-resume-generator`
5. **Select Root Directory**: Choose `backend/` as the root directory
6. **Railway will auto-deploy** from GitHub

### Step 3: Configure Environment Variables

In Railway Dashboard → Your Project → Variables tab, add:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:b5Di9OTFu2FgU54YL0SipExZYzw3wNSzRXerz6DQxYQ=

# Database (get from your MySQL service)
DB_CONNECTION=mysql
DB_HOST=your-mysql-host.railway.app
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=your-mysql-password

# Nixpacks Configuration
NIXPACKS_BUILD_CMD=composer install --no-dev --optimize-autoloader --no-interaction --no-scripts && composer run-script post-autoload-dump
NIXPACKS_START_CMD=php artisan serve --host=0.0.0.0 --port=$PORT
```

### Step 4: Trigger Deployment

1. **Push any change** to trigger auto-deployment
2. **Or manually trigger** from Railway dashboard
3. **Monitor logs** in Railway dashboard

### Step 5: Run Migrations

Once deployed, run migrations via Railway dashboard:
```bash
php artisan migrate --force
```

## Why This Works Better

- ✅ **No upload timeouts** - GitHub handles the file transfer
- ✅ **Automatic deployments** - Deploys on every push
- ✅ **Better reliability** - Railway's GitHub integration is more stable
- ✅ **Easier management** - All changes via Git workflow

## Current Status

Your Railway project is already set up with:
- ✅ MySQL database configured
- ✅ Environment variables set
- ✅ Nixpacks configuration ready

Just need to connect GitHub for reliable deployment!
