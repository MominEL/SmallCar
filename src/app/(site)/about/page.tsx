import { Metadata } from "next";
import { client } from "@/lib/sanity.client";
import { siteSettingsQuery, teamMembersQuery } from "@/lib/sanity.queries";
import { RichText } from "@/components/RichText/RichText";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about PMS Motors and our philosophy for sourcing the finest premium city cars in Surrey.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await client.fetch(siteSettingsQuery);
  const team = await client.fetch(teamMembersQuery);

  
  
  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className="eyebrow">Our Story</div>
            <h1 className={styles.title}>
              Not just another <em>dealership.</em>
            </h1>
            <div className={styles.heroImageWrap}>
              {/* Fallback image if no sanity image, but we'll just use a placeholder for now */}
              <div className={styles.heroImagePlaceholder}>
                <span className={styles.placeholderText}>Showroom exterior photo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Story Section ── */}
      <section className={`section ${styles.storySection}`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyLeft}>
              <h2 className={styles.sectionTitle}>
                Built on a simple idea: <em>better cars, honest people.</em>
              </h2>
            </div>
            <div className={styles.storyRight}>
              {settings?.aboutStory ? (
                <RichText value={settings.aboutStory} />
              ) : (
                <p className={styles.fallbackText}>
                  SmallCar by PMS Motors was born out of a frustration with the traditional used car market. 
                  We believe buying a car should be exciting, transparent, and pressure-free. 
                  We focus exclusively on premium city cars because they offer the best balance of character, 
                  economy, and driving joy. Every car we sell is one we would be happy to own ourselves.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueNum}>01</div>
              <h3 className={styles.valueTitle}>Hand-picked</h3>
              <p className={styles.valueText}>
                We reject 9 out of 10 cars we view. If it doesn't have the right history, the right spec, and the right feel, it doesn't make it to our showroom.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueNum}>02</div>
              <h3 className={styles.valueTitle}>No pressure</h3>
              <p className={styles.valueText}>
                We don't do hard sales. We give you the keys, point you towards the coffee machine, and let you make up your own mind in your own time.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueNum}>03</div>
              <h3 className={styles.valueTitle}>Absolute clarity</h3>
              <p className={styles.valueText}>
                Every scratch, every service, every detail is documented. We HPI check every vehicle and provide a comprehensive warranty as standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      {team?.length > 0 && (
        <section className={`section ${styles.teamSection}`}>
          <div className="container">
            <div className="eyebrow">The People</div>
            <h2 className={styles.sectionTitle}>Meet the <em>team.</em></h2>
            
            <div className={styles.teamGrid}>
              {team.map((member: any) => (
                <div key={member._id} className={styles.teamCard}>
                  <div className={styles.avatar}>
                    {member.initial || member.name.charAt(0)}
                  </div>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  {member.bio && <p className={styles.memberBio}>{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
