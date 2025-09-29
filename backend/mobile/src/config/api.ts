import Constants from 'expo-constants';

type Extra = { apiUrl?: string };

const extra = (Constants.expoConfig?.extra || {}) as Extra;

export const API_URL = extra.apiUrl || 'http://localhost:4000';

let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
