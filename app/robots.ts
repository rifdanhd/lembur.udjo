import type { MetadataRoute } from "next";

const SITE_URL = "https://lemburudjoparahyangan.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/cms", "/api", "/sketchbook"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
