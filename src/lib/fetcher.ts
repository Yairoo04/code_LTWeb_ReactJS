export const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(async (r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  });

export function buildClientUrl(path: string) {
  // /api/products -> /_api/products (đi qua proxy, tránh CORS + OPTIONS)
  return path.replace(/^\/api\//, '/_api/');
}
