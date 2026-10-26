import { request } from "./utils/api";

const PING_TIMEOUT_MS = 5000;

export const getHealth = (signal?: AbortSignal) => request<{ status: string }>("/api/health", { signal });

export async function isServerReachable(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  try {
    await getHealth(controller.signal);
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
