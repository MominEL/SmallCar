"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./PhotoGallery.module.css";

interface PhotoGalleryProps {
  photos: { secure_url: string }[];
  carName: string;
}

export function PhotoGallery({ photos, carName }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const mainPhoto = photos[0];
  const gridPhotos = photos.slice(1, 7); // Show next 6 photos in the grid
  const remainingCount = photos.length - 7;

  return (
    <>
      <div className={styles.gallery}>
        {/* Main large photo */}
        <div 
          className={styles.mainPhoto}
          onClick={() => setLightboxIndex(0)}
        >
          <Image
            src={mainPhoto.secure_url}
            alt={`${carName} - Main`}
            fill
            className={styles.image}
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>

        {/* Side grid */}
        <div className={styles.grid}>
          {gridPhotos.map((photo, i) => (
            <div 
              key={i} 
              className={styles.gridItem}
              onClick={() => setLightboxIndex(i + 1)}
            >
              <Image
                src={photo.secure_url}
                alt={`${carName} - View ${i + 2}`}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Overlay for the last visible photo if there are more */}
              {i === 5 && remainingCount > 0 && (
                <div className={styles.overlay}>
                  <span>+{remainingCount} photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Basic Lightbox */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox}>
          <div className={styles.lightboxBackdrop} onClick={() => setLightboxIndex(null)} />
          <button className={styles.closeBtn} onClick={() => setLightboxIndex(null)}>
            Close
          </button>
          
          <div className={styles.lightboxContent}>
            <Image
              src={photos[lightboxIndex].secure_url}
              alt={`${carName} - Full screen`}
              fill
              className={styles.lightboxImage}
              sizes="100vw"
              quality={100}
            />
          </div>

          <div className={styles.lightboxControls}>
            <button 
              className={styles.navBtn}
              onClick={() => setLightboxIndex(prev => prev! > 0 ? prev! - 1 : photos.length - 1)}
            >
              ← Prev
            </button>
            <span className={styles.counter}>
              {lightboxIndex + 1} / {photos.length}
            </span>
            <button 
              className={styles.navBtn}
              onClick={() => setLightboxIndex(prev => prev! < photos.length - 1 ? prev! + 1 : 0)}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
