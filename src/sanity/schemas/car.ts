import { defineField, defineType } from "sanity";

import { generateSlug, generateCarTitle } from "../../lib/titleSystem";

export const car = defineType({
  name: "car",
  title: "Car",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { 
        source: (doc) => generateSlug(doc as any),
        maxLength: 96 
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "make",
      title: "Make",
      type: "string",
      options: {
        list: [
          "Abarth", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", 
          "Bentley", "BMW", "Bugatti", "Buick", "Cadillac", "Chevrolet", 
          "Chrysler", "Citroën", "Cupra", "Dacia", "Daewoo", "Daihatsu", 
          "Dodge", "DS Automobiles", "Ferrari", "Fiat", "Fisker", "Ford", 
          "Genesis", "GMC", "Honda", "Hummer", "Hyundai", "Infiniti", 
          "Isuzu", "Iveco", "Jaguar", "Jeep", "Kia", "Koenigsegg", 
          "Lada", "Lamborghini", "Lancia", "Land Rover", "Lexus", 
          "Lincoln", "Lotus", "Maserati", "Maybach", "Mazda", "McLaren", 
          "Mercedes-Benz", "MG", "MINI", "Mitsubishi", "Morgan", "Nissan", 
          "Opel", "Pagani", "Peugeot", "Polestar", "Porsche", "Renault", 
          "Rolls-Royce", "Rover", "Saab", "SEAT", "Skoda", "Smart", 
          "SsangYong", "Subaru", "Suzuki", "Tesla", "Toyota", "Vauxhall", 
          "Volkswagen", "Volvo", "Other"
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customMake",
      title: "Custom Make",
      type: "string",
      description: "Please type the car make since you selected 'Other'",
      hidden: ({ document }) => document?.make !== "Other",
      validation: (rule) => 
        rule.custom((value, context) => {
          if (context.document?.make === "Other" && !value) {
            return "Custom make is required when 'Other' is selected";
          }
          return true;
        }),
    }),
    defineField({
      name: "model",
      title: "Model",
      type: "string",
      description: 'e.g. "Cooper S", "500", "Polo"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Variant / Trim",
      type: "string",
      description: 'e.g. "Resolute Edition", "Dolcevita", "GTI"',
    }),
    defineField({
      name: "bodyType",
      title: "Body Type",
      type: "string",
      options: {
        list: [
          "Hatchback",
          "Convertible",
          "Coupe",
          "Estate",
          "Saloon",
          "SUV",
          "Other",
        ],
      },
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description: "Optional promotional badge shown on the listing card",
      options: {
        list: [
          { title: "Editor's pick", value: "editors-pick" },
          { title: "New in", value: "new-in" },
          { title: "Low miles", value: "low-miles" },
          { title: "Popular", value: "popular" },
          { title: "Reduced", value: "reduced" },
          { title: "Just in", value: "just-in" },
        ],
      },
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [{ type: "cloudinary.asset" }],
      validation: (rule) => rule.max(10),
      description: "Up to 10 photos. First photo is the main image.",
    }),
    defineField({
      name: "year",
      title: "Registration Year",
      type: "number",
      validation: (rule) => rule.required().min(1990).max(2030),
    }),
    defineField({
      name: "mileage",
      title: "Mileage",
      type: "number",
      description: "Stored as number — displayed with comma separator",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "price",
      title: "Price (£)",
      type: "number",
      description: "Stored as number — displayed with £ and commas",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "gearbox",
      title: "Gearbox",
      type: "string",
      options: {
        list: ["Manual", "Auto", "DSG", "CVT"],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "colour",
      title: "Colour",
      type: "string",
    }),
    defineField({
      name: "engine",
      title: "Engine",
      type: "string",
      description: 'e.g. "2.0T TwinPower"',
    }),
    defineField({
      name: "bhp",
      title: "Power (bhp)",
      type: "number",
    }),
    defineField({
      name: "zeroToSixty",
      title: "0–60 mph",
      type: "string",
      description: 'e.g. "6.7 seconds"',
    }),
    defineField({
      name: "topSpeed",
      title: "Top Speed",
      type: "string",
      description: 'e.g. "140 mph"',
    }),
    defineField({
      name: "interior",
      title: "Interior",
      type: "string",
      description: 'e.g. "Black leather sport seats"',
    }),
    defineField({
      name: "fuelType",
      title: "Fuel Type",
      type: "string",
      options: {
        list: ["Petrol", "Diesel", "Hybrid", "Electric"],
      },
    }),
    defineField({
      name: "economy",
      title: "Fuel Economy",
      type: "string",
      description: 'e.g. "42.2 mpg combined"',
    }),
    defineField({
      name: "motExpiry",
      title: "MOT Expiry",
      type: "date",
    }),
    defineField({
      name: "owners",
      title: "Previous Owners",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "serviceHistory",
      title: "Service History",
      type: "string",
      description: 'e.g. "Full MINI service history"',
    }),
    defineField({
      name: "hpiClear",
      title: "HPI Clear",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Personal, honest description of the car. Markdown-style formatting supported.",
    }),
    defineField({
      name: "isEditorPick",
      title: "Editor's Pick",
      type: "boolean",
      initialValue: false,
      description:
        "Only ONE car can be Editor's Pick at a time. This car will be featured prominently on the Showroom and Homepage.",
      validation: (rule) =>
        rule.custom(async (value, context) => {
          if (!value) return true;
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2024-01-01" });
          const id = document?._id?.replace(/^drafts\./, "");
          const existing = await client.fetch(
            `count(*[_type == "car" && isEditorPick == true && _id != $id && !(_id in path("drafts.**"))])`,
            { id }
          );
          return existing === 0
            ? true
            : "Only one car can be Editor's Pick at a time. Remove the current pick first.";
        }),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
      description: "Show this car on the Homepage featured section (max 2).",
    }),
    defineField({
      name: "isSold",
      title: "Sold",
      type: "boolean",
      initialValue: false,
      description:
        "Hides this car from all public pages. Toggle when the car is sold.",
    }),
    defineField({
      name: "dateAdded",
      title: "Date Added",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      make: "make",
      customMake: "customMake",
      model: "model",
      variant: "variant",
      year: "year",
      subtitle: "price",
      media: "photos.0",
      sold: "isSold",
      editorPick: "isEditorPick",
    },
    prepare({ make, customMake, model, variant, year, subtitle, media, sold, editorPick }) {
      const badges = [];
      if (sold) badges.push("SOLD");
      if (editorPick) badges.push("⭐ Pick");
      const prefix = badges.length ? `[${badges.join(" · ")}] ` : "";
      
      const resolvedMake = make === "Other" ? customMake : make;
      const title = generateCarTitle({ make: resolvedMake, model, variant, year } as any);

      return {
        title: `${prefix}${title}`,
        subtitle: subtitle ? `£${Number(subtitle).toLocaleString()}` : "No price",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Date Added (newest)",
      name: "dateAddedDesc",
      by: [{ field: "dateAdded", direction: "desc" }],
    },
    {
      title: "Price (low to high)",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price (high to low)",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
  ],
});
