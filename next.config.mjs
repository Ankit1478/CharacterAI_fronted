/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['characterai.io','via.placeholder.com',"images.remotePatterns"],  // Add 'characterai.io' to the list of allowed domains
      },
};

export default nextConfig;
