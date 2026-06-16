import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/catalog";
import { storeConfig } from "@/lib/storeConfig";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  const staticRoutes = [
    "",
    "/categories",
    "/offers",
    "/search",
    "/cart",
    "/checkout",
    "/contact",
    "/shipping-policy",
    "/returns-policy",
    "/privacy-policy",
    "/terms",
  ];

  return [
    ...staticRoutes.map((route) => ({
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: route === "" ? 1 : 0.7,
      url: `${storeConfig.siteUrl}${route}`,
    })),
    ...categories.map((category) => ({
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: 0.8,
      url: `${storeConfig.siteUrl}/category/${category.slug}`,
    })),
    ...products.map((product) => ({
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: 0.9,
      url: `${storeConfig.siteUrl}/product/${product.slug}`,
    })),
  ];
}
