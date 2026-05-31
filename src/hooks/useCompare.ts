"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "smallcar_compare";
const MAX_COMPARE = 3;

/** Read the current compare list straight from localStorage (always fresh). */
function readStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

/** Write to localStorage + dispatch a sync event so every hook instance updates. */
function writeStorage(cars: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
    window.dispatchEvent(
      new CustomEvent("compareUpdated", { detail: cars })
    );
  } catch {}
}

export function useCompare() {
  const [compareCars, setCompareCars] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // ── Mount: hydrate from localStorage ──────────────────────────────
  useEffect(() => {
    setMounted(true);
    setCompareCars(readStorage());

    const handleCompareUpdated = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      setCompareCars(Array.isArray(detail) ? detail : []);
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCompareCars(readStorage());
    };

    window.addEventListener("compareUpdated", handleCompareUpdated);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("compareUpdated", handleCompareUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // ── Toggle: add or remove a car ───────────────────────────────────
  const toggleCompare = useCallback((slug: string) => {
    // ALWAYS read the latest from localStorage — React state can be stale.
    const current = readStorage();

    if (current.includes(slug)) {
      const next = current.filter((s) => s !== slug);
      setCompareCars(next);
      writeStorage(next);
      return { added: false, limitReached: false };
    }

    if (current.length >= MAX_COMPARE) {
      return { added: false, limitReached: true };
    }

    const next = [...current, slug];
    setCompareCars(next);
    writeStorage(next);
    return { added: true, limitReached: false };
  }, []);

  // ── Remove a specific car ─────────────────────────────────────────
  const removeCompare = useCallback((slug: string) => {
    const current = readStorage();
    const next = current.filter((s) => s !== slug);
    setCompareCars(next);
    writeStorage(next);
  }, []);

  // ── Clear all ─────────────────────────────────────────────────────
  const clearCompare = useCallback(() => {
    setCompareCars([]);
    writeStorage([]);
  }, []);

  // ── Sync: overwrite all ───────────────────────────────────────────
  const syncCompare = useCallback((slugs: string[]) => {
    setCompareCars(slugs);
    writeStorage(slugs);
  }, []);

  const isCompared = (slug: string) => compareCars.includes(slug);

  return {
    compareCars,
    toggleCompare,
    removeCompare,
    clearCompare,
    syncCompare,
    isCompared,
    mounted,
  };
}
