#!/bin/bash
set -e

echo "🚀 Deploying to production..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Rebuild containers with no cache to ensure fresh build
echo "🔨 Building Docker images..."
docker compose -f compose.prod.yaml build --no-cache

# Stop and remove containers (keeps volumes)
echo "⏸️  Stopping services..."
docker compose -f compose.prod.yaml down

npm run build

# Restart services
echo "🔄 Starting services..."
docker compose -f compose.prod.yaml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 5

# Run migrations
echo "📊 Running database migrations..."
docker compose -f compose.prod.yaml exec -T php-fpm php artisan migrate --force

# Clear and cache config
echo "🗑️  Clearing old cache..."
docker compose -f compose.prod.yaml exec -T php-fpm php artisan config:clear
docker compose -f compose.prod.yaml exec -T php-fpm php artisan route:clear
docker compose -f compose.prod.yaml exec -T php-fpm php artisan view:clear

echo "💾 Caching configuration..."
docker compose -f compose.prod.yaml exec -T php-fpm php artisan config:cache
docker compose -f compose.prod.yaml exec -T php-fpm php artisan route:cache
docker compose -f compose.prod.yaml exec -T php-fpm php artisan view:cache

echo "✅ Deployment complete!"
echo "🌐 Application is running at http://wishlist.matteoverz.xyz"