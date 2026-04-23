export default function TeamwearStylesPage() {
  const [activeSport, setActiveSport] = useState("All");
  const [showMore, setShowMore] = useState(false);

  const filtered =
    activeSport === "All"
      ? STYLES
      : STYLES.filter((s) => s.sport === activeSport);

  return (
    <section style={{ background: "#080808", color: "#f5f5f0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "96px 56px" }}>
        
        {/* HERO */}
        <Hero />

        {/* FILTERS */}
        <FilterBar
          activeSport={activeSport}
          setActiveSport={setActiveSport}
          showMore={showMore}
          setShowMore={setShowMore}
        />

        {/* GRID */}
        <StyleGrid styles={filtered} />

      </div>
    </section>
  );
}