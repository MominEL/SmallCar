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

  // Calculate Winners
  const getWinners = (field: string, type: "high" | "low" = "high", isNumeric: boolean = true) => {
    if (cars.length < 2) return [];
    
    let validCars = cars.filter(c => c[field] !== undefined && c[field] !== null && c[field] !== "");
    if (validCars.length < 2) return [];

    let bestValue = isNumeric ? parseFloat(validCars[0][field]) : validCars[0][field];

    for (let i = 1; i < validCars.length; i++) {
      const val = isNumeric ? parseFloat(validCars[i][field]) : validCars[i][field];
      if (type === "high" && val > bestValue) {
        bestValue = val;
      } else if (type === "low" && val < bestValue) {
        bestValue = val;
      }
    }
    
    const winners = validCars.filter(c => {
      const val = isNumeric ? parseFloat(c[field]) : c[field];
      return val === bestValue;
    }).map(c => c._id);
    
    if (winners.length === validCars.length) return [];
    return winners;
  };

  const getCheapestCars = () => {
    if (cars.length < 2) return [];
    let validCars = cars.filter(c => c.price !== undefined && c.price !== null && c.price !== "");
    if (validCars.length < 2) return [];
    
    let min = parseFloat(validCars[0].price);
    for (let i = 1; i < validCars.length; i++) {
      const price = parseFloat(validCars[i].price);
      if (price < min) {
        min = price;
      }
    }
    const winners = validCars.filter(c => parseFloat(c.price) === min).map(c => c._id);
    if (winners.length === validCars.length) return [];
    return winners;
  };

  const bhpWinners = getWinners("bhp", "high", true);
  const speedWinners = getWinners("topSpeed", "high", true);
  const accelWinners = getWinners("zeroToSixty", "low", true);
  const mileageWinners = getWinners("mileage", "low", true);
  const economyWinners = getWinners("economy", "high", true);
  const ownersWinners = getWinners("owners", "low", true);
  const cheapestCars = getCheapestCars();

  const getHistoryWinners = () => {
    if (cars.length < 2) return [];
    const validCars = cars.filter(c => c.serviceHistory !== undefined && c.serviceHistory !== null && c.serviceHistory !== "");
    if (validCars.length < 2) return [];
    
    const fullCars = validCars.filter(c => c.serviceHistory.toLowerCase().includes("full") || c.serviceHistory.toLowerCase().includes("fill"));
    if (fullCars.length === validCars.length || fullCars.length === 0) return [];
    return fullCars.map(c => c._id);
  };
  const historyWinners = getHistoryWinners();

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
                    <div className={`${styles.carPrice} ${cheapestCar === car._id ? styles.carPriceCheaper : ""}`}>
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
                  const isWin = bhpWinners.includes(car._id);
                  const hasWinner = bhpWinners.length > 0;
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : (hasWinner ? styles.valCellLose : "")}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : (hasWinner ? styles.valLose : "")}`}>
                        {car.bhp || "N/A"} {isWin && <span className={styles.winTag}>Higher</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>0-60 mph</span></td>
                {cars.map(car => {
                  const isWin = accelWinners.includes(car._id);
                  const hasWinner = accelWinners.length > 0;
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : (hasWinner ? styles.valCellLose : "")}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : (hasWinner ? styles.valLose : "")}`}>
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
                  const isWin = mileageWinners.includes(car._id);
                  const hasWinner = mileageWinners.length > 0;
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : (hasWinner ? styles.valCellLose : "")}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : (hasWinner ? styles.valLose : "")}`}>
                        {car.mileage?.toLocaleString() || "N/A"} {isWin && <span className={styles.winTag}>Lower</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Economy (mpg)</span></td>
                {cars.map(car => {
                  const isWin = economyWinners.includes(car._id);
                  const hasWinner = economyWinners.length > 0;
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : (hasWinner ? styles.valCellLose : "")}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : (hasWinner ? styles.valLose : "")}`}>
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
                <td className={styles.rowGroupHeader} colSpan={4}><span className={styles.groupLabelText}>History & Condition</span></td>
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Service History</span></td>
                {cars.map(car => {
                  const isWin = historyWinners.includes(car._id);
                  const hasWinner = historyWinners.length > 0;
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : (hasWinner ? styles.valCellLose : "")}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : (hasWinner ? styles.valLose : "")}`}>
                        {car.serviceHistory || "N/A"} {isWin && <span className={styles.winTag}>Full</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className={styles.rowLabelCell}><span className={styles.labelText}>Previous Owners</span></td>
                {cars.map(car => {
                  const isWin = ownersWinners.includes(car._id);
                  const hasWinner = ownersWinners.length > 0;
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? styles.valCellWin : (hasWinner ? styles.valCellLose : "")}`}>
                      <div className={`${styles.val} ${isWin ? styles.valWin : (hasWinner ? styles.valLose : "")}`}>
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
                  const isWin = cheapestCars.includes(car._id);
                  const hasWinner = cheapestCars.length > 0;
                  return (
                    <td key={car._id} className={`${styles.valCell} ${isWin ? "" : (hasWinner ? styles.valCellLose : "")}`}>
                      <div className={`${styles.val} ${isWin ? styles.carPriceCheaper : (hasWinner ? styles.valLose : "")}`}>
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
