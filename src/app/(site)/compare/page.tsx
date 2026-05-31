"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity.client";
import { useCompare } from "@/hooks/useCompare";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { generateCarTitle } from "@/lib/titleSystem";

export default function ComparePage() {
  const { compareCars, removeCompare, mounted } = useCompare();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;

    if (compareCars.length === 0) {
      setCars([]);
      setLoading(false);
      return;
    }

    const fetchCars = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "car" && slug.current in $slugs] {
          _id,
          model,
          variant,
          slug,
          "make": select(make == "Other" => customMake, make),
          badge,
          "photo": photos[0],
          year,
          mileage,
          price,
          gearbox,
          engine,
          bhp,
          zeroToSixty,
          topSpeed,
          fuelType,
          economy,
          owners,
          serviceHistory,
          hpiClear,
          motExpiry
        }`;
        const data = await client.fetch(query, { slugs: compareCars });

        // Preserve order based on compareCars array
        const ordered = compareCars.map(slug => {
          const car = data.find((c: any) => c.slug.current === slug);
          if (car) return { ...car, name: generateCarTitle(car) };
          return null;
        }).filter(Boolean);

        setCars(ordered);
      } catch (err) {
        console.error("Failed to fetch compare cars", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [compareCars, mounted]);

  if (!mounted || loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>Loading comparison...</div>
      </main>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────
  if (cars.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <div className="eyebrow">Side by side</div>
            <h1 className={styles.title}>Compare <em>your shortlist</em></h1>
            <p className={styles.subtitle}>Save cars using the scale icon, then come back here to compare them.</p>
          </div>
        </div>
        <div className={styles.noCars}>
          <p>You haven't added any cars to compare yet.</p>
          <Link href="/showroom" className={styles.addCarBtn} style={{ marginTop: 20, display: 'inline-block' }}>
            Browse the showroom →
          </Link>
        </div>
      </main>
    );
  }

  // ── Value parser: strips non-numeric chars, returns NaN-safe float ──
  const parseVal = (val: any): number => {
    if (val === null || val === undefined) return NaN;
    const parsed = parseFloat(String(val).replace(/[^0-9.]/g, ""));
    return isNaN(parsed) ? NaN : parsed;
  };

  // ── Generic numeric winner calculator ──────────────────────────────
  const getNumericWinners = (field: string, type: "high" | "low"): string[] => {
    if (cars.length < 2) return [];
    const valid = cars.filter(c => {
      const v = parseVal(c[field]);
      return !isNaN(v) && v > 0;
    });
    if (valid.length < 2) return [];
    const values = valid.map(c => parseVal(c[field]));
    const best = type === "high" ? Math.max(...values) : Math.min(...values);
    const winners = valid.filter(c => parseVal(c[field]) === best).map(c => c._id);
    if (winners.length === valid.length) return []; // all tie
    return winners;
  };

  // ── Losers: have a value but aren't the winner ─────────────────────
  const getLosers = (field: string, winners: string[]): string[] => {
    if (winners.length === 0) return [];
    return cars
      .filter(c => {
        const v = parseVal(c[field]);
        return !isNaN(v) && v > 0 && !winners.includes(c._id);
      })
      .map(c => c._id);
  };

  // ── Service history winner ─────────────────────────────────────────
  const getHistoryWinners = (): string[] => {
    if (cars.length < 2) return [];
    const valid = cars.filter(c => {
      const v = c.serviceHistory;
      return v !== null && v !== undefined && String(v).trim() !== "";
    });
    if (valid.length < 2) return [];
    const fullCars = valid.filter(c =>
      String(c.serviceHistory).toLowerCase().trim().includes("full")
    );
    if (fullCars.length === valid.length || fullCars.length === 0) return [];
    return fullCars.map(c => c._id);
  };

  // ── Pre-compute all winners & losers ──────────────────────────────
  const bhpWinners     = getNumericWinners("bhp",         "high");
  const speedWinners   = getNumericWinners("topSpeed",    "high");
  const accelWinners   = getNumericWinners("zeroToSixty", "low");
  const mileageWinners = getNumericWinners("mileage",     "low");
  const economyWinners = getNumericWinners("economy",     "high");
  const ownersWinners  = getNumericWinners("owners",      "low");
  const cheapestCars   = getNumericWinners("price",       "low");
  const historyWinners = getHistoryWinners();

  const bhpLosers      = getLosers("bhp",         bhpWinners);
  const speedLosers    = getLosers("topSpeed",    speedWinners);
  const accelLosers    = getLosers("zeroToSixty", accelWinners);
  const mileageLosers  = getLosers("mileage",     mileageWinners);
  const economyLosers  = getLosers("economy",     economyWinners);
  const ownersLosers   = getLosers("owners",      ownersWinners);
  const priceLosers    = getLosers("price",       cheapestCars);
  const historyLosers  = historyWinners.length > 0
    ? cars.filter(c => {
        const v = c.serviceHistory;
        return v !== null && v !== undefined && String(v).trim() !== "" && !historyWinners.includes(c._id);
      }).map(c => c._id)
    : [];

  // colSpan = label col + car cols + (empty slot col if < 3)
  const totalCols = 1 + cars.length + (cars.length < 3 ? 1 : 0);

  // Helper to render a numeric data row cleanly
  const renderRow = (
    label: string,
    winners: string[],
    losers: string[],
    getValue: (car: any) => string,
    tag: string,
    isGreen = false
  ) => (
    <tr>
      <td className={styles.rowLabelCell}><span className={styles.labelText}>{label}</span></td>
      {cars.map(car => {
        const isWin  = winners.includes(car._id);
        const isLose = losers.includes(car._id);
        return (
          <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : isLose ? styles.valCellLose : ""}`}>
            <div className={`${styles.val} ${isWin ? styles.valWin : isLose ? styles.valLose : ""}`}>
              {getValue(car)}
              {isWin && <span className={isGreen ? styles.greenTag : styles.winTag}>{tag}</span>}
            </div>
          </td>
        );
      })}
      {cars.length < 3 && <td className={styles.valCellEmpty} />}
    </tr>
  );

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <div className="eyebrow">Side by side</div>
          <h1 className={styles.title}>Compare <em>your shortlist</em></h1>
          <p className={styles.subtitle}>
            Comparing {cars.length} car{cars.length !== 1 ? "s" : ""} · Differences highlighted in gold · Better value shown in green
          </p>
        </div>
        <div className={styles.hdrRight}>
          <div className={styles.legend}>
            <div className={styles.leg}><div className={styles.legDot} style={{ background: "var(--gold)" }} />Better spec</div>
            <div className={styles.leg}><div className={styles.legDot} style={{ background: "var(--green)" }} />Better value</div>
            <div className={styles.leg}><div className={styles.legDot} style={{ background: "var(--surface-3)" }} />Same / neutral</div>
          </div>
          {cars.length < 3 && (
            <Link href="/showroom" className={styles.addCarBtn}>
              + Add {cars.length === 1 ? "another car" : "a third car"}
            </Link>
          )}
        </div>
      </div>

      <div className={styles.compareWrap}>
        <table className={styles.compareTable}>
          <colgroup>
            <col style={{ width: "200px" }} />
            {cars.map((_, i) => <col key={i} />)}
            {cars.length < 3 && <col style={{ width: "160px" }} />}
          </colgroup>

          <thead>
            <tr>
              <td className={styles.colLabel} />
              {cars.map((car) => (
                <td key={car._id} className={styles.colCar}>
                  <div className={styles.carHeader}>
                    <div className={styles.carImgArea}>
                      {car.photo ? (
                        <Image src={car.photo.secure_url} alt={car.name} fill className={styles.carImg} />
                      ) : (
                        <div className={styles.noImg}>No image</div>
                      )}
                      {car.badge && <div className={styles.carWinnerBadge}>{car.badge}</div>}
                      <button className={styles.removeBtn} onClick={() => removeCompare(car.slug.current)} title="Remove from comparison">✕</button>
                    </div>
                    <div className={styles.carName}>{car.name}</div>
                    <div className={styles.carYear}>{car.year} · {car.mileage?.toLocaleString()} miles · {car.gearbox || "—"}</div>
                    <div className={`${styles.carPrice} ${cheapestCars.includes(car._id) ? styles.carPriceCheaper : ""}`}>
                      £{car.price?.toLocaleString()}
                      {cheapestCars.includes(car._id) && cars.length > 1 && (
                        <span className={styles.carPriceBadge}>Best price</span>
                      )}
                    </div>
                    <div className={styles.carBtns}>
                      <Link href={`/showroom/${car.slug.current}#enquire`} className={styles.btnEnq}>Enquire about this car</Link>
                      <Link href={`/showroom/${car.slug.current}`} className={styles.btnView}>View full listing →</Link>
                    </div>
                  </div>
                </td>
              ))}
              {cars.length < 3 && (
                <td style={{ padding: "0 0 0 12px", verticalAlign: "top" }}>
                  <Link href="/showroom" className={styles.emptyCar}>
                    <div className={styles.emptyIcon}>+</div>
                    <div className={styles.emptyTitle}>Add a car</div>
                    <div className={styles.emptySub}>Compare up to 3 cars side by side</div>
                  </Link>
                </td>
              )}
            </tr>
          </thead>

          {cars.length > 0 && (
            <tbody>
              {/* ── PERFORMANCE ── */}
              <tr>
                <td className={styles.rowGroupHeader} colSpan={totalCols}>
                  <span className={styles.groupLabelText}>Performance</span>
                </td>
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Engine</span></td>
                {cars.map(car => (
                  <td key={car._id} className={styles.valCell}>
                    <div className={styles.val}>{car.engine || "N/A"}</div>
                  </td>
                ))}
                {cars.length < 3 && <td className={styles.valCellEmpty} />}
              </tr>
              {renderRow("Power (bhp)",  bhpWinners,   bhpLosers,   car => car.bhp        ? `${car.bhp} bhp`    : "N/A", "Higher")}
              {renderRow("0–60 mph",     accelWinners, accelLosers, car => car.zeroToSixty ? `${car.zeroToSixty}s` : "N/A", "Faster")}
              {renderRow("Top speed",    speedWinners, speedLosers, car => car.topSpeed    ? `${car.topSpeed} mph` : "N/A", "Higher")}
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Fuel type</span></td>
                {cars.map(car => (
                  <td key={car._id} className={styles.valCell}>
                    <div className={styles.val}>{car.fuelType || "N/A"}</div>
                  </td>
                ))}
                {cars.length < 3 && <td className={styles.valCellEmpty} />}
              </tr>

              {/* ── PRACTICAL ── */}
              <tr>
                <td className={styles.rowGroupHeader} colSpan={totalCols}>
                  <span className={styles.groupLabelText}>Practical</span>
                </td>
              </tr>
              {renderRow("Mileage",      mileageWinners, mileageLosers, car => car.mileage ? car.mileage.toLocaleString() + " mi" : "N/A", "Lower")}
              {renderRow("Economy (mpg)", economyWinners, economyLosers, car => car.economy ? `${car.economy} mpg` : "N/A", "Better")}
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Gearbox</span></td>
                {cars.map(car => (
                  <td key={car._id} className={styles.valCell}>
                    <div className={styles.val}>{car.gearbox || "N/A"}</div>
                  </td>
                ))}
                {cars.length < 3 && <td className={styles.valCellEmpty} />}
              </tr>

              {/* ── HISTORY & CONDITION ── */}
              <tr>
                <td className={styles.rowGroupHeader} colSpan={totalCols}>
                  <span className={styles.groupLabelText}>History &amp; Condition</span>
                </td>
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Service History</span></td>
                {cars.map(car => {
                  const isWin  = historyWinners.includes(car._id);
                  const isLose = historyLosers.includes(car._id);
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : isLose ? styles.valCellLose : ""}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : isLose ? styles.valLose : ""}`}>
                        {car.serviceHistory || "N/A"}
                        {isWin && <span className={styles.winTag}>Full</span>}
                      </div>
                    </td>
                  );
                })}
                {cars.length < 3 && <td className={styles.valCellEmpty} />}
              </tr>
              {renderRow("Previous owners", ownersWinners, ownersLosers, car => car.owners != null ? `${car.owners}` : "N/A", "Fewer")}
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>HPI Clear</span></td>
                {cars.map(car => (
                  <td key={car._id} className={styles.valCell}>
                    <div className={`${styles.val} ${car.hpiClear ? styles.valYes : ""}`}>
                      {car.hpiClear == null ? "N/A" : car.hpiClear ? "✓ Clear" : "✗ Not clear"}
                    </div>
                  </td>
                ))}
                {cars.length < 3 && <td className={styles.valCellEmpty} />}
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>MOT expiry</span></td>
                {cars.map(car => (
                  <td key={car._id} className={styles.valCell}>
                    <div className={styles.val}>{car.motExpiry || "N/A"}</div>
                  </td>
                ))}
                {cars.length < 3 && <td className={styles.valCellEmpty} />}
              </tr>

              {/* ── PRICE ── */}
              <tr>
                <td className={styles.rowGroupHeader} colSpan={totalCols}>
                  <span className={styles.groupLabelText}>Price</span>
                </td>
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Asking price</span></td>
                {cars.map(car => {
                  const isWin  = cheapestCars.includes(car._id);
                  const isLose = priceLosers.includes(car._id);
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isLose ? styles.valCellLose : ""}`}>
                      <div className={`${styles.val} ${isWin ? styles.carPriceCheaper : isLose ? styles.valLose : ""}`}
                           style={{ fontFamily: "var(--font-playfair)", fontSize: "16px" }}>
                        £{car.price?.toLocaleString() || "N/A"}
                        {isWin && <span className={styles.greenTag}>Cheaper</span>}
                      </div>
                    </td>
                  );
                })}
                {cars.length < 3 && <td className={styles.valCellEmpty} />}
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </main>
  );
}
