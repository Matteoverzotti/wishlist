# Stage 1: Build assets with the Node version used in development
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /var/www

# Copy Laravel application code
COPY . /var/www

# Install Node.js dependencies and build assets
RUN npm ci && npm run build

# Stage 2: Nginx production image
FROM nginx:alpine

# Copy custom Nginx configuration
# -----------------------------------------------------------
# Replace the default Nginx configuration with our custom one
# that is optimized for serving a Laravel application.
# -----------------------------------------------------------
COPY ./docker/production/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy Laravel's public assets from the builder stage
# -----------------------------------------------------------
# We only need the 'public' directory from our Laravel app.
# -----------------------------------------------------------
COPY --from=builder /var/www/public /var/www/public

# Set the working directory to the public folder
WORKDIR /var/www/public

# Expose port 80 and start Nginx
EXPOSE 1337
CMD ["nginx", "-g", "daemon off;"]
