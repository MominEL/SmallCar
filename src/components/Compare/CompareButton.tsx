"use client";

import { useCompare } from "@/hooks/useCompare";
import styles from "./CompareButton.module.css";

interface CompareButtonProps {
  slug: string;
  variant?: "icon" | "text";
}

export function CompareButton({ slug, variant = "icon" }: CompareButtonProps) {
  const { isCompared, toggleCompare, mounted } = useCompare();

  if (!mounted) return null;

  const active = isCompared(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if inside a link
    e.stopPropagation();
    const result = toggleCompare(slug);
    if (result.limitReached) {
      alert("You can only compare up to 3 cars at a time.");
    }
  };

  const scaleIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M4 9h16" />
      <path d="M7 16l-3-7" />
      <path d="M17 16l3-7" />
      <path d="M3 16h8" />
      <path d="M13 16h8" />
    </svg>
  );

  if (variant === "text") {
    return (
      <button 
        className={`${styles.textBtn} ${active ? styles.textActive : ""}`} 
        onClick={handleClick}
        title={active ? "Remove from Compare" : "Add to Compare"}
      >
        {scaleIcon}
        <span>{active ? "Remove from Compare" : "Compare Specs"}</span>
      </button>
    );
  }

  return (
    <button 
      className={`${styles.iconBtn} ${active ? styles.iconActive : ""}`} 
      onClick={handleClick}
      title={active ? "Remove from Compare" : "Add to Compare"}
    >
      {scaleIcon}
    </button>
  );
}
