import Link from "next/link";
import Image from "next/image";
import styles from "./CarCard.module.css";

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

export function CarCard({ car, featured = false }: CarCardProps) {
  const imageUrl = car.photo?.secure_url || "/placeholder-car.jpg";

  return (
    <Link
      href={`/showroom/${car.slug?.current}`}
      className={`${styles.card} ${featured ? styles.featured : ""}`}
    >
      <div className={styles.imageWrap}>
        <Image
          src={imageUrl}
          alt={car.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {car.badge && <span className={styles.badge}>{car.badge}</span>}
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
    </Link>
  );
}
