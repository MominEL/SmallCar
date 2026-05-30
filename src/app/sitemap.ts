import { MetadataRoute } from "next";
import { client } from "@/lib/sanity.client";
import { groq } from "next-sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smallcar.pms-motors.co.uk";

  // Fetch all car slugs and last update dates
  const cars = await client.fetch(groq`
    *[_type == "car" && !isSold] {
      slug,
      "updatedAt": _updatedAt
    }
  `);

  // Map cars to sitemap entries
  const carUrls = cars.map((car: any) => ({
    url: `${baseUrl}/showroom/${car.slug.current}`,
    lastModified: new Date(car.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Define static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/showroom`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...carUrls];
}
