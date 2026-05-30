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

export default async function ShowroomPage() {
  const cars = await client.fetch(allCarsQuery);

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

      {/* Filter bar placeholder - will become interactive later */}
      <div className={styles.filters}>
        <div className="container">
          <div className={styles.filterList}>
            <button className={`${styles.filterBtn} ${styles.active}`}>All cars</button>
            <button className={styles.filterBtn}>MINI</button>
            <button className={styles.filterBtn}>Fiat</button>
            <button className={styles.filterBtn}>Abarth</button>
            <button className={styles.filterBtn}>Other</button>
          </div>
        </div>
      </div>

      <section className={styles.gridSection}>
        <div className="container">
          {cars.length === 0 ? (
            <div className={styles.empty}>
              <p>No cars currently available. We are always sourcing new stock.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {cars.map((car: any, index: number) => {
                // Make the first item large if it's an editor's pick
                const isFeatured = index === 0 && car.isEditorPick;
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
