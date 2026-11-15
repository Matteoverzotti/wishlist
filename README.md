# Christmas Wishlist

Laravel, Inertia, and React wishlist application. Development and production run in Docker with a SQLite database.

## Development setup

Docker with Compose is required. All PHP, Composer, Node, and npm commands below run inside containers.

1. Create `.env` from `.env.example`. Set `UID` and `GID` to the output of `id -u` and `id -g`, and set `WISHLIST_ACCESS_PASSWORD` to the password visitors should use.

   ```sh
   cp .env.example .env
   ```

2. Build the images and install dependencies in the workspace container. The workspace mounts the project directory, so dependencies remain available to the PHP-FPM container.

   ```sh
   docker compose -f compose.dev.yaml build
   docker compose -f compose.dev.yaml run --rm workspace composer install
   docker compose -f compose.dev.yaml run --rm workspace bash -c '. ~/.nvm/nvm.sh && npm ci'
   ```

3. Create the application key and SQLite database, then run migrations. The SQLite file is stored at `database/database.sqlite` in the project directory and is ignored by Git.

   ```sh
   docker compose -f compose.dev.yaml run --rm workspace php artisan key:generate
   docker compose -f compose.dev.yaml run --rm workspace touch database/database.sqlite
   docker compose -f compose.dev.yaml run --rm workspace php artisan migrate
   ```

4. Start the application and Vite. Keep the Vite command running in a separate terminal.

   ```sh
   docker compose -f compose.dev.yaml up -d
   docker compose -f compose.dev.yaml exec workspace bash -c '. ~/.nvm/nvm.sh && npm run dev'
   ```

Open <http://localhost>. Check the database and writable storage at <http://localhost/health>. Stop containers with `docker compose -f compose.dev.yaml down`; the SQLite file remains in the project directory.

Run the tests and a production asset build in the workspace container:

```sh
docker compose -f compose.dev.yaml run --rm -e APP_ENV=testing -e SESSION_DRIVER=array workspace php artisan test
docker compose -f compose.dev.yaml exec workspace bash -c '. ~/.nvm/nvm.sh && npm run build'
```

## Production deployment

For the first deployment, create `.env` from `.env.example`. Keep `DB_CONNECTION=sqlite`; set `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, and `WISHLIST_ACCESS_PASSWORD`. Build the production images, generate an application key inside the CLI container, and copy its output into `APP_KEY` in `.env`. Keep that key for future deployments. The PHP-FPM entrypoint creates the SQLite file and runs migrations on startup.

```sh
test -f .env || cp .env.example .env
docker compose -f compose.prod.yaml build
docker compose -f compose.prod.yaml run --rm --no-deps --entrypoint php php-cli artisan key:generate --show
docker compose -f compose.prod.yaml up -d
```

For later deployments, keep the existing `.env` and run `docker compose -f compose.prod.yaml up -d --build`.

The production SQLite database is stored in the `laravel-database-production` volume, shared by PHP-FPM and the CLI container. Application storage uses a separate persistent volume. Both volumes survive `docker compose -f compose.prod.yaml down` and container rebuilds. **Do not use `down -v` unless you intend to delete the wishlist data.** Back up the SQLite volume before replacing the host or removing volumes.

The application is served on port 1337 by default; set `NGINX_PORT` in `.env` to change the host port. Verify startup with `curl http://localhost:1337/health` and open `http://localhost:1337/` to reach the access page. Inspect logs with `docker compose -f compose.prod.yaml logs -f`.
