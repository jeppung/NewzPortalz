/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  env: {
    BASE_DB_URL: "https://newz-portalz-db.vercel.app",
    BASE_URL: "https://newz-portalz.vercel.app"
  }
}

module.exports = nextConfig
