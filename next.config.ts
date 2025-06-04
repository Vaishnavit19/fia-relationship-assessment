/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint configuration (from Next.js docs)
  eslint: {
    // Lint specific directories during production builds
    dirs: ['src', 'pages', 'app', 'components', 'lib'],
    // Set to true to disable linting during builds (not recommended)
    ignoreDuringBuilds: false,
  },

  // Enable experimental features for Next.js 15.3
  experimental: {
    // Optimize for modern browsers
    optimizePackageImports: ['lucide-react'],
    // Enable React 19 features
    reactCompiler: false, // Set to true if you want to try React Compiler
  },

  // Turbopack configuration (moved from experimental in 15.3)
  turbopack: {
    rules: {
      // Add any custom Turbopack rules here
    },
  },

  // SASS configuration
  sassOptions: {
    includePaths: ['./src/styles'],
    prependData: `@use "variables" as vars;`,
  },

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
