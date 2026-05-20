const LOGOS = [
  { name: "Colas", src: "/Colas.svg" },
  { name: "Dragon", src: "/Dragon.svg" },
  { name: "Hydroflow", src: "/Hydroflow.svg" },
  { name: "Kérastase", src: "/Kerastase.svg" },
  { name: "Parrotdog", src: "/Parrotdog.svg" },
  { name: "Solero", src: "/Solero.svg" },
  { name: "Streets", src: "/Streets.svg" },
  { name: "Swire", src: "/Swire.svg" },
  { name: "Unilever", src: "/Unilever.svg" },
  { name: "V", src: "/v.svg" },
];

export default function ClientMarquee() {
  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "48px 0 56px",
      }}
      aria-label="Trusted by"
    >
      <div className="container">
        <div className="eyebrow">Trusted by</div>
        <div className="logo-wall-grid">
          {LOGOS.map((logo) => (
            <div key={logo.name} className="logo-wall-item">
              <img src={logo.src} alt={logo.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
