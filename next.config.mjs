/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4700",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.bata.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/Ayan7949/image/refs/heads/main/images/**",
      },
    ],
  },
};

export default nextConfig;
