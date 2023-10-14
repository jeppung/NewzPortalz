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
  }
}

module.exports = nextConfig
