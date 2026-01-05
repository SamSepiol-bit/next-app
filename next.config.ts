// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode (optional but recommended)
  reactStrictMode: true,
  
  // Configure the Image component
  images: {
    // List of allowed external image domains
    remotePatterns: [
      {
        protocol: 'https', // Only allow HTTPS (secure)
        hostname: 'ui-avatars.com', // Your avatar service
        pathname: '/api/**', // Allow all paths under /api/
      },
      {
        protocol: 'https',
        hostname: 'jobsformycv.enricharcane.info', // Your API domain
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: 'enricharcane.info', // Main domain
        pathname: '/**',
      },
    ],
    
    // Optional: Allow SVG images (ui-avatars.com might serve SVGs)
    dangerouslyAllowSVG: true,
    
    // Optional: Set content disposition
    contentDispositionType: 'attachment',
    
    // Optional: Content security policy
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Optional: Set image sizes for optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Optional: Custom loader if needed
    // loader: 'custom',
    // loaderFile: './app/image-loader.js',
  },
  
  // Optional: Other Next.js configurations
  // env: {
  //   NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // },
};

module.exports = nextConfig;