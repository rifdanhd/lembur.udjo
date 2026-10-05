import type { MetadataRoute } from "next";

const SITE_URL = "https://lemburudjoparahyangan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/the-story-of-angklung`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/inovasi`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
