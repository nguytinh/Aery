/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['xsgames.co'], // Add allowed domains here
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
    serverExternalPackages: ["bcrypt"],
};


export default nextConfig
