# ToDoList App

A todo-list app with a Laravel API backend and an Expo (React Native) frontend.

| Folder | What it is |
| --- | --- |
| `backend/` | Laravel 13 JSON API (`/api/todo-lists`), PostgreSQL on Supabase, deployed to Vercel as a container (FrankenPHP) |
| `ToDoList/` | Expo app (iOS, Android, web). See [`ToDoList/README.md`](ToDoList/README.md) |

## Prerequisites

| Tool | Version | Used for |
| --- | --- | --- |
| PHP | 8.3+ (8.4 recommended, e.g. via [Laravel Herd](https://herd.laravel.com)) | Running Laravel locally |
| Composer | 2.x | PHP dependencies |
| Node.js | 24 LTS (`nvm use 24`) | Vite assets, Expo, Vercel CLI |
| Docker Desktop | running | Building and testing the production container |
| Vercel CLI | 64+ (`npm install -g vercel@latest`) | Deploying and local container testing |
| Supabase project | — | PostgreSQL database |

Node 26 works, but `npm install -g vercel` prints a harmless `EBADENGINE` warning there ([vercel/vercel#17526](https://github.com/vercel/vercel/issues/17526)). Node 24 avoids it.

## Supabase connection

The backend connects to Supabase PostgreSQL with a single `DB_URL` and keeps its tables in a dedicated `laravel` schema (`search_path` in `backend/config/database.php`).

1. **Create the schema once.** In the Supabase dashboard, open **SQL Editor** and run:

   ```sql
   create schema if not exists laravel;
   ```

   Without it, `php artisan migrate` fails because Postgres has no schema to create the tables in.

2. **Copy the connection string.** In Supabase, click **Connect** and copy the **Session pooler** URI. It has this shape:

   ```
   postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@[POOLER-HOST]:5432/postgres
   ```

   Use the session pooler (port `5432`). It works over IPv4 and supports the prepared statements Laravel uses. The transaction pooler (port `6543`) does not support prepared statements.

3. **Put it in `backend/.env`:**

   ```dotenv
   DB_CONNECTION=pgsql
   DB_URL=postgres://postgres.abcdefghijkl:your-password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```

   If the password contains special characters (`@`, `:`, `/`, `#`), URL-encode them.

## Dependency installation

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Fill in `DB_URL` in `.env` (see [Supabase connection](#supabase-connection)), then create the tables:

```bash
php artisan migrate
```

Frontend build tools for the Laravel views:

```bash
npm install
```

`composer run setup` runs all of the above in one go (install, copy `.env`, generate the key, migrate, `npm install`, `npm run build`). Set `DB_URL` before running it, since it migrates.

Never commit `.env` or `.env.local`; both contain secrets.

## Development server

From `backend/`:

```bash
composer run dev
```

This runs `php artisan dev`, which starts the Laravel server and Vite together. For the API alone, `php artisan serve` is enough.

Check it works:

```bash
curl http://localhost:8000/health
# {"status":"ok"}

curl http://localhost:8000/api/todo-lists
# [] or your lists
```

Run the tests:

```bash
php artisan test --compact
```

Tests use an in-memory SQLite database (`phpunit.xml`), not Supabase.

## Vercel local deployment test (Docker image)

Vercel runs the backend as a container built from `backend/Dockerfile.vercel` (FrankenPHP + `Caddyfile`), configured in `backend/vercel.json`. The container runs in production mode (`APP_ENV=production`, `APP_DEBUG=false`) with array session and cache drivers, so it only needs `APP_KEY` and the database settings.

### Option A: Vercel's local container runtime

```bash
cd backend
set -a
source .env
set +a
vercel dev -L --listen 8080
```

`-L` does not read `.env` by itself, so the `source` step exports the variables into the shell first.

Known issue: with Vercel CLI 64.2.0 this can fail after the image builds with `[DEV_SERVICE_START_FAILED] No dev server available for service "app"`. Running with `--debug` shows `spawn EBADF`: the CLI fails to launch `docker run`, while the image itself is fine. Use option B until it is fixed.

### Option B: plain Docker (same image)

```bash
cd backend
docker build -f Dockerfile.vercel -t todo-api .

docker run --rm -p 8080:80 \
  -e APP_KEY="$(grep '^APP_KEY=' .env | cut -d= -f2-)" \
  -e DB_CONNECTION=pgsql \
  -e DB_URL="$(grep '^DB_URL=' .env | cut -d= -f2-)" \
  todo-api
```

In another terminal:

```bash
curl http://localhost:8080/health          # {"status":"ok"}
curl http://localhost:8080/up              # Laravel's built-in health page, 200
curl http://localhost:8080/api/todo-lists  # data from Supabase
```

Stop it with `Ctrl+C`.

### Deploying to Vercel

Set the secrets on the Vercel project once (from `backend/`):

```bash
vercel env add APP_KEY
vercel env add DB_CONNECTION   # pgsql
vercel env add DB_URL          # the Supabase session pooler URI
```

Then deploy:

```bash
vercel deploy          # preview
vercel deploy --prod   # production
```

Redeploy after changing environment variables.

## Frontend

```bash
cd ToDoList
npm install
npx expo start
```

See [`ToDoList/README.md`](ToDoList/README.md) for simulators and devices.
