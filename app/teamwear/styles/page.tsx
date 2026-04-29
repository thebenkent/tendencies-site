"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import FilterPill from "@/components/FilterPill";
import StyleCard from "@/components/StyleCard";

const PRIMARY_FILTERS = [
  "All",
  "Rugby",
  "League",
  "Netball",
  "Basketball",
  "Football",
  "Touch",
  "Hockey",
  "Off-Field",
];

const MORE_FILTERS = ["Cricket", "Baseball", "Lawn Bowls"];

const STYLE_CARDS = [
  { id: "touch-01",       sport: "Touch",       name: "Touch 01",       desc: "Lightest. Most minimal.",     image: "/teamwear/styles/touch-01.jpg" },
  { id: "rugby-01",       sport: "Rugby",       name: "Rugby 01",       desc: "Thicker shoulder block.",     image: "/teamwear/styles/rugby-01.jpg" },
  { id: "league-01",      sport: "League",      name: "League 01",      desc: "Sharper diagonal break.",     image: "/teamwear/styles/league-01.jpg" },
  { id: "netball-01",     sport: "Netball",     name: "Netball 01",     desc: "Elongated vertical flow.",    image: "/teamwear/styles/netball-01.jpg" },
  { id: "basketball-01",  sport: "Basketball",  name: "Basketball 01",  desc: "Sleeveless. Wider sides.",    image: "/teamwear/styles/basketball-01.jpg" },
  { id: "football-01",    sport: "Football",    name: "Football 01",    desc: "Ultra clean chest.",          image: "/teamwear/styles/football-01.jpg" },
  { id: "hockey-01",      sport: "Hockey",      name: "Hockey 01",      desc: "Subtle chest break.",         image: "/teamwear/styles/hockey-01.jpg" },
  { id: "cricket-01",     sport: "Cricket",     name: "Cricket 01",     desc: "Long sleeve. Super clean.",   image: "/teamwear/styles/cricket-01.jpg" },
  { id: "baseball-01",    sport: "Baseball",    name: "Baseball 01",    desc: "Button placket.",             image: "/teamwear/styles/baseball-01.jpg" },
  { id: "off-field-01",   sport: "Off-Field",   name: "Off-Field 01",   desc: "Hoodie version.",             image: "/teamwear/styles/off-field-01.jpg" },
  { id: "lawn-bowls-01",  sport: "Lawn Bowls",  name: "Lawn Bowls 01",  desc: "Polo base.",                  image: "/teamwear/styles/lawn-bowls-01.jpg" },
];

function MoreDropdown({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (sport: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasActiveMore = MORE_FILTERS.includes(active);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={styles.moreDropdown}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${styles.moreBtn} ${hasActiveMore ? styles.moreBtnActive : ""}`}
      >
        More
      </button>

      {open && (
        <div className={styles.moreMenu}>
          {MORE_FILTERS.map((sport) => (
            <button
              key={sport}
              type="button"
              onClick={() => {
                onSelect(sport);
                setOpen(false);
              }}
              className={`${styles.moreItem} ${
                active === sport ? styles.moreItemActive : ""
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamwearStylesPage() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? STYLE_CARDS
      : STYLE_CARDS.filter((style) => style.sport === active);

  return (
    <section className={styles.page}>
      <div className={styles.container}>

        <div className={styles.topRow}>
          <div className={styles.topLeft}>Start From A Style</div>
          <div className={styles.topRight}>
            Proven starting points<br />
            built into full kit
          </div>
        </div>

        <div className={styles.hero}>
          <div className={styles.eyebrow}>Teamwear · Styles</div>
          <h1 className={styles.heroTitle}>
            START FROM<br />
            A STYLE<span>.</span>
          </h1>
        </div>

        <div className={styles.intro}>
          <p>
            Choose a proven base design, then we customise colours, logos,
            sponsor placement, and the wider range.
            <br />
            <strong>Fastest path to kit.</strong>
          </p>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterLabel}>Filter by sport</div>

          <div className={styles.filterRow}>
            {PRIMARY_FILTERS.map((sport) => (
              <FilterPill
                key={sport}
                label={sport}
                active={active === sport}
                onClick={() => setActive(sport)}
              />
            ))}

            <MoreDropdown active={active} onSelect={setActive} />
          </div>
        </div>

        <div className={styles.countBar}>
          <div className={styles.countTitle}>
            {active === "All" ? "All Styles" : `${active} Styles`}
            <span className={styles.countMeta}>
              · {filtered.length} {filtered.length === 1 ? "style" : "styles"}
            </span>
          </div>

          <div className={styles.countHint}>
            Click a style to start a brief
          </div>
        </div>

        <div className={styles.stylesGrid}>
          {filtered.map((style) => (
            <StyleCard key={style.id} styleData={style} />
          ))}
        </div>

      </div>
    </section>
  );
}
