"use client";

const NAV_ITEMS = [
  { label: "All Products", href: "#apparel" },
  { label: "Apparel", href: "#apparel" },
  { label: "Headwear", href: "#apparel" },
  { label: "Drinkware", href: "#promotional" },
  { label: "Bags", href: "#promotional" },
  { label: "Office", href: "#promotional" },
  { label: "Custom", href: "#custom" },
];

export default function CatalogueNav({ isMobile }: { isMobile: boolean }) {
  return (
    <nav
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflowX: isMobile ? "auto" : "visible",
        WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
        scrollbarWidth: "none" as React.CSSProperties["scrollbarWidth"],
      }}
    >
      <div
        style={{
          display: "flex",
          gap: isMobile ? "0" : "2px",
          whiteSpace: "nowrap",
          minWidth: "fit-content",
        }}
      >
        {NAV_ITEMS.map((item, i) => (
          <a
            key={item.label}
            href={item.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: isMobile ? "14px 16px" : "14px 20px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: i === 0 ? 700 : 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: i === 0 ? "#b8f400" : "rgba(255,255,255,0.5)",
              textDecoration: "none",
              borderRight: "1px solid rgba(255,255,255,0.04)",
              transition: "color 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                i === 0 ? "#b8f400" : "rgba(255,255,255,0.5)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
