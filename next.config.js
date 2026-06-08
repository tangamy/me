/** @type {import('next').NextConfig} */

// When served from a custom domain, GitHub Pages uses the repo root, so no
// basePath is needed. While using the default tangamy.github.io/me/ URL,
// basePath must match the repo name so assets resolve correctly.
// Remove basePath (and assetPrefix) once your custom domain is live.
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isCustomDomain ? '' : '/me',
  assetPrefix: isCustomDomain ? '' : '/me',
};

module.exports = nextConfig;
