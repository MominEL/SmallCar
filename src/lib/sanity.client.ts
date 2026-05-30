import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7w4qum7r";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
