"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./GoogleReviews.module.css";

// Fallback reviews until Google Places API is connected
const MOCK_REVIEWS = [
  {
    id: "1",
    author: "James T.",
    text: "Outstanding service from start to finish. Bought a lovely MINI Cooper. They weren't pushy, just genuinely helpful and honest.",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    id: "2",
    author: "Sarah Harding",
    text: "The easiest car buying experience I've ever had. The car was immaculately prepared and exactly as described.",
    rating: 5,
    date: "1 month ago"
  },
  {
    id: "3",
    author: "David M.",
    text: "Proper independent dealer. No hard sell, just good quality cars. Highly recommend PMS Motors to anyone looking for a reliable runaround.",
    rating: 5,
    date: "3 months ago"
  }
];

export function GoogleReviews({ rating = 5.0, count = 194 }: { rating?: number, count?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_REVIEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_REVIEWS.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_REVIEWS.length) % MOCK_REVIEWS.length);
  };

  return (
    <section className={styles.reviewsSection}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left: Summary */}
          <div className={styles.summary}>
            <div className="eyebrow">Customer Feedback</div>
            <h2 className={styles.title}>Don't just take our <em>word</em> for it.</h2>
            
            <div className={styles.googleBadge}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" fill="#FABB05" className={styles.star}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
              <div className={styles.ratingText}>
                <strong>{rating.toFixed(1)}</strong> out of 5 based on <strong>{count} reviews</strong> on Google.
              </div>
              <a href="#" className={styles.googleLink} target="_blank" rel="noopener noreferrer">
                Read all reviews
              </a>
            </div>
          </div>

          {/* Right: Slider */}
          <div className={styles.slider}>
            <div className={styles.sliderContainer}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={styles.reviewCard}
                >
                  <div className={styles.quoteIcon}>"</div>
                  <p className={styles.reviewText}>{MOCK_REVIEWS[currentIndex].text}</p>
                  <div className={styles.reviewFooter}>
                    <div className={styles.author}>{MOCK_REVIEWS[currentIndex].author}</div>
                    <div className={styles.date}>{MOCK_REVIEWS[currentIndex].date}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={styles.controls}>
              <button onClick={prevReview} aria-label="Previous review">←</button>
              <div className={styles.dots}>
                {MOCK_REVIEWS.map((_, i) => (
                  <button 
                    key={i} 
                    className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ""}`}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
              <button onClick={nextReview} aria-label="Next review">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
