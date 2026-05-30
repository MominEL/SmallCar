"use client";

import { useState, useEffect } from "react";

export function useFavourites() {
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("smallcar_saved");
      if (stored) {
        setSavedCars(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading saved cars from localStorage", e);
    }
  }, []);

  const toggleFavourite = (slug: string) => {
    setSavedCars((prev) => {
      const newSaved = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      
      try {
        localStorage.setItem("smallcar_saved", JSON.stringify(newSaved));
      } catch (e) {
        console.error("Error saving cars to localStorage", e);
      }
      return newSaved;
    });
  };

  const isFavourite = (slug: string) => savedCars.includes(slug);

  return { savedCars, toggleFavourite, isFavourite, mounted };
}
