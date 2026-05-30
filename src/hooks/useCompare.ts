"use client";

import { useState, useEffect } from "react";

export function useCompare() {
  const [compareCars, setCompareCars] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem("smallcar_compare");
        if (stored) {
          setCompareCars(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error reading compare cars from localStorage", e);
      }
    };

    loadFromStorage();

    // Listen to custom event for syncing across components on the same tab
    const handleCompareUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      setCompareCars(customEvent.detail);
    };

    // Listen to storage event for syncing across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "smallcar_compare") {
        loadFromStorage();
      }
    };

    window.addEventListener("compareUpdated", handleCompareUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("compareUpdated", handleCompareUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleCompare = (slug: string) => {
    let result = { added: false, limitReached: false };

    setCompareCars((prev) => {
      let newCompare = [...prev];
      if (prev.includes(slug)) {
        newCompare = prev.filter((s) => s !== slug);
        result.added = false;
      } else {
        if (prev.length >= 3) {
          result.limitReached = true;
          return prev; // Do not add if limit reached
        }
        newCompare = [...prev, slug];
        result.added = true;
      }

      try {
        localStorage.setItem("smallcar_compare", JSON.stringify(newCompare));
        window.dispatchEvent(new CustomEvent("compareUpdated", { detail: newCompare }));
      } catch (e) {
        console.error("Error saving compare cars to localStorage", e);
      }

      return newCompare;
    });

    return result;
  };

  const removeCompare = (slug: string) => {
    setCompareCars((prev) => {
      const newCompare = prev.filter((s) => s !== slug);
      try {
        localStorage.setItem("smallcar_compare", JSON.stringify(newCompare));
        window.dispatchEvent(new CustomEvent("compareUpdated", { detail: newCompare }));
      } catch (e) {}
      return newCompare;
    });
  };

  const isCompared = (slug: string) => compareCars.includes(slug);

  return { compareCars, toggleCompare, removeCompare, isCompared, mounted };
}
