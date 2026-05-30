import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — only one document of this type
  fields: [
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: 'e.g. "+44 1234 567890"',
      initialValue: "+44 XXXX XXXXXX",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
      description: 'International format, e.g. "441234567890"',
      initialValue: "+44 XXXX XXXXXX",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      initialValue: "hello@smallcar.co.uk",
    }),
    defineField({
      name: "address",
      title: "Full Address",
      type: "text",
      rows: 3,
      initialValue: "Virginia Water, Surrey, GU25",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps URL",
      type: "url",
      description: "Embed URL for the Google Maps iframe on the Contact page",
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "day", title: "Day", type: "string" },
            { name: "hours", title: "Hours", type: "string" },
          ],
          preview: {
            select: { title: "day", subtitle: "hours" },
          },
        },
      ],
    }),
    defineField({
      name: "carCount",
      title: "Cars in Stock (stat)",
      type: "number",
      initialValue: 20,
    }),
    defineField({
      name: "yearsTrading",
      title: "Years Trading (stat)",
      type: "number",
      initialValue: 1,
    }),
    defineField({
      name: "googleRating",
      title: "Google Rating (stat)",
      type: "string",
      initialValue: "5.0",
      description: "Google review rating, e.g. 5.0",
    }),
    defineField({
      name: "reviewCount",
      title: "Google Review Count",
      type: "number",
      initialValue: 194,
    }),
    defineField({
      name: "responseTime",
      title: "Response Time (stat text)",
      type: "string",
      initialValue: "Same day",
    }),
    defineField({
      name: "foundedYear",
      title: "Founded Year",
      type: "number",
      initialValue: 2024,
    }),
    defineField({
      name: "aboutStory",
      title: "About Page — Story Content",
      type: "array",
      of: [{ type: "block" }],
      description: "The origin story shown on the About page",
    }),
    defineField({
      name: "footerText",
      title: "Footer Additional Text",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
