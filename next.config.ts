import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Guestbook and Jukebox used to be separate pages; keep old links working.
  async redirects() {
    return [
      { source: "/guestbook", destination: "/#messages", permanent: true },
      { source: "/jukebox", destination: "/#songs", permanent: true },
    ];
  },
};

export default nextConfig;
