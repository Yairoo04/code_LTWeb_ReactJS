// const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

// function buildUrl(path: string) {
//   if (typeof window === 'undefined') {
//     return `${BASE}${path}`;   
//   }
//   return path.replace(/^\/api\//, '/_api/');
// }

// export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     ...init,
//     headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
//     cache: 'no-store',
//   });
//   if (!res.ok) throw new Error(`API ${path} ${res.status} ${res.statusText}`);
//   return res.json() as Promise<T>;
// }

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

function buildUrl(path: string) {
  if (typeof window === 'undefined') {
    return `${BASE}${path}`;   
  }
  return path.replace(/^\/api\//, '/_api/');
}

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    next: { revalidate: 300 }, 
  });
  if (!res.ok) throw new Error(`API ${path} ${res.status} ${res.statusText}`);
  console.log(`Fetched API: ${path}`);
  return res.json() as Promise<T>;
}

export const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(async (r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  });

export function buildClientUrl(path: string) {
  return path.replace(/^\/api\//, '/_api/');
}