"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./StatsBar.module.css";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  isDecimal?: boolean;
}

const STATS: Stat[] = [
  { value: 20, suffix: "+", label: "Cars in stock" },
  { value: 5, suffix: "★", label: "Google rating", isDecimal: true },
  { value: 194, suffix: "", label: "Five-star reviews" },
  { value: 1, suffix: "hr", label: "Response time" },
];

function AnimatedCounter({ value, suffix, isDecimal }: { value: number; suffix: string; isDecimal?: boolean }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 1200;

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Exponential ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * value;
            setDisplay(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, isDecimal]);

  return (
    <span ref={ref} className={styles.number}>
      {isDecimal ? display.toFixed(1) : display}
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className={styles.bar}>
      <div className={styles.inner}>
        {STATS.map((stat, i) => (
          <div key={i} className={styles.stat}>
            <AnimatedCounter value={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} />
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
