# ToDoList (frontend)

Expo SDK 57 app for the ToDoList API, using Expo Router, NativeWind (Tailwind) and React Native Reusables. It works offline: when the API can't be reached, changes are saved on the device and synced to the cloud later.

Backend setup and the full local-running guide are in the [root README](../README.md).

## Setup

```bash
npm install
cp .env.example .env
```

Set the API address in `.env`:

```dotenv
EXPO_PUBLIC_API_URL = 'http://10.0.2.2:8003'
```

| API runs on | App runs on | Value |
| --- | --- | --- |
| `php artisan serve --port=8003` | Android emulator | `http://10.0.2.2:8003` |
| `php artisan serve --port=8003` | iOS simulator or web | `http://127.0.0.1:8003` |
| Herd (with a default site) | Android emulator | `http://10.0.2.2` |
| `herd share` | Anywhere | the Expose URL, e.g. `https://abc123.sharedwithexpose.com` |

The emulator reaches your Mac at `10.0.2.2`, not `localhost`. See [Point the app at the API](../README.md#point-the-app-at-the-api) and [Share the backend publicly](../README.md#share-the-backend-publicly-with-herd-share) for details.

`EXPO_PUBLIC_*` values are baked into the bundle at build time, so restart Metro with `--clear` after editing `.env`.

## Running

The app uses native modules (`react-native-svg`, `react-native-gesture-handler`, `react-native-reanimated`), so it needs a development build rather than Expo Go. Build and install it once (and again after adding a package with native code):

```bash
npx expo run:android
```

Then start Metro and open the app:

```bash
adb reverse tcp:8083 tcp:8083
npx expo start --localhost --port 8083
```

Press `a` to open it on the emulator, `r` to reload.

`--localhost` with `adb reverse` avoids the app trying an old Wi-Fi IP; port `8083` avoids clashes with Docker on `8081`.

## Offline mode

The app pings `GET /api/health` every 30 seconds (every 10 seconds while the server is down).

| State | What you see | What happens |
| --- | --- | --- |
| Server down | "Couldn't connect to server" banner on the home screen; "Saved Locally" and a cloud button next to the title | Reads come from the device copy; creates, edits and deletes apply on the device and are queued |
| Server back, changes queued | "Saved Locally" and the cloud button | Still working locally until you sync, so queued changes keep their order |
| Synced | "Saved on Cloud" | Requests go straight to the API and the device copy is refreshed |

Pressing the cloud button sends the queued changes oldest first, then compares the device copy with the cloud copy:

- **Equal:** backed up; status becomes "Saved on Cloud".
- **Device ahead** (changes still queued because the connection dropped): retries automatically every 30 seconds until they match.
- **Cloud ahead** (nothing left to send): the cloud copy replaces the device copy.

Requests that never reach the server don't show the error popup; real errors (validation, 404, 500) still do. Items created offline get a temporary negative id until the server assigns a real one. The device copy and queue are JSON files in the app's documents folder, so they survive restarts.

To try it: stop the API (`Ctrl+C` on `php artisan serve`, or `herd stop`), make some changes, start it again and press the cloud button.

## Project structure

```
src/
├── app/                      Screens (Expo Router)
│   ├── _layout.tsx           Providers, gesture root, health pinging
│   ├── index.tsx             "My Lists" home screen
│   └── [id].tsx              One list and its todos
├── components/
│   ├── feedback/             ErrorModalProvider (global error popup)
│   ├── menu/                 Home screen: list cards, create/rename/delete modals
│   ├── toDoList/             List screen: todo item, create modal
│   ├── sync/                 OfflineBanner, SyncStatus (Saved Locally / Saved on Cloud)
│   └── ui/                   React Native Reusables primitives
├── repositories/             Offline-first data access used by components
│                             (same functions as services, with local fallback)
├── services/
│   ├── ToDoListService.ts    Raw API calls
│   ├── ToDoService.ts
│   ├── health.ts             /api/health ping
│   ├── offline/              Device copy, queue, sync, status store
│   └── utils/                request() wrapper, ApiError, types
├── hooks/                    use-sync-status, use-server-health, theme hooks
└── lib/                      Date formatting, cn() helper
```

Components call `repositories/`, which call `services/` when the server is reachable and fall back to `services/offline/` when it isn't.

## Checks

```bash
npx tsc --noEmit
npx expo lint
```

## Troubleshooting

| Problem | Fix |
| --- | --- |
| "Unable to load script" / Metro not running | Start Metro with `--localhost --port 8083`, run `adb reverse tcp:8083 tcp:8083`, then press `a` |
| App connects to an old IP (e.g. `172.20.10.2`) | `adb shell pm clear com.adrianyeo.ToDoList`, then reopen with `a` |
| `RNSVG...ViewManager` / native module missing | Rebuild the dev client: `npx expo run:android` |
| App still uses an old API URL | Restart Metro with `--clear` |
| Banner shows but the API is running | Check `curl <EXPO_PUBLIC_API_URL>/api/health` from your Mac; for the emulator, swap `10.0.2.2` for `127.0.0.1` |
