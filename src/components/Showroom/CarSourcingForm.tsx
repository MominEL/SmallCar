"use client";

import { useState } from "react";
import styles from "./CarSourcingForm.module.css";

export function CarSourcingForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      carDetails: formData.get("carDetails"),
      budget: formData.get("budget"),
      type: "sourcing"
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.successBox}>
          <div className={styles.icon}>✓</div>
          <h3>Request received!</h3>
          <p>We'll start looking for your perfect car and be in touch soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.info}>
          <h2 className={styles.title}>Looking for something specific?</h2>
          <p className={styles.desc}>
            Can't find exactly what you want in our current stock? Tell us what you're looking for, 
            and we'll use our network to source the perfect car for you.
          </p>
          <ul className={styles.perks}>
            <li>✓ Access to trade-only networks</li>
            <li>✓ Full history and HPI checks</li>
            <li>✓ Prepared to SmallCar standards</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="sourcing-name">Name</label>
              <input type="text" id="sourcing-name" name="name" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="sourcing-email">Email</label>
              <input type="email" id="sourcing-email" name="email" required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="sourcing-phone">Phone number</label>
              <input type="tel" id="sourcing-phone" name="phone" />
            </div>
            <div className={styles.field}>
              <label htmlFor="sourcing-budget">Max budget (£)</label>
              <input type="text" id="sourcing-budget" name="budget" placeholder="e.g. 15,000" />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="sourcing-details">What are you looking for?</label>
            <textarea 
              id="sourcing-details" 
              name="carDetails" 
              rows={4} 
              required 
              placeholder="e.g. Automatic MINI Cooper S, low mileage, preferably blue..."
            ></textarea>
          </div>

          {status === "error" && (
            <div className={styles.error}>Something went wrong. Please try again or call us.</div>
          )}

          <button type="submit" disabled={status === "submitting"} className={styles.submitBtn}>
            {status === "submitting" ? "Sending Request..." : "Send Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
