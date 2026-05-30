"use client";

import { useState } from "react";
import styles from "./StockAlertForm.module.css";

interface StockAlertFormProps {
  carName: string;
}

export function StockAlertForm({ carName }: StockAlertFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      carName,
      type: "stock_alert"
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
      <div className={styles.successBox}>
        <div className={styles.icon}>✓</div>
        <h3>You're on the list!</h3>
        <p>We'll notify you as soon as we get another {carName} in stock.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Missed this one?</h3>
      <p className={styles.desc}>
        Leave your details and we'll let you know when a similar {carName} arrives in stock.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="alert-name">Name</label>
          <input type="text" id="alert-name" name="name" required />
        </div>
        
        <div className={styles.field}>
          <label htmlFor="alert-email">Email</label>
          <input type="email" id="alert-email" name="email" required />
        </div>

        {status === "error" && (
          <div className={styles.error}>Something went wrong. Please try again.</div>
        )}

        <button type="submit" disabled={status === "submitting"} className={styles.submitBtn}>
          {status === "submitting" ? "Sending..." : "Notify Me"}
        </button>
      </form>
    </div>
  );
}
