/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  allowedDevOrigins: ['10.34.143.27'],

  images: {
    qualities: [75, 80,85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
    ],
  },
  experimental: {
    
  },
};

export default nextConfig;