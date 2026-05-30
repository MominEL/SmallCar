import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity.client";
import { carBySlugQuery, similarCarsQuery } from "@/lib/sanity.queries";
import { generateCarTitle, generateSeoTitle, generateMetaDescription } from "@/lib/titleSystem";
import { PhotoGallery } from "@/components/Showroom/PhotoGallery";
import { RichText } from "@/components/RichText/RichText";
import { EnquiryForm } from "@/components/Showroom/EnquiryForm";
import { StockAlertForm } from "@/components/Showroom/StockAlertForm";
import { ContactActions } from "@/components/Showroom/ContactActions";
import { CarCard } from "@/components/Showroom/CarCard";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import { headers } from "next/headers";
import styles from "./page.module.css";

interface PageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const car = await client.fetch(carBySlugQuery, { slug: params.slug });
  if (!car) return {};

  return {
    title: generateSeoTitle(car),
    description: generateMetaDescription(car),
  };
}

export default async function CarDetailsPage({ params }: PageProps) {
  const rawCar = await client.fetch(carBySlugQuery, { slug: params.slug });
  if (!rawCar) notFound();

  // Inject generated name
  const car = {
    ...rawCar,
    name: generateCarTitle(rawCar)
  };

  const siteSettings = await client.fetch(siteSettingsQuery);
  const phoneNumber = siteSettings?.phone || "";

  // Getting absolute URL for sharing
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const currentUrl = `${protocol}://${host}/showroom/${params.slug}`;

  // Fetch similar cars
  const rawSimilarCars = await client.fetch(similarCarsQuery, {
    currentId: car._id,
    make: car.make,
    price: car.price,
  });
  
  const similarCars = rawSimilarCars?.map((similarCar: any) => ({
    ...similarCar,
    name: generateCarTitle(similarCar)
  })) || [];

  const badgeMap: Record<string, string> = {
    "editors-pick": "Editor's pick",
    "new-in": "New in",
    "low-miles": "Low miles",
    "popular": "Popular",
    "reduced": "Reduced",
    "just-in": "Just in",
  };
  
  const displayBadge = car.badge ? badgeMap[car.badge] || car.badge : undefined;

  return (
    <article className={styles.page}>
      <div className="container">
        {/* Top: Breadcrumbs & Badges */}
        <div className={styles.topNav}>
          <Link href="/showroom" className={styles.backLink}>
            ← Back to showroom
          </Link>
          <div className={styles.badges}>
            {car.isSold && <span className={`${styles.badge} ${styles.badgeSold}`}>Sold</span>}
            {displayBadge && <span className={styles.badge}>{displayBadge}</span>}
          </div>
        </div>

        {/* Gallery */}
        <div className={styles.gallerySection}>
          <PhotoGallery photos={car.photos} carName={car.name} />
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          
          {/* Left: Info & Description */}
          <div className={styles.mainInfo}>
            <div className={styles.header}>
              <span className={styles.year}>{car.year}</span>
              <h1 className={styles.title}>{car.name}</h1>
              <div className={styles.price}>£{car.price?.toLocaleString()}</div>
              {car.isSold && <p className={styles.soldNote}>This car is no longer available.</p>}
            </div>

            <div className={styles.description}>
              <div className="eyebrow">About this car</div>
              {car.description ? (
                <RichText value={car.description} />
              ) : (
                <p className={styles.noDesc}>More details coming soon.</p>
              )}
            </div>
          </div>

          {/* Right: Specs & Enquiry */}
          <aside className={styles.sidebar}>
            <div className={styles.specsBox}>
              <h3 className={styles.specsTitle}>Specification</h3>
              <div className={styles.specList}>
                <div className={styles.specItem}>
                  <span>Mileage</span>
                  <strong>{car.mileage?.toLocaleString()}</strong>
                </div>
                <div className={styles.specItem}>
                  <span>Gearbox</span>
                  <strong>{car.gearbox}</strong>
                </div>
                <div className={styles.specItem}>
                  <span>Fuel</span>
                  <strong>{car.fuelType}</strong>
                </div>
                <div className={styles.specItem}>
                  <span>Engine</span>
                  <strong>{car.engine}</strong>
                </div>
                {car.bhp && (
                  <div className={styles.specItem}>
                    <span>Power</span>
                    <strong>{car.bhp} bhp</strong>
                  </div>
                )}
                {car.colour && (
                  <div className={styles.specItem}>
                    <span>Colour</span>
                    <strong>{car.colour}</strong>
                  </div>
                )}
                <div className={styles.specItem}>
                  <span>Owners</span>
                  <strong>{car.owners || "N/A"}</strong>
                </div>
                {car.motExpiry && (
                  <div className={styles.specItem}>
                    <span>MOT</span>
                    <strong>{new Date(car.motExpiry).toLocaleDateString("en-GB")}</strong>
                  </div>
                )}
              </div>
            </div>

            {!car.isSold ? (
              <div className={styles.enquiryBox}>
                <EnquiryForm carName={car.name} carId={car._id} />
                <ContactActions 
                  carName={car.name} 
                  phoneNumber={phoneNumber} 
                  carUrl={currentUrl} 
                />
                <a 
                  href={`https://wa.me/${siteSettings?.whatsapp?.replace(/\D/g, '') || '447000000000'}?text=Hi! I'm interested in the ${car.year} ${car.name}`} 
                  className={styles.whatsappBtn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.082 18.125c-1.391 0-2.753-.374-3.951-1.082l-4.39 1.152 1.173-4.28c-.777-1.228-1.189-2.646-1.189-4.103 0-4.298 3.498-7.796 7.798-7.796 4.3 0 7.798 3.498 7.798 7.796s-3.498 7.797-7.798 7.797z" fillRule="evenodd" clipRule="evenodd"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <div className={styles.enquiryBox}>
                <StockAlertForm carName={car.name} />
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Similar Cars Strip */}
      {similarCars?.length > 0 && (
        <section className={`section ${styles.similar}`}>
          <div className="container">
            <h2 className={styles.similarTitle}>Similar cars in stock</h2>
            <div className={styles.similarGrid}>
              {similarCars.map((similarCar: any) => (
                <div key={similarCar._id}>
                  <CarCard car={similarCar} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
