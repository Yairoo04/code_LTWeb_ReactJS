// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   async rewrites() {
//     return [
//       { source: '/_api/:path*', destination: 'http://localhost:4000/api/:path*' },
//     ];
//   },
// };
// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*' // URL backend của bạn
      }
    ];
  },
};

export default nextConfig;