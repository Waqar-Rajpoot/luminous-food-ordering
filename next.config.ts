// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Configure External Image Providers
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // For Cloudinary
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",    // For ImageKit
        pathname: "/**",
      },
    ],
  },

  // 2. Enable React Compiler (Stable in v16)
  // This automatically optimizes re-renders without needing useMemo/useCallback
  reactCompiler: true,

  // 3. Optional: Experimental features for even faster builds
  experimental: {
    // Enables the new FileSystem Cache for faster dev starts
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;