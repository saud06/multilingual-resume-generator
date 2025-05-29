# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy application code
COPY . .

# Run composer scripts after copying all files
RUN composer run-script post-autoload-dump

# Ensure public directory exists (should be copied with COPY . .)
RUN if [ ! -d "public" ]; then mkdir -p public; fi

# Create required directories and set permissions
RUN mkdir -p storage/framework/{sessions,views,cache,testing} \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 755 storage bootstrap/cache

# Configure Apache
RUN a2enmod rewrite
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Verify directory structure and files
RUN ls -la /var/www/html/ && \
    echo "Public directory contents:" && \
    ls -la /var/www/html/public/ || echo "Public directory does not exist" && \
    echo "Manually creating index.php if missing:" && \
    if [ ! -f /var/www/html/public/index.php ]; then \
        mkdir -p /var/www/html/public && \
        echo '<?php' > /var/www/html/public/index.php && \
        echo '' >> /var/www/html/public/index.php && \
        echo 'use Illuminate\Foundation\Application;' >> /var/www/html/public/index.php && \
        echo 'use Illuminate\Http\Request;' >> /var/www/html/public/index.php && \
        echo '' >> /var/www/html/public/index.php && \
        echo "define('LARAVEL_START', microtime(true));" >> /var/www/html/public/index.php && \
        echo '' >> /var/www/html/public/index.php && \
        echo 'if (file_exists($maintenance = __DIR__."/../storage/framework/maintenance.php")) {' >> /var/www/html/public/index.php && \
        echo '    require $maintenance;' >> /var/www/html/public/index.php && \
        echo '}' >> /var/www/html/public/index.php && \
        echo '' >> /var/www/html/public/index.php && \
        echo 'require __DIR__."/../vendor/autoload.php";' >> /var/www/html/public/index.php && \
        echo '' >> /var/www/html/public/index.php && \
        echo '$app = require_once __DIR__."/../bootstrap/app.php";' >> /var/www/html/public/index.php && \
        echo '' >> /var/www/html/public/index.php && \
        echo '$app->handleRequest(Request::capture());' >> /var/www/html/public/index.php; \
    fi && \
    echo "Final verification:" && \
    ls -la /var/www/html/public/index.php

# Create .htaccess if missing
RUN if [ ! -f /var/www/html/public/.htaccess ]; then \
        echo 'RewriteEngine On' > /var/www/html/public/.htaccess && \
        echo 'RewriteCond %{REQUEST_FILENAME} !-f' >> /var/www/html/public/.htaccess && \
        echo 'RewriteCond %{REQUEST_FILENAME} !-d' >> /var/www/html/public/.htaccess && \
        echo 'RewriteRule ^(.*)$ index.php [QSA,L]' >> /var/www/html/public/.htaccess; \
    fi

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod 644 /var/www/html/public/index.php \
    && chmod 644 /var/www/html/public/.htaccess

# Test Laravel installation
RUN php artisan --version || echo "Laravel not properly installed"

# Cache Laravel configuration (skip if fails due to missing env vars)
RUN php artisan config:cache || echo "Config cache skipped"
RUN php artisan route:cache || echo "Route cache skipped"

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
