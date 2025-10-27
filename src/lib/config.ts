export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === 'production'
    ? 'https://(backend-domain-sau-nay)'
    : 'http://localhost:4000');