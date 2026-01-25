import type { NextConfig } from "next";

const nextConfig: NextConfig = { 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Profile Image domain
        port: '',
        pathname: '/**',
      },
    ],
  },
};



export default nextConfig;
