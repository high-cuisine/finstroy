import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["undici"],
  transpilePackages: ["react-simple-maps", "@amcharts/amcharts4-geodata"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "wp.finstroi.com",
      },
      {
        protocol: "https",
        hostname: "finstroy-wp.razvit.tech",
      },
      {
        protocol: "https",
        hostname: "finstroy.razvit.tech",
      },
    ],
  },
};

export default nextConfig;
