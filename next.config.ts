import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: 'export',
      basePath: '/daniels-barber-lavras',
      assetPrefix: '/daniels-barber-lavras',
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
