#!/bin/bash
set -e

# Check for --clean-volumes flag
CLEAN_VOLUMES=false
if [[ "$1" == "--clean-volumes" ]]; then
    CLEAN_VOLUMES=true
    echo "⚠️  WARNING: This will delete all volumes and database data!"
    read -p "Are you sure? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

echo "🚀 Deploying to production..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Stop and remove containers
echo "⏸️  Stopping services..."
if [ "$CLEAN_VOLUMES" = true ]; then
    docker compose -f compose.prod.yaml down -v
    echo "🗑️  Volumes removed"
else
    docker compose -f compose.prod.yaml down
fi

npm run build

# Rebuild containers with no cache to ensure fresh build
echo "🔨 Building Docker images..."
docker compose -f compose.prod.yaml build --no-cache

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