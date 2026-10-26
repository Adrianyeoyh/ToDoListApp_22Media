import type { ApiErrorBody } from './types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public status: number, public body: ApiErrorBody) {
    super(body.message);
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new ApiError(0, { message: 'Could not reach the server.' }); 
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }

  return body as T;
}

// Status 0 means the request never reached the server (offline, server down, timed out).
export const isNetworkError = (e: unknown): e is ApiError => e instanceof ApiError && e.status === 0;
