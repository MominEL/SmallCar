"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity.client";
import { CarCard } from "@/components/Showroom/CarCard";
import { useFavourites } from "@/hooks/useFavourites";
import { generateCarTitle } from "@/lib/titleSystem";
import Link from "next/link";
import styles from "./page.module.css";

export default function SavedCarsPage() {
  const { savedCars, mounted } = useFavourites();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;

    if (savedCars.length === 0) {
      setCars([]);
      setLoading(false);
      return;
    }

    const fetchSavedCars = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "car" && slug.current in $slugs] {
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
          fuelType,
          engine,
          isSold
        }`;
        const rawCars = await client.fetch(query, { slugs: savedCars });
        const processedCars = rawCars.map((car: any) => ({
          ...car,
          name: generateCarTitle(car)
        }));
        setCars(processedCars);
      } catch (e) {
        console.error("Failed to fetch saved cars", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCars();
  }, [savedCars, mounted]);

  if (!mounted) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Saved Cars</h1>
        <p className={styles.subtitle}>
          Cars you have shortlisted. They are saved to your browser so you can come back later.
        </p>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading your saved cars...</div>
      ) : cars.length > 0 ? (
        <div className={styles.grid}>
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>You haven&apos;t saved any cars yet.</p>
          <Link href="/showroom" className={styles.btn}>
            Browse Showroom
          </Link>
        </div>
      )}
    </div>
  );
}
