import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Allow dev HMR / turbopack when opening the site from another device on the LAN (e.g. phone). Add your PC’s LAN IP if it changes. */
  allowedDevOrigins: ["192.168.4.58", "localhost", "127.0.0.1"],
};

export default nextConfig;
