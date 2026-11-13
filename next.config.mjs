/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep a local production build from overwriting a running dev server.
  // Vercel's Next.js builder only looks in `.next`.
  distDir: process.env.VERCEL
    ? '.next'
    : process.env.NODE_ENV === 'production'
      ? '.next-production'
      : '.next',
}

export default nextConfig
