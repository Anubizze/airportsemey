/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.akorda.kz' },
      { protocol: 'https', hostname: 'akorda.kz' },
      { protocol: 'https', hostname: 'static.akorda.kz' },
      { protocol: 'https', hostname: 'www.gov.kz' },
      { protocol: 'https', hostname: 'gov.kz' },
      { protocol: 'https', hostname: 'static.maps.2gis.com' },
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/uploads/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '4000', pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
