// config.ts

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === 'production'
    ? 'https://your-backend-domain' // TODO: đổi khi deploy
    : 'http://localhost:4000');
