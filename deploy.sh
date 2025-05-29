#!/bin/bash

# 🚀 Multilingual Resume Generator - Deployment Script
# This script prepares the application for production deployment

echo "🚀 Starting deployment preparation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Found project structure"

# Backend deployment preparation
echo ""
echo "🔧 Preparing Backend..."

cd backend

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning "Creating .env from .env.example"
    cp .env.example .env
    print_warning "Please update .env with your production settings!"
fi

# Install dependencies
print_status "Installing backend dependencies..."
composer install --no-dev --optimize-autoloader

# Generate app key if not exists
if ! grep -q "APP_KEY=base64:" .env; then
    print_status "Generating application key..."
    php artisan key:generate
fi

# Run migrations
print_status "Running database migrations..."
php artisan migrate --force

# Clear and cache config
print_status "Optimizing backend..."
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
print_status "Setting file permissions..."
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

cd ..

# Frontend deployment preparation
echo ""
echo "🎨 Preparing Frontend..."

cd frontend

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning "Creating .env.local - please update with production URLs!"
    cat > .env.local << EOL
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_APP_NAME="Multilingual Resume Generator"
NEXT_PUBLIC_APP_URL=https://your-frontend-url.com
EOL
fi

# Install dependencies
print_status "Installing frontend dependencies..."
npm ci

# Build for production
print_status "Building frontend for production..."
npm run build

cd ..

# Create deployment info
echo ""
echo "📋 Creating deployment information..."

cat > DEPLOYMENT_INFO.md << EOL
# 🚀 Deployment Information

## Backend Deployment (Render/Railway/Heroku)
- **Build Command**: \`composer install --no-dev --optimize-autoloader\`
- **Start Command**: \`vendor/bin/heroku-php-apache2 public/\`
- **Environment Variables Required**:
  - \`APP_KEY\` (generated automatically)
  - \`DB_CONNECTION\`, \`DB_HOST\`, \`DB_DATABASE\`, \`DB_USERNAME\`, \`DB_PASSWORD\`
  - \`HUGGINGFACE_API_TOKEN\` (get from https://huggingface.co/settings/tokens)

## Frontend Deployment (Vercel/Netlify)
- **Build Command**: \`npm run build\`
- **Output Directory**: \`.next\`
- **Environment Variables Required**:
  - \`NEXT_PUBLIC_API_URL\` (your backend URL + /api)
  - \`NEXT_PUBLIC_APP_NAME\`
  - \`NEXT_PUBLIC_APP_URL\`

## Post-Deployment Steps
1. Run database migrations: \`php artisan migrate --force\`
2. Test API endpoints: \`/api/health\`
3. Verify frontend can connect to backend
4. Test AI generation with Hugging Face token

## Free Hosting Options
- **Backend**: Render (free tier), Railway (free tier)
- **Frontend**: Vercel (free tier), Netlify (free tier)
- **Database**: Railway PostgreSQL (free), PlanetScale (free tier)

Generated on: $(date)
EOL

print_status "Created DEPLOYMENT_INFO.md"

# Final summary
echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update backend/.env with production database and API keys"
echo "2. Update frontend/.env.local with production URLs"
echo "3. Deploy backend to Render/Railway/Heroku"
echo "4. Deploy frontend to Vercel/Netlify"
echo "5. Run migrations on production database"
echo "6. Test the application"
echo ""
echo "📖 See DEPLOYMENT_INFO.md for detailed instructions"
echo "📚 See SETUP.md for complete setup guide"
echo ""
print_status "Ready for deployment! 🚀"
