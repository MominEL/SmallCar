import Link from "next/link";
import { Nav } from "@/components/Nav/Nav";
import { Footer } from "@/components/Footer/Footer";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className={styles.notFound}>
        <div className={styles.container}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Page Not Found</h2>
          <p className={styles.text}>
            We couldn't find the page you're looking for. The vehicle may have
            been sold or the link might be broken.
          </p>
          <Link href="/showroom" className={styles.button}>
            Return to Showroom
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
