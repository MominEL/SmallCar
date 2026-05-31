"use client";

import { useState } from "react";
import styles from "./EnquiryForm.module.css";

interface EnquiryFormProps {
  carName: string;
  carId: string;
}

export function EnquiryForm({ carName, carId }: EnquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      carName,
      carId,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`${styles.form} ${styles.success}`}>
        <div className={styles.icon}>✓</div>
        <h4 className={styles.successTitle}>{carId ? "Enquiry sent" : "Message sent"}</h4>
        <p className={styles.successText}>
          Thank you. We have received your {carId ? `enquiry about the ${carName}` : "message"}. 
          We aim to respond to all messages on the same day.
        </p>
        <button className="btn btn-ghost" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h3 className={styles.title}>{carId ? "Enquire about this car" : "Send us a message"}</h3>
        <p className={styles.subtitle}>
          No pressure, no obligation. Ask us a question or arrange a viewing.
        </p>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required placeholder="Jane Doe" />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="jane@example.com" />
          </div>
          <div className={styles.field}>
            <label htmlFor="phone">Phone (optional)</label>
            <input type="tel" id="phone" name="phone" placeholder="07123 456789" />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="message">Message</label>
          <textarea 
            id="message" 
            name="message" 
            required 
            placeholder={carId ? `I'm interested in the ${carName}...` : "How can we help you?"}
          />
        </div>
      </div>

      {status === "error" && (
        <div className={styles.error}>
          Sorry, there was a problem sending your message. Please try again or contact us directly.
        </div>
      )}

      <button 
        type="submit" 
        className={`btn btn-primary ${styles.submit}`}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : carId ? "Send enquiry" : "Send message"}
      </button>

      <p className={styles.note}>
        Your details will only be used to respond to this enquiry.
      </p>
    </form>
  );
}
