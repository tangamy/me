/** @type {import('next').NextConfig} */

// When served from a custom domain, GitHub Pages uses the repo root, so no
// basePath is needed. While using the default tangamy.github.io/me/ URL,
// basePath must match the repo name so assets resolve correctly.
// Remove basePath (and assetPrefix) once your custom domain is live.
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true';
const basePath = isCustomDomain ? '' : '/me';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  // next/image doesn't prepend basePath to raw <img src> when unoptimized,
  // so expose it for components to prefix public/ asset paths manually.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

module.exports = nextConfig;
