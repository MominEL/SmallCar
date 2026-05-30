"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useFavourites } from "@/hooks/useFavourites";
import styles from "./CarCard.module.css";

const MotionLink = motion.create(Link);

interface CarCardProps {
  car: {
    _id: string;
    name: string;
    slug: { current: string };
    make: string;
    year: number;
    mileage: number;
    price: number;
    gearbox: string;
    fuelType: string;
    engine: string;
    badge?: string;
    photo?: { secure_url: string };
  };
  featured?: boolean;
}

const badgeMap: Record<string, string> = {
  "editors-pick": "Editor's pick",
  "new-in": "New in",
  "low-miles": "Low miles",
  "popular": "Popular",
  "reduced": "Reduced",
  "just-in": "Just in",
};

export function CarCard({ car, featured = false }: CarCardProps) {
  const imageUrl = car.photo?.secure_url || "/placeholder-car.jpg";
  const displayBadge = car.badge ? badgeMap[car.badge] || car.badge : undefined;
  
  const { isFavourite, toggleFavourite, mounted } = useFavourites();
  const slugStr = car.slug?.current || "";
  const favourited = mounted && isFavourite(slugStr);

  return (
    <MotionLink
      href={`/showroom/${car.slug?.current}`}
      className={`${styles.card} ${featured ? styles.featured : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={styles.imageWrap}>
        <Image
          src={imageUrl}
          alt={car.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button 
          className={`${styles.heartBtn} ${favourited ? styles.favourited : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavourite(slugStr);
          }}
          aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
        >
          <svg viewBox="0 0 24 24" fill={favourited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {displayBadge && <span className={styles.badge}>{displayBadge}</span>}
      </div>
      <div className={styles.info}>
        <span className={styles.year}>{car.year}</span>
        <h3 className={styles.name}>{car.name}</h3>
        
        {/* Short spec for normal view */}
        <div className={styles.shortSpec}>
          {car.mileage?.toLocaleString()} miles · {car.gearbox} · {car.fuelType}
        </div>

        {/* Full spec expands on hover (desktop) */}
        <div className={styles.fullSpec}>
          <div className={styles.specRow}>
            <span>Mileage</span>
            <strong>{car.mileage?.toLocaleString()}</strong>
          </div>
          <div className={styles.specRow}>
            <span>Gearbox</span>
            <strong>{car.gearbox}</strong>
          </div>
          <div className={styles.specRow}>
            <span>Fuel</span>
            <strong>{car.fuelType}</strong>
          </div>
          <div className={styles.specRow}>
            <span>Engine</span>
            <strong>{car.engine}</strong>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.price}>£{car.price?.toLocaleString()}</span>
          <span className={styles.cta}>View details →</span>
        </div>
      </div>
    </MotionLink>
  );
}
