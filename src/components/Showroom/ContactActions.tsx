"use client";

import { useState } from "react";
import styles from "./ContactActions.module.css";

interface ContactActionsProps {
  carName: string;
  phoneNumber?: string;
  carUrl: string;
}

export function ContactActions({ carName, phoneNumber, carUrl }: ContactActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: carName,
      text: `Check out this ${carName} at SmallCar`,
      url: carUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback for desktop: copy link
      try {
        await navigator.clipboard.writeText(carUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy!", err);
      }
    }
  };

  return (
    <div className={styles.actions}>
      {phoneNumber && (
        <a href={`tel:${phoneNumber}`} className={styles.callBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call us about this car
        </a>
      )}
      
      <button onClick={handleShare} className={styles.shareBtn}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {copied ? "Link copied ✓" : "Share this car"}
      </button>
    </div>
  );
}
