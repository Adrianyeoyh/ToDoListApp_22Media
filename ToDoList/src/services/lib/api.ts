import type { ApiErrorBody } from './types';

const FALLBACK_URL = 'https://localhost:8000'
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? FALLBACK_URL;

export class ApiError extends Error {
  constructor(public status: number, public body: ApiErrorBody) {
    super(body.message);
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json', 
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

//   if (response.status === 204) {
//     return undefined as T;  
//   }

  const body = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, body); 
  }

  return body as T;
}