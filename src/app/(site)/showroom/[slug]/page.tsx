import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity.client";
import { carBySlugQuery, similarCarsQuery } from "@/lib/sanity.queries";
import { PhotoGallery } from "@/components/Showroom/PhotoGallery";
import { RichText } from "@/components/RichText/RichText";
import { EnquiryForm } from "@/components/Showroom/EnquiryForm";
import { CarCard } from "@/components/Showroom/CarCard";
import styles from "./page.module.css";

interface PageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const car = await client.fetch(carBySlugQuery, { slug: params.slug });
  if (!car) return {};

  return {
    title: `${car.name}`,
    description: `View this ${car.year} ${car.name} with ${car.mileage?.toLocaleString()} miles. Available now at SmallCar by PMS Motors in Virginia Water.`,
  };
}

export default async function CarDetailsPage({ params }: PageProps) {
  const car = await client.fetch(carBySlugQuery, { slug: params.slug });
  if (!car) notFound();

  // Fetch similar cars
  const similarCars = await client.fetch(similarCarsQuery, {
    currentId: car._id,
    make: car.make,
    price: car.price,
  });

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
            {car.badge && <span className={styles.badge}>{car.badge}</span>}
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

            {!car.isSold && (
              <div className={styles.enquiryBox}>
                <EnquiryForm carName={car.name} carId={car._id} />
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
