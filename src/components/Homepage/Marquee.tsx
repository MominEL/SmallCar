import styles from "./Marquee.module.css";

const BRANDS = [
  "MINI", "Fiat", "Volkswagen", "Abarth", "Ford",
  "Renault", "Toyota", "Peugeot", "Honda", "Suzuki",
];

export function Marquee() {
  // Duplicate the list for seamless loop
  const items = [...BRANDS, ...BRANDS];

  return (
    <section className={styles.marquee} aria-hidden>
      <div className={styles.track}>
        {items.map((brand, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.dot}>◆</span>
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
