"use client";

import { useEffect, useState } from "react";
import { useCompare } from "@/hooks/useCompare";
import Link from "next/link";
import styles from "./GlobalToast.module.css";

export function GlobalToast() {
  const { compareCars, mounted } = useCompare();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!mounted) return;
    let prevCount = compareCars.length;

    const handleUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      const count = customEvent.detail.length;
      const wasAdded = count > prevCount;
      prevCount = count;

      if (wasAdded && count <= 3) {
        setMessage(`Added to compare (${count}/3)`);
        setShow(true);
        setTimeout(() => setShow(false), 5000);
      } else if (!wasAdded && count > 0) {
        setMessage(`Removed — ${count} car${count !== 1 ? "s" : ""} in compare`);
        setShow(true);
        setTimeout(() => setShow(false), 3000);
      } else if (count === 0) {
        setShow(false);
      }
    };

    window.addEventListener("compareUpdated", handleUpdated);
    return () => window.removeEventListener("compareUpdated", handleUpdated);
  }, [mounted]);

  if (!mounted || !show) return null;

  return (
    <div className={`${styles.toast} ${show ? styles.show : ""}`}>
      <div className={styles.content}>
        <span>{message}</span>
        <div className={styles.actions}>
          {compareCars.length < 3 && <span className={styles.hint}>Add another or</span>}
          <Link href="/compare" className={styles.link} onClick={() => setShow(false)}>
            View comparison →
          </Link>
        </div>
      </div>
      <button className={styles.close} onClick={() => setShow(false)}>✕</button>
    </div>
  );
}
