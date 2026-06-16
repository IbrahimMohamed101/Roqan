import type { MetadataRoute } from "next";
import { storeConfig } from "@/lib/storeConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: "/dashboard",
      userAgent: "*",
    },
    sitemap: `${storeConfig.siteUrl}/sitemap.xml`,
  };
}
