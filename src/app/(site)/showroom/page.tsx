import { Metadata } from "next";
import { client } from "@/lib/sanity.client";
import { allCarsQuery } from "@/lib/sanity.queries";
import { CarCard } from "@/components/Showroom/CarCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Showroom",
  description: "Browse our current collection of premium city cars in Virginia Water.",
};

// Revalidate every 60 seconds so new cars appear quickly
export const revalidate = 60;

import Link from "next/link";
// ... (imports remain at top)

export default async function ShowroomPage({
  searchParams,
}: {
  searchParams: { make?: string };
}) {
  const cars = await client.fetch(allCarsQuery);

  // Extract unique makes from currently in-stock cars
  const availableMakes = Array.from(new Set(cars.map((car: any) => car.make))).sort() as string[];

  // Filter cars based on selected make
  const selectedMake = searchParams.make;
  const filteredCars = selectedMake
    ? cars.filter((car: any) => car.make === selectedMake)
    : cars;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <div className="eyebrow">The Collection</div>
          <h1 className={styles.title}>
            Our current <em>stock.</em>
          </h1>
          <p className={styles.subtitle}>
            Every car here has been personally sourced, inspected, and verified by us.
            Viewings are by appointment at our Virginia Water showroom.
          </p>
        </div>
      </header>

      {/* Dynamic Filter Bar */}
      <div className={styles.filters}>
        <div className="container">
          <div className={styles.filterList}>
            <Link 
              href="/showroom" 
              className={`${styles.filterBtn} ${!selectedMake ? styles.active : ""}`}
            >
              All cars
            </Link>
            {availableMakes.map((make) => (
              <Link
                key={make}
                href={`/showroom?make=${make}`}
                className={`${styles.filterBtn} ${selectedMake === make ? styles.active : ""}`}
              >
                {make}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.gridSection}>
        <div className="container">
          {filteredCars.length === 0 ? (
            <div className={styles.empty}>
              <p>No cars currently available matching this filter.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredCars.map((car: any, index: number) => {
                // Only make the first item large if it's an editor's pick AND we aren't filtering (optional, but good practice)
                const isFeatured = index === 0 && car.isEditorPick && !selectedMake;
                return (
                  <div 
                    key={car._id} 
                    className={`${styles.gridItem} ${isFeatured ? styles.gridItemLarge : ""}`}
                  >
                    <CarCard car={car} featured={isFeatured} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
