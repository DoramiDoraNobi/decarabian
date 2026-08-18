#!/bin/bash

# Ensure database directory has correct permissions
chown -R www-data:www-data /var/www/html/database

# Check if .env exists, if not copy from example
if [ ! -f /var/www/html/.env ]; then
    cp /var/www/html/.env.example /var/www/html/.env
    php artisan key:generate --force
fi

# Set database connection to sqlite for self-hosted default
sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=sqlite/' /var/www/html/.env

# Run migrations and seed the database if it's completely empty
# We force it because we are in production mode inside the container
php artisan migrate --force

# Seed the default admin user so the self-hoster can log in immediately
php artisan db:seed --force

# Clear and cache configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Apache in the foreground
exec apache2-foreground
