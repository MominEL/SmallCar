import styles from "./TrustStrip.module.css";

const FEATURES = [
  {
    icon: "✓",
    title: "HPI checked",
    desc: "Every car comes with a full HPI check. No outstanding finance, no write-offs, no nasty surprises.",
  },
  {
    icon: "◎",
    title: "Real photography",
    desc: "What you see is what you get. Every photo is taken by us — no stock images, no filters, no misdirection.",
  },
  {
    icon: "◆",
    title: "Direct contact",
    desc: "Talk to the person who actually knows the car. No call centres, no scripts, no runaround.",
  },
  {
    icon: "▣",
    title: "Virginia Water showroom",
    desc: "View every car in person at our Surrey location. Appointments available seven days a week.",
  },
];

export function TrustStrip() {
  return (
    <section className={`section ${styles.trust}`}>
      <div className="container">
        <div className="eyebrow">Why SmallCar</div>
        <h2 className={styles.title}>
          Built on <em>trust.</em>
        </h2>
        <div className={styles.grid}>
          {FEATURES.map((feature, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
