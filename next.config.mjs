/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'ui.aceternity.com',
            port: '',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'assets.aceternity.com',
            port: '',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'upload.wikimedia.org',
            port: '',
            pathname: '**',
          },
        ],
      },
      output: "export",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
