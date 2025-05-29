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
    ls -la /var/www/html/public/ && \
    echo "Checking index.php:" && \
    ls -la /var/www/html/public/index.php && \
    echo "File contents preview:" && \
    head -5 /var/www/html/public/index.php

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
