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
          if (car) {
            return { ...car, name: generateCarTitle(car) };
          }
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

  // ── Value parser: strips non-numeric chars, returns NaN-safe float ──
  const parseVal = (val: any): number => {
    if (val === null || val === undefined) return NaN;
    const parsed = parseFloat(String(val).replace(/[^0-9.]/g, ""));
    return isNaN(parsed) ? NaN : parsed;
  };

  // ── Generic numeric winner calculator ──────────────────────────────
  // Returns array of winning _ids. Returns [] when ALL cars tie or any
  // car has a missing/zero/NaN value for the field (no win vs empty).
  const getNumericWinners = (
    field: string,
    type: "high" | "low"
  ): string[] => {
    if (cars.length < 2) return [];

    // Only consider cars that have a real, non-zero value
    const valid = cars.filter(c => {
      const v = parseVal(c[field]);
      return !isNaN(v) && v > 0;
    });
    if (valid.length < 2) return []; // can't compare if < 2 have data

    const values = valid.map(c => parseVal(c[field]));
    const best = type === "high" ? Math.max(...values) : Math.min(...values);

    const winners = valid.filter(c => parseVal(c[field]) === best).map(c => c._id);

    // If every valid car ties → no winner
    if (winners.length === valid.length) return [];
    return winners;
  };

  // ── Losers helper (cars that are NOT winners and DO have a value) ───
  const getLosers = (field: string, winners: string[]): string[] => {
    if (winners.length === 0) return [];
    return cars
      .filter(c => {
        const v = parseVal(c[field]);
        return !isNaN(v) && v > 0 && !winners.includes(c._id);
      })
      .map(c => c._id);
  };

  // ── Service history winner ──────────────────────────────────────────
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
    // If ALL have full or NONE have full → tie, no winner
    if (fullCars.length === valid.length || fullCars.length === 0) return [];
    return fullCars.map(c => c._id);
  };

  // ── Pre-compute all winners ─────────────────────────────────────────
  const bhpWinners      = getNumericWinners("bhp",         "high");
  const speedWinners    = getNumericWinners("topSpeed",    "high");
  const accelWinners    = getNumericWinners("zeroToSixty", "low");
  const mileageWinners  = getNumericWinners("mileage",     "low");
  const economyWinners  = getNumericWinners("economy",     "high");
  const ownersWinners   = getNumericWinners("owners",      "low");
  const cheapestCars    = getNumericWinners("price",       "low");
  const historyWinners  = getHistoryWinners();

  // Pre-compute losers
  const bhpLosers     = getLosers("bhp",         bhpWinners);
  const speedLosers   = getLosers("topSpeed",    speedWinners);
  const accelLosers   = getLosers("zeroToSixty", accelWinners);
  const mileageLosers = getLosers("mileage",     mileageWinners);
  const economyLosers = getLosers("economy",     economyWinners);
  const ownersLosers  = getLosers("owners",      ownersWinners);
  const priceLosers   = getLosers("price",       cheapestCars);
  const historyLosers = historyWinners.length > 0
    ? cars.filter(c => {
        const v = c.serviceHistory;
        return v !== null && v !== undefined && String(v).trim() !== "" && !historyWinners.includes(c._id);
      }).map(c => c._id)
    : [];

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <div className="eyebrow">Side by side</div>
          <h1 className={styles.title}>Compare <em>your shortlist</em></h1>
          <p className={styles.subtitle}>Comparing {cars.length} car{cars.length !== 1 ? 's' : ''} · Differences highlighted in gold · Better value shown in green</p>
        </div>
        <div className={styles.hdrRight}>
          <div className={styles.legend}>
            <div className={styles.leg}><div className={styles.legDot} style={{background: 'var(--gold)'}}></div>Better spec</div>
            <div className={styles.leg}><div className={styles.legDot} style={{background: 'var(--green)'}}></div>Better value</div>
            <div className={styles.leg}><div className={styles.legDot} style={{background: 'var(--surface-3)'}}></div>Same / neutral</div>
          </div>
          {cars.length < 3 && (
            <Link href="/showroom" className={styles.addCarBtn}>+ Add a {cars.length === 0 ? "car" : "third car"}</Link>
          )}
        </div>
      </div>

      <div className={styles.compareWrap}>
        <table className={styles.compareTable}>
          <colgroup>
            <col style={{width: '220px'}} />
            {cars.map((c, i) => <col key={i} />)}
            {cars.length < 3 && <col style={{width: '180px'}} />}
          </colgroup>
          <thead>
            <tr>
              <td className={styles.colLabel}></td>
              
              {cars.map((car) => (
                <td key={car._id} className={styles.colCar}>
                  <div className={styles.carHeader}>
                    <div className={styles.carImgArea}>
                      {car.photo ? (
                        <Image src={car.photo.secure_url} alt={car.name} fill className={styles.carImg} />
                      ) : (
                        <span>No Image</span>
                      )}
                      {car.badge && <div className={styles.carWinnerBadge}>{car.badge}</div>}
                      <button className={styles.removeBtn} onClick={() => removeCompare(car.slug.current)}>✕</button>
                    </div>
                    <div className={styles.carName}>{car.name}</div>
                    <div className={styles.carYear}>{car.year} · {car.mileage?.toLocaleString()} miles</div>
                    <div className={`${styles.carPrice} ${cheapestCars.includes(car._id) ? styles.carPriceCheaper : ""}`}>
                      £{car.price?.toLocaleString()}
                    </div>
                    <div className={styles.carBtns}>
                      <Link href={`/showroom/${car.slug.current}#enquire`} className={styles.btnEnq}>Enquire about this car</Link>
                      <Link href={`/showroom/${car.slug.current}`} className={styles.btnView}>View full listing →</Link>
                    </div>
                  </div>
                </td>
              ))}

              {cars.length < 3 && (
                <td style={{padding: '0 0 0 16px', verticalAlign: 'top'}}>
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
              {/* PERFORMANCE */}
              <tr>
                <td className={styles.rowGroupHeader} colSpan={4}><span className={styles.groupLabelText}>Performance</span></td>
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Engine</span></td>
                {cars.map(car => (
                  <td key={car._id} className={styles.valCell}>
                    <div className={styles.val}>{car.engine || "N/A"}</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Power (bhp)</span></td>
                {cars.map(car => {
                  const isWin  = bhpWinners.includes(car._id);
                  const isLose = bhpLosers.includes(car._id);
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : isLose ? styles.valCellLose : ""}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : isLose ? styles.valLose : ""}`}>
                        {car.bhp || "N/A"} {isWin && <span className={styles.winTag}>Higher</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>0-60 mph</span></td>
                {cars.map(car => {
                  const isWin  = accelWinners.includes(car._id);
                  const isLose = accelLosers.includes(car._id);
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : isLose ? styles.valCellLose : ""}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : isLose ? styles.valLose : ""}`}>
                        {car.zeroToSixty ? `${car.zeroToSixty}s` : "N/A"} {isWin && <span className={styles.winTag}>Faster</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* PRACTICAL */}
              <tr>
                <td className={styles.rowGroupHeader} colSpan={4}><span className={styles.groupLabelText}>Practical</span></td>
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Mileage</span></td>
                {cars.map(car => {
                  const isWin  = mileageWinners.includes(car._id);
                  const isLose = mileageLosers.includes(car._id);
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : isLose ? styles.valCellLose : ""}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : isLose ? styles.valLose : ""}`}>
                        {car.mileage?.toLocaleString() || "N/A"} {isWin && <span className={styles.winTag}>Lower</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Economy (mpg)</span></td>
                {cars.map(car => {
                  const isWin  = economyWinners.includes(car._id);
                  const isLose = economyLosers.includes(car._id);
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : isLose ? styles.valCellLose : ""}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : isLose ? styles.valLose : ""}`}>
                        {car.economy || "N/A"} {isWin && <span className={styles.winTag}>Better</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Gearbox</span></td>
                {cars.map(car => (
                  <td key={car._id} className={styles.valCell}>
                    <div className={styles.val}>{car.gearbox || "N/A"}</div>
                  </td>
                ))}
              </tr>

              {/* HISTORY */}
              <tr>
                <td className={styles.rowGroupHeader} colSpan={4}><span className={styles.groupLabelText}>History &amp; Condition</span></td>
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Service History</span></td>
                {cars.map(car => {
                  const isWin  = historyWinners.includes(car._id);
                  const isLose = historyLosers.includes(car._id);
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : isLose ? styles.valCellLose : ""}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : isLose ? styles.valLose : ""}`}>
                        {car.serviceHistory || "N/A"} {isWin && <span className={styles.winTag}>Full</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Previous Owners</span></td>
                {cars.map(car => {
                  const isWin  = ownersWinners.includes(car._id);
                  const isLose = ownersLosers.includes(car._id);
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : isLose ? styles.valCellLose : ""}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : isLose ? styles.valLose : ""}`}>
                        {car.owners || "N/A"} {isWin && <span className={styles.winTag}>Fewer</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* PRICE */}
              <tr>
                <td className={styles.rowGroupHeader} colSpan={4}><span className={styles.groupLabelText}>Price</span></td>
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Asking Price</span></td>
                {cars.map(car => {
                  const isWin  = cheapestCars.includes(car._id);
                  const isLose = priceLosers.includes(car._id);
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isLose ? styles.valCellLose : ""}`}>
                      <div className={`${styles.val} ${isWin ? styles.carPriceCheaper : isLose ? styles.valLose : ""}`}>
                        £{car.price?.toLocaleString() || "N/A"} {isWin && <span className={styles.greenTag}>Cheaper</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </main>
  );
}
