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
    BASE_DB_URL: process.env.BASE_DB_URL,
    BASE_URL: process.env.BASE_URL
  }
}

module.exports = nextConfig
