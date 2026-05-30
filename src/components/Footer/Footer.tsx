import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Top row */}
        <div className={styles.top}>
          {/* Logo column */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMain}>
                Small<em>Car</em>
              </span>
              <span className={styles.logoSub}>by PMS Motors</span>
            </Link>
            <p className={styles.tagline}>
              Drive small. Live remarkable.
            </p>
          </div>

          {/* Links columns */}
          <div className={styles.columns}>
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Browse</h4>
              <Link href="/showroom" className={styles.footerLink}>Showroom</Link>
              <Link href="/about" className={styles.footerLink}>Our story</Link>
              <Link href="/gallery" className={styles.footerLink}>Gallery</Link>
              <Link href="/contact" className={styles.footerLink}>Get in touch</Link>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Visit us</h4>
              <p className={styles.text}>Virginia Water, Surrey</p>
              <p className={styles.text}>Viewings by appointment</p>
              <a
                href="https://pms-motors.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                pms-motors.co.uk ↗
              </a>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Note</h4>
              <p className={styles.text}>
                No online sales. Every car is viewed in person. Enquire to arrange a viewing.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} SmallCar by PMS Motors. Virginia Water, Surrey.
          </p>
          <p className={styles.credit}>
            No online purchasing · Enquiry only
          </p>
        </div>
      </div>
    </footer>
  );
}
