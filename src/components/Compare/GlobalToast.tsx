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
    
    const handleUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      const count = customEvent.detail.length;
      if (count > 0 && count <= 3) {
        setMessage(`Added to Compare (${count}/3).`);
        setShow(true);
        setTimeout(() => setShow(false), 5000);
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
