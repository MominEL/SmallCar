import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { cloudinarySchemaPlugin } from "sanity-plugin-cloudinary";
import { schemaTypes } from "./schemas";
import { myTheme } from "./theme";
import { Logo } from "./components/Logo";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7w4qum7r";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  basePath: "/studio",
  name: "smallcar-studio",
  title: "SmallCar Admin",
  projectId,
  dataset,
  theme: myTheme,
  studio: {
    components: {
      logo: Logo,
    },
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Dashboard")
          .items([
            // Site Settings singleton
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .icon(() => "⚙️")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings")
              ),
            S.divider(),
            // Car views
            S.listItem()
              .title("Available Cars")
              .icon(() => "🟢")
              .child(
                S.documentList()
                  .title("Available Cars")
                  .filter('_type == "car" && (isSold != true || !defined(isSold))')
              ),
            S.listItem()
              .title("Sold Cars")
              .icon(() => "🔴")
              .child(
                S.documentList()
                  .title("Sold Cars")
                  .filter('_type == "car" && isSold == true')
              ),
            S.listItem()
              .title("Featured & Editor's Picks")
              .icon(() => "⭐")
              .child(
                S.documentList()
                  .title("Featured Cars")
                  .filter('_type == "car" && (isEditorPick == true || isFeatured == true)')
              ),
            S.listItem()
              .title("All Cars (Master)")
              .icon(() => "🚘")
              .child(S.documentTypeList("car").title("All Cars")),
            S.divider(),
            S.documentTypeListItem("teamMember").title("Team Members").icon(() => "👥"),
            S.documentTypeListItem("galleryImage").title("Gallery").icon(() => "📷"),
          ]),
    }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    cloudinarySchemaPlugin(),
  ],
  schema: {
    types: schemaTypes,
  },
});
