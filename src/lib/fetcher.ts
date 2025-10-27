export const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(async (r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  });

export function buildClientUrl(path: string) {
  return path.replace(/^\/api\//, '/_api/');
}