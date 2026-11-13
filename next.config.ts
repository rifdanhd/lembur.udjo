import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { tsconfigPath: process.env.LUP_TEST_DIST_DIR ? "tsconfig.booking-tests.json" : "tsconfig.json" },
  distDir: process.env.LUP_TEST_DIST_DIR || ".next",
  serverExternalPackages: ["pdfkit", "qrcode"],
};

export default withPayload(nextConfig);
