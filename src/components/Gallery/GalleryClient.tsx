"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./GalleryClient.module.css";

interface GalleryImage {
  _id: string;
  image?: { secure_url: string };
  caption?: string;
  category: string;
}

interface GalleryClientProps {
  initialImages: GalleryImage[];
}

export function GalleryClient({ initialImages }: GalleryClientProps) {
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = initialImages.filter((img) =>
    filter === "all" ? true : img.category === filter
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <div className="eyebrow">Our Space</div>
          <h1 className={styles.title}>
            The <em>Gallery.</em>
          </h1>
          <p className={styles.subtitle}>
            A look inside our Virginia Water showroom, recent events, and the cars we love.
          </p>
        </div>
      </header>

      {/* ── Filters ── */}
      <div className={styles.filters}>
        <div className="container">
          <div className={styles.filterList}>
            <button
              onClick={() => setFilter("all")}
              className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("showroom")}
              className={`${styles.filterBtn} ${filter === "showroom" ? styles.active : ""}`}
            >
              Showroom
            </button>
            <button
              onClick={() => setFilter("car")}
              className={`${styles.filterBtn} ${filter === "car" ? styles.active : ""}`}
            >
              Cars
            </button>
            <button
              onClick={() => setFilter("event")}
              className={`${styles.filterBtn} ${filter === "event" ? styles.active : ""}`}
            >
              Events
            </button>
          </div>
        </div>
      </div>

      {/* ── Masonry Grid ── */}
      <section className={styles.gallerySection}>
        <div className="container">
          {filteredImages.length === 0 ? (
            <div className={styles.empty}>No images found for this category.</div>
          ) : (
            <div className={styles.masonry}>
              {filteredImages.map((item, index) => {
                if (!item.image?.secure_url) return null;
                return (
                  <div
                    key={item._id}
                    className={styles.masonryItem}
                    onClick={() => setLightboxIndex(index)}
                  >
                    <Image
                      src={item.image.secure_url}
                      alt={item.caption || "Gallery image"}
                      width={800}
                      height={600}
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {item.caption && (
                      <div className={styles.captionOverlay}>
                        <span>{item.caption}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && filteredImages[lightboxIndex]?.image?.secure_url && (
        <div className={styles.lightbox}>
          <div className={styles.lightboxBackdrop} onClick={() => setLightboxIndex(null)} />
          <button className={styles.closeBtn} onClick={() => setLightboxIndex(null)}>
            Close
          </button>
          
          <div className={styles.lightboxContent}>
            <Image
              src={filteredImages[lightboxIndex].image!.secure_url}
              alt={filteredImages[lightboxIndex].caption || "Full screen gallery image"}
              fill
              className={styles.lightboxImage}
              sizes="100vw"
              quality={100}
            />
            {filteredImages[lightboxIndex].caption && (
              <div className={styles.lightboxCaption}>
                {filteredImages[lightboxIndex].caption}
              </div>
            )}
          </div>

          <div className={styles.lightboxControls}>
            <button 
              className={styles.navBtn}
              onClick={() => setLightboxIndex(prev => prev! > 0 ? prev! - 1 : filteredImages.length - 1)}
            >
              ← Prev
            </button>
            <span className={styles.counter}>
              {lightboxIndex + 1} / {filteredImages.length}
            </span>
            <button 
              className={styles.navBtn}
              onClick={() => setLightboxIndex(prev => prev! < filteredImages.length - 1 ? prev! + 1 : 0)}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
