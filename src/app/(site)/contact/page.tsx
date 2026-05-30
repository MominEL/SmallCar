import { Metadata } from "next";
import { client } from "@/lib/sanity.client";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import { EnquiryForm } from "@/components/Showroom/EnquiryForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with SmallCar by PMS Motors or visit our Virginia Water showroom.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await client.fetch(siteSettingsQuery);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className="eyebrow">Get in touch</div>
            <h1 className={styles.title}>
              Let's <em>talk.</em>
            </h1>
            <p className={styles.subtitle}>
              Whether you've seen a car you like, or you just want to see what we have coming in, we're always happy to chat. Viewings are strictly by appointment.
            </p>
          </div>
        </div>
      </header>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Left: Contact Info */}
            <div className={styles.infoCol}>
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Visit us</h3>
                <p className={styles.infoText}>
                  {settings?.address || "Virginia Water, Surrey, GU25"}
                </p>
                <p className={styles.infoNote}>Viewings by appointment only.</p>
              </div>

              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Contact</h3>
                <p className={styles.infoText}>
                  <a href={`tel:${settings?.phone}`} className={styles.link}>
                    {settings?.phone || "01344 000000"}
                  </a>
                </p>
                <p className={styles.infoText}>
                  <a href={`mailto:${settings?.email}`} className={styles.link}>
                    {settings?.email || "hello@smallcar.co.uk"}
                  </a>
                </p>
                {settings?.whatsapp && (
                  <p className={styles.infoText}>
                    <a 
                      href={`https://wa.me/${settings.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      WhatsApp us
                    </a>
                  </p>
                )}
              </div>

              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Opening Hours</h3>
                {settings?.openingHours ? (
                  <div className={styles.hoursList}>
                    {settings.openingHours.map((slot: any, i: number) => (
                      <div key={i} className={styles.hoursRow}>
                        <span>{slot.day}</span>
                        <span>{slot.hours}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.hoursList}>
                    <div className={styles.hoursRow}>
                      <span>Monday – Friday</span>
                      <span>9am – 6pm</span>
                    </div>
                    <div className={styles.hoursRow}>
                      <span>Saturday</span>
                      <span>10am – 4pm</span>
                    </div>
                    <div className={styles.hoursRow}>
                      <span>Sunday</span>
                      <span>By appointment</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Map */}
            <div className={styles.mapCol}>
              <div className={styles.mapWrap}>
                {settings?.googleMapsUrl ? (
                  <iframe
                    src={settings.googleMapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className={styles.mapPlaceholder}>
                    <span>Map embed goes here</span>
                    <p>Add Google Maps URL in Sanity Settings</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Enquiry Form */}
            <div className={styles.formCol}>
              <EnquiryForm carName="General Enquiry" carId="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
