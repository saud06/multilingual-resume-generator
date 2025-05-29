# 🚀 Render Deployment Guide

## Overview
Deploy your multilingual resume generator to Render with Railway database connection.

**Architecture:**
- **Frontend**: Render (Next.js)
- **Backend**: Render (Laravel)  
- **Database**: Railway (MySQL) ✅ Already configured

## 🎯 Deployment Options

### Option 1: Automatic Deployment (render.yaml)

1. **Push to GitHub** (already done)
2. **Go to Render Dashboard**: https://dashboard.render.com
3. **Create New Blueprint**:
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select `render.yaml` file
   - Render will create both services automatically

### Option 2: Manual Deployment

#### Backend Deployment
1. **Create Web Service**:
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - **Root Directory**: `backend`
   - **Environment**: `PHP`
   - **Build Command**: `./build.sh`
   - **Start Command**: `vendor/bin/heroku-php-apache2 public/`

2. **Environment Variables**:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:your-generated-key
   APP_URL=https://your-backend-url.onrender.com
   
   DB_CONNECTION=mysql
   DB_HOST=trolley.proxy.rlwy.net
   DB_PORT=44769
   DB_DATABASE=railway
   DB_USERNAME=root
   DB_PASSWORD=SFWoBIaiLeDBzlLlaJspUZtnnuYWxJiq
   
   SESSION_DRIVER=database
   CACHE_STORE=database
   QUEUE_CONNECTION=database
   
   HUGGINGFACE_API_TOKEN=your-huggingface-token
   ```

#### Frontend Deployment
1. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - **Root Directory**: `frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

2. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=https://your-frontend-url.onrender.com
   ```

## 🗄️ Database Connection

Your Railway MySQL database is already configured:
- **Host**: `trolley.proxy.rlwy.net`
- **Port**: `44769`
- **Database**: `railway`
- **Username**: `root`
- **Password**: `SFWoBIaiLeDBzlLlaJspUZtnnuYWxJiq`

✅ **No additional database setup needed!**

## 🔧 Environment Variables Summary

### Backend (.env on Render)
```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-key
APP_URL=https://your-backend.onrender.com

DB_CONNECTION=mysql
DB_HOST=trolley.proxy.rlwy.net
DB_PORT=44769
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=SFWoBIaiLeDBzlLlaJspUZtnnuYWxJiq

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

HUGGINGFACE_API_TOKEN=your-token
```

### Frontend (.env on Render)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-frontend.onrender.com
```

## 🚀 Deployment Steps

1. **Push code to GitHub** ✅ (Already done)
2. **Go to Render**: https://dashboard.render.com
3. **Deploy using render.yaml** (Recommended)
4. **Add environment variables**
5. **Wait for deployment** (5-10 minutes)
6. **Test your application**

## 🔍 Post-Deployment

### Test Checklist
- [ ] Backend API responds: `https://your-backend.onrender.com`
- [ ] Frontend loads: `https://your-frontend.onrender.com`
- [ ] Database connection works
- [ ] AI resume generation works
- [ ] Language toggle works
- [ ] PDF generation works

### Monitoring
- **Render Logs**: Available in Render dashboard
- **Database**: Monitor via Railway dashboard
- **Performance**: Render provides metrics

## 🎯 Expected URLs

After deployment:
- **Frontend**: `https://multilingual-resume-frontend.onrender.com`
- **Backend API**: `https://multilingual-resume-backend.onrender.com`
- **Database**: Railway (already running)

## 🔧 Troubleshooting

### Common Issues
1. **Build Failures**: Check build logs in Render dashboard
2. **Database Connection**: Verify Railway credentials
3. **Environment Variables**: Ensure all variables are set
4. **CORS Issues**: Check Laravel CORS configuration

### Useful Commands
```bash
# Generate Laravel key
php artisan key:generate --show

# Test database connection
php artisan tinker
DB::connection()->getPdo();
```

## 🎉 Success!

Your multilingual resume generator will be live on Render with Railway database! 🚀
