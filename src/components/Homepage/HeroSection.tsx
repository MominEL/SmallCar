"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background grid */}
      <div className={styles.grid} aria-hidden />
      {/* Gold glow */}
      <div className={styles.glow} aria-hidden />

      <div className={styles.inner}>
        {/* Left: main content */}
        <div className={styles.content}>
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Virginia Water&apos;s finest city cars
          </motion.div>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <em>Drive small.</em>
            <span>Live remarkable.</span>
          </motion.h1>

          {/* Gold accent line */}
          <motion.div
            className={styles.goldLine}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          />

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            A curated collection of premium compact cars — each personally 
            sourced and verified. No pressure. Just good cars, honestly presented.
          </motion.p>

          <motion.div
            className={styles.ctas}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/showroom" className="btn btn-primary">
              Browse showroom
            </Link>
            <Link href="/about" className="btn btn-text">
              Our story →
            </Link>
          </motion.div>
        </div>

        {/* Right: decorative vertical text */}
        <motion.div
          className={styles.sideText}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <span className={styles.sideTextLine}>Est. Virginia Water</span>
          <span className={styles.sideTextDot}>◆</span>
          <span className={styles.sideTextLine}>Surrey, England</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </motion.div>
    </section>
  );
}
