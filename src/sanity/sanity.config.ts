import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { cloudinarySchemaPlugin } from "sanity-plugin-cloudinary";
import { schemaTypes } from "./schemas";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7w4qum7r";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  basePath: "/studio",
  name: "smallcar-studio",
  title: "SmallCar Admin",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Site Settings singleton
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings")
              ),
            S.divider(),
            // Car listings
            S.documentTypeListItem("car").title("Car Listings"),
            S.documentTypeListItem("teamMember").title("Team Members"),
            S.documentTypeListItem("galleryImage").title("Gallery"),
          ]),
    }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    cloudinarySchemaPlugin(),
  ],
  schema: {
    types: schemaTypes,
  },
});
