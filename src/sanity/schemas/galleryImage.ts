import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "cloudinary.asset",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption shown below the image",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Showroom", value: "showroom" },
          { title: "Event", value: "event" },
          { title: "Car", value: "car" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Event Date",
      type: "date",
      description: "Only needed for event photos",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "caption",
      subtitle: "category",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled",
        subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : "",
        media,
      };
    },
  },
});
