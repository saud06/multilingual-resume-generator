# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# Copy everything from backend directory
COPY . .

# Install Composer and set permissions
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

# Ensure public directory exists and create if missing
RUN mkdir -p public && \
    if [ ! -f public/index.php ]; then \
        echo "Creating missing index.php" && \
        echo '<?php require_once __DIR__."/../vendor/autoload.php"; $app = require_once __DIR__."/../bootstrap/app.php"; $app->handleRequest(Illuminate\Http\Request::capture());' > public/index.php; \
    fi

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    mkdir -p storage/framework/{sessions,views,cache,testing} storage/logs bootstrap/cache

# Copy Apache config
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Create startup script
RUN echo '#!/bin/bash' > /start.sh && \
    echo 'echo "Running database migrations..."' >> /start.sh && \
    echo 'php artisan migrate --force || echo "Migration failed, continuing..."' >> /start.sh && \
    echo 'echo "Starting Apache..."' >> /start.sh && \
    echo 'exec apache2-foreground' >> /start.sh && \
    chmod +x /start.sh

# Expose port and start with migration
EXPOSE 80
CMD ["/start.sh"]
