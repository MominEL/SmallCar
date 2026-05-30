import { Metadata } from "next";
import { client } from "@/lib/sanity.client";
import { galleryImagesQuery } from "@/lib/sanity.queries";
import { GalleryClient } from "@/components/Gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A look inside the SmallCar showroom and our latest arrivals.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await client.fetch(galleryImagesQuery);

  return <GalleryClient initialImages={images} />;
}
