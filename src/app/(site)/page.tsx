import styles from "./page.module.css";
import Link from "next/link";
import { client } from "@/lib/sanity.client";
import { featuredCarsQuery } from "@/lib/sanity.queries";
import { HeroSection } from "@/components/Homepage/HeroSection";
import { StatsBar } from "@/components/Homepage/StatsBar";
import { TrustStrip } from "@/components/Homepage/TrustStrip";
import { Marquee } from "@/components/Homepage/Marquee";
import { CarCard } from "@/components/Showroom/CarCard";

export const revalidate = 60;

export default async function HomePage() {
  const featuredCars = await client.fetch(featuredCarsQuery);

  return (
    <div className={styles.page}>
      <HeroSection />
      <StatsBar />
      
      <section className={`section ${styles.featured}`}>
        <div className="container">
          <div className="eyebrow">Currently in stock</div>
          <h2 className={styles.featuredTitle}>
            Hand-picked <em>favourites.</em>
          </h2>
          <p className={styles.featuredSub}>
            Every car in our showroom is personally sourced, inspected, and photographed. 
            These are the ones we think you should see first.
          </p>

          <div className={styles.featuredGrid}>
            {featuredCars?.length > 0 ? (
              featuredCars.map((car: any, i: number) => (
                <div 
                  key={car._id} 
                  className={`${styles.featuredGridItem} ${i === 0 ? styles.featuredGridItemLarge : ""}`}
                >
                  <CarCard car={car} featured={i === 0} />
                </div>
              ))
            ) : (
              <p className={styles.emptyFeatured}>More cars arriving soon.</p>
            )}
          </div>

          <div className={styles.featuredFooter}>
            <Link href="/showroom" className="btn btn-ghost">
              Browse the full showroom
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip />
      <Marquee />
    </div>
  );
}
