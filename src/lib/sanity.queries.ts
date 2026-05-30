import { groq } from "next-sanity";

// ── All cars (non-sold), for showroom ──
export const allCarsQuery = groq`
  *[_type == "car" && !isSold] | order(dateAdded desc) {
    _id,
    model,
    variant,
    slug,
    "make": select(make == "Other" => customMake, make),
    bodyType,
    badge,
    "photo": photos[0],
    year,
    mileage,
    price,
    gearbox,
    colour,
    engine,
    bhp,
    fuelType,
    isEditorPick,
    isFeatured,
    dateAdded
  }
`;

// ── Single car by slug ──
export const carBySlugQuery = groq`
  *[_type == "car" && slug.current == $slug][0] {
    _id,
    model,
    variant,
    slug,
    "make": select(make == "Other" => customMake, make),
    bodyType,
    badge,
    photos,
    year,
    mileage,
    price,
    gearbox,
    colour,
    engine,
    bhp,
    zeroToSixty,
    topSpeed,
    interior,
    fuelType,
    economy,
    motExpiry,
    owners,
    serviceHistory,
    hpiClear,
    description,
    isEditorPick,
    isFeatured,
    isSold,
    dateAdded
  }
`;

// ── Featured cars for homepage (1 editor pick + 2 featured) ──
export const featuredCarsQuery = groq`
  *[_type == "car" && !isSold && (isEditorPick == true || isFeatured == true)] | order(isEditorPick desc, dateAdded desc)[0..2] {
    _id,
    model,
    variant,
    slug,
    "make": select(make == "Other" => customMake, make),
    badge,
    "photo": photos[0],
    year,
    mileage,
    price,
    gearbox,
    engine,
    bhp,
    isEditorPick,
    isFeatured,
    dateAdded
  }
`;

// ── Similar cars (same make or ±£5k price range, exclude current) ──
export const similarCarsQuery = groq`
  *[_type == "car" && !isSold && _id != $currentId && (
    (make != "Other" && make == $make) || 
    (make == "Other" && customMake == $make) || 
    (price > $price - 5000 && price < $price + 5000)
  )] | order(dateAdded desc)[0..2] {
    _id,
    model,
    variant,
    slug,
    "make": select(make == "Other" => customMake, make),
    "photo": photos[0],
    year,
    mileage,
    price,
    gearbox,
    isEditorPick
  }
`;

// ── Site settings singleton ──
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    phone,
    whatsapp,
    email,
    address,
    openingHours,
    carCount,
    yearsTrading,
    googleRating,
    reviewCount,
    responseTime,
    foundedYear,
    aboutStory,
    footerText
  }
`;

// ── Team members ──
export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(sortOrder asc) {
    _id,
    name,
    role,
    bio,
    initial,
    sortOrder
  }
`;

// ── Gallery images ──
export const galleryImagesQuery = groq`
  *[_type == "galleryImage"] | order(sortOrder asc) {
    _id,
    image,
    caption,
    category,
    date,
    sortOrder
  }
`;
