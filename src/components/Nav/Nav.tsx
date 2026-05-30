"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import styles from "./Nav.module.css";

const NAV_LINKS = [
  { href: "/showroom", label: "Showroom" },
  { href: "/saved", label: "Saved ❤️" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="SmallCar home">
            <span className={styles.logoMain}>
              Small<em>Car</em>
            </span>
            <span className={styles.logoSub}>by PMS Motors</span>
          </Link>

          {/* Desktop links */}
          <div className={styles.links}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${
                  pathname === link.href || pathname?.startsWith(link.href + "/")
                    ? styles.linkActive
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className={styles.actions}>
            <ThemeToggle />
            <Link href="/contact" className={styles.cta}>
              Enquire
            </Link>

            {/* Hamburger */}
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileMenuInner}>
          <div className={styles.mobileLinks}>
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileLink} ${
                  pathname === link.href ? styles.mobileLinkActive : ""
                }`}
                style={{ animationDelay: `${i * 60 + 100}ms` }}
              >
                <span className={styles.mobileLinkNum}>0{i + 1}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.mobileFooter}>
            <Link href="/contact" className={`btn btn-primary ${styles.mobileCta}`}>
              Get in touch
            </Link>
            <p className={styles.mobileNote}>
              Virginia Water, Surrey<br />
              No online sales · Enquire to view
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
