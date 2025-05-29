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
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy application code
COPY . .

# Verify public directory was copied
RUN echo "=== Verifying Laravel files ===" && \
    ls -la /var/www/html/ && \
    echo "=== Public directory ===" && \
    ls -la /var/www/html/public/ && \
    echo "=== Checking critical files ===" && \
    ls -la /var/www/html/public/index.php && \
    ls -la /var/www/html/bootstrap/app.php

# Create required directories and set permissions
RUN mkdir -p storage/framework/{sessions,views,cache,testing} \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache public \
    && chmod -R 755 storage bootstrap/cache \
    && chmod -R 644 public

# Configure Apache
RUN a2enmod rewrite
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Clear any cached config and optimize for production
RUN php artisan config:clear || true
RUN php artisan route:clear || true
RUN php artisan view:clear || true

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
