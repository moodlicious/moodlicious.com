import type { NextConfig } from "next";
import nextra from "nextra";

const nextConfig: NextConfig = {
    /* config options here */
};

// Set up Nextra with its configuration
const withNextra = nextra({});

// Export the final Next.js config with Nextra included
export default withNextra(nextConfig);
