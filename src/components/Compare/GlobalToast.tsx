"use client";

import { useEffect, useState, useRef } from "react";
import { useCompare } from "@/hooks/useCompare";
import Link from "next/link";
import styles from "./GlobalToast.module.css";

export function GlobalToast() {
  const { compareCars, mounted } = useCompare();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const prevCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialise the ref once mounted
  useEffect(() => {
    if (mounted) prevCountRef.current = compareCars.length;
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const handleUpdated = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      const count = Array.isArray(detail) ? detail.length : 0;
      const prev = prevCountRef.current;
      prevCountRef.current = count;

      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      if (count > prev && count <= 3) {
        setMessage(`Added to compare (${count}/3)`);
        setShow(true);
        timerRef.current = setTimeout(() => setShow(false), 4000);
      } else if (count < prev && count > 0) {
        setMessage(`Removed — ${count} car${count !== 1 ? "s" : ""} left`);
        setShow(true);
        timerRef.current = setTimeout(() => setShow(false), 3000);
      } else if (count === 0) {
        setMessage("Compare list cleared");
        setShow(true);
        timerRef.current = setTimeout(() => setShow(false), 2000);
      } else if (count === prev) {
        // Limit reached — count didn't change
        setMessage("Compare is full (3/3) — remove one first");
        setShow(true);
        timerRef.current = setTimeout(() => setShow(false), 3000);
      }
    };

    window.addEventListener("compareUpdated", handleUpdated);
    return () => {
      window.removeEventListener("compareUpdated", handleUpdated);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mounted]);

  if (!mounted || !show) return null;

  return (
    <div className={`${styles.toast} ${show ? styles.show : ""}`}>
      <div className={styles.content}>
        <span>{message}</span>
        <div className={styles.actions}>
          {compareCars.length > 0 && compareCars.length < 3 && (
            <span className={styles.hint}>Add another or</span>
          )}
          {compareCars.length > 0 && (
            <Link href="/compare" className={styles.link} onClick={() => setShow(false)}>
              View comparison →
            </Link>
          )}
        </div>
      </div>
      <button className={styles.close} onClick={() => setShow(false)}>✕</button>
    </div>
  );
}
