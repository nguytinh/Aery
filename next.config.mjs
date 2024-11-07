/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
      optimizePackageImports: ["@chakra-ui/react"],
    },
    serverExternalPackages: ["bcrypt"],
  }

export default nextConfig
