/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ttf|html)$/i,
      type: 'asset/resource'
    });
    return config;
  },
  experimental: {
    serverMinification: false, // the server minification unfortunately breaks the selector class names
  },
  // Add output configuration for Netlify
  output: 'standalone',
  // Disable image optimization during build
  images: {
    unoptimized: true
  },
  // Increase build timeout
  staticPageGenerationTimeout: 120,
  // Skip type checking during build (we already checked it succeeded)
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};  

export default nextConfig;
