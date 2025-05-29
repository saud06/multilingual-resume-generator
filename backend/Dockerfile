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

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy Apache vhost config
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Set working directory
WORKDIR /var/www/html

# Copy full application (including artisan + public/)
COPY . .

# Debug: Check what was actually copied
RUN echo "=== Checking copied files ===" && \
    ls -la /var/www/html && \
    echo "=== Checking public directory ===" && \
    ls -la /var/www/html/public || echo "PUBLIC MISSING" && \
    echo "=== Checking artisan ===" && \
    ls -la /var/www/html/artisan || echo "ARTISAN MISSING"

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Allow composer as root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create required directories and set permissions
RUN mkdir -p storage/framework/{sessions,views,cache,testing} \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 755 storage bootstrap/cache

# Run Laravel optimizations (ignore if env missing)
RUN php artisan config:cache || true
RUN php artisan route:cache || true
RUN php artisan view:cache || true

# Expose Apache port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
