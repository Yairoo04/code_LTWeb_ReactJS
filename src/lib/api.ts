// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

function buildUrl(path: string) {
  if (typeof window === 'undefined') {
    // Server Component / Route Handler
    return `${BASE}${path}`;        // ví dụ: http://localhost:4000/api/products
  }
  // Client Component
  return path.replace(/^\/api\//, '/_api/'); // /api/products -> /_api/products
}

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API ${path} ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
