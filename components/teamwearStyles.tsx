"use client";

import { useState } from "react";

const STYLES = [
  {
    id: "1",
    name: "Training Tee",
    sport: "All",
    image: "/placeholder.jpg",
    line: "Lightweight performance",
    href: "/teamwear/brief",
  },
];

function Hero() {
  return <h1 style={{ fontSize: "48px", margin: 0 }}>Teamwear Styles</h1>;
}

function FilterBar({
  activeSport,
  setActiveSport,
}: {
  activeSport: string;
  setActiveSport: (v: string) => void;
  showMore?: boolean;
  setShowMore?: (v: boolean) => void;
}) {
  return (
    <div>
      <button onClick={() => setActiveSport("All")}>All</button>
    </div>
  );
}

function StyleGrid({ styles }: { styles: any[] }) {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      {styles.map((s) => (
        <a key={s.id} href={s.href} style={{ color: "#f5f5f0" }}>
          {s.name}
        </a>
      ))}
    </div>
  );
}

export default function TeamwearStylesPage() {
  const [activeSport, setActiveSport] = useState("All");
  const [showMore, setShowMore] = useState(false);

  const filtered =
    activeSport === "All"
      ? STYLES
      : STYLES.filter((s: any) => s.sport === activeSport);

  return (
    <section
      style={{
        background: "#080808",
        color: "#f5f5f0",
        padding: "96px 56px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <Hero />

        <div style={{ marginTop: "56px" }}>
          <FilterBar
            activeSport={activeSport}
            setActiveSport={setActiveSport}
            showMore={showMore}
            setShowMore={setShowMore}
          />
        </div>

        <div style={{ marginTop: "56px" }}>
          <StyleGrid styles={filtered} />
        </div>
      </div>
    </section>
  );
}