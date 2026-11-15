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

if [ "$CLEAN_VOLUMES" = true ]; then
    docker compose -f compose.prod.yaml down -v
    echo "🗑️  Volumes removed"
fi

# Rebuild containers with no cache to ensure fresh build
echo "🔨 Building Docker images..."
docker compose -f compose.prod.yaml build --no-cache

# Restart services
echo "🔄 Starting services..."
docker compose -f compose.prod.yaml up -d

echo "✅ Deployment complete!"
echo "🌐 Application is running at http://wishlist.matteoverz.xyz"
