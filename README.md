# ToDoList App

A todo-list app with a Laravel API backend and an Expo (React Native) frontend. The app keeps working when the API is down: changes are saved on the device and synced to the cloud when the server is back.

| Folder | What it is | Docs |
| --- | --- | --- |
| `backend/` | Laravel 13 JSON API on PostgreSQL (Supabase) | [`backend/README.md`](backend/README.md) |
| `ToDoList/` | Expo app (Android, iOS, web) | [`ToDoList/README.md`](ToDoList/README.md) |

## Prerequisites

| Tool | Version | Used for |
| --- | --- | --- |
| PHP | 8.3+ (patched release: 8.5.12, 8.4.27 or 8.3.36 or newer) | Running Laravel |
| Composer | 2.x | PHP dependencies |
| [Laravel Herd](https://herd.laravel.com) | latest (optional) | PHP, Composer and an always-on local server in one install |
| Node.js | 24 LTS or newer | Expo and Vite |
| Android Studio | with an emulator | Running the app on Android |
| Supabase project | — | PostgreSQL database |

Herd installs PHP and Composer for you. Keep PHP patched: in Herd, run `herd php:update all`, then `herd restart`.

## Installation

### 1. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Fill in `DB_URL` in `backend/.env` with your Supabase connection string (see [Supabase connection](backend/README.md#supabase-connection)), then create the tables:

```bash
php artisan migrate
```

### 2. Frontend

```bash
cd ToDoList
npm install
cp .env.example .env
```

Set `EXPO_PUBLIC_API_URL` in `ToDoList/.env` to where the API runs (see [Point the app at the API](#point-the-app-at-the-api)).

The app uses native modules (`react-native-svg`, gesture handler, reanimated), so it runs in a development build, not Expo Go. Build and install it on the emulator once:

```bash
npx expo run:android
```

Rebuild only after adding a package with native code.

Never commit `.env` files; they contain secrets.

## Running locally

There are two ways to serve the API on your Mac. Both run the same code against the same database; pick one.

### Option A: `php artisan serve`

```bash
cd backend
php artisan serve --port=8003
```

The API is at `http://127.0.0.1:8003`. It runs only while the terminal is open; stop it with `Ctrl+C`. Any free port works (`8000` is the default; this project uses `8003` because Docker often holds `8000`).

### Option B: Laravel Herd (`.test` domain)

```bash
cd backend
herd link todolist     # once: serves this folder as todolist.test
herd secure todolist   # optional: HTTPS
herd start             # if Herd's services are stopped
```

The API is at `https://todolist.test` (or `http://todolist.test`). Herd runs nginx and PHP-FPM in the background, so the API is always up while Herd is running; there is no terminal to keep open.

### Which one?

| | `php artisan serve` | Herd |
| --- | --- | --- |
| Server | PHP's built-in dev server, one request at a time | nginx + PHP-FPM, like production |
| Lifetime | While the terminal is open | Always on while Herd runs |
| Address | `http://127.0.0.1:<port>` | `https://todolist.test` |
| Android emulator | Works directly (`http://10.0.2.2:8003`) | Needs a default site (below) or `herd share` |
| Testing offline mode | `Ctrl+C` to take the API down | `herd stop` / `herd start` |

### Check the API

```bash
curl http://127.0.0.1:8003/api/health   # or https://todolist.test/api/health
# {"status":"ok"}   (503 {"status":"unavailable"} if the database can't be reached)

curl http://127.0.0.1:8003/api/todo-lists
# [] or your lists
```

## Point the app at the API

The app reads the API address from `EXPO_PUBLIC_API_URL` in `ToDoList/.env`. The Android emulator reaches your Mac at `10.0.2.2`, not `localhost`.

| Where the API runs | Where the app runs | `EXPO_PUBLIC_API_URL` |
| --- | --- | --- |
| `php artisan serve --port=8003` | Android emulator | `http://10.0.2.2:8003` |
| `php artisan serve --port=8003` | iOS simulator or web | `http://127.0.0.1:8003` |
| `php artisan serve --host=0.0.0.0 --port=8003` | Phone on the same Wi-Fi | `http://<your Mac's LAN IP>:8003` |
| Herd with a default site (below) | Android emulator | `http://10.0.2.2` |
| Herd | iOS simulator or web | `http://todolist.test` |
| `herd share` | Anywhere | the Expose URL, e.g. `https://abc123.sharedwithexpose.com` |

`EXPO_PUBLIC_*` values are baked into the JavaScript bundle, so after changing `.env` restart Metro with `--clear`:

```bash
npx expo start --localhost --port 8083 --clear
```

### Herd and the Android emulator

The emulator can't resolve `todolist.test`, and Herd answers requests for `10.0.2.2` with a 404 because it doesn't know that host. Tell Herd to serve the backend for any unknown host by adding a `default` entry to `~/Library/Application Support/Herd/config/valet/config.json`:

```json
{
    "default": "/absolute/path/to/ToDoListApp_22Media/backend"
}
```

Keep the other keys in that file as they are, then run `herd restart` and check:

```bash
curl -H 'Host: 10.0.2.2' http://127.0.0.1/api/health   # {"status":"ok"}
```

## Share the backend publicly with `herd share`

`herd share` opens an [Expose](https://expose.dev) tunnel so anyone (a physical phone on mobile data, a teammate, a tester) can reach your local API over HTTPS.

1. Add your Expose token once: create a free account at [expose.dev](https://expose.dev), then paste the token in **Herd → Settings → Expose**.
2. Share the site:

   ```bash
   cd backend
   herd share
   ```

   It prints a public URL such as `https://abc123.sharedwithexpose.com`. `herd fetch-share-url` prints it again.
3. Point the app at it in `ToDoList/.env`:

   ```dotenv
   EXPO_PUBLIC_API_URL = 'https://abc123.sharedwithexpose.com'
   ```

4. Restart Metro with `npx expo start --localhost --port 8083 --clear`.

The tunnel lasts while `herd share` runs, and free URLs change each time, so repeat steps 3–4 after each new share. Switch `EXPO_PUBLIC_API_URL` back to your local address when you stop sharing.

The API has no authentication, so anyone with the URL can read and change your lists. Set `APP_DEBUG=false` in `backend/.env` while sharing so errors don't expose stack traces, and stop sharing (`Ctrl+C`) when you're done.

## Run the app

With the API running and the development build installed:

```bash
cd ToDoList
adb reverse tcp:8083 tcp:8083
npx expo start --localhost --port 8083
```

Press `a` to open it on the Android emulator. See [`ToDoList/README.md`](ToDoList/README.md) for offline mode and troubleshooting.

## Tests and checks

```bash
cd backend && php artisan test --compact     # Pest, in-memory SQLite (never touches Supabase)
cd ToDoList && npx tsc --noEmit && npx expo lint
```
