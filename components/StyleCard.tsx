"use client";

type StyleCardData = {
  id: string;
  sport: string;
  name: string;
  desc: string;
  image: string;
};

type StyleCardProps = {
  styleData: StyleCardData;
};

export default function StyleCard({ styleData }: StyleCardProps) {
  return (
    <a
      href={`/teamwear/brief?style=${styleData.id}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#0f0f0f",
          overflow: "hidden",
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            background: "#121212",
          }}
        >
          <img
            src={styleData.image}
            alt={styleData.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div style={{ padding: "16px" }}>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#f5f5f0",
              marginBottom: "6px",
            }}
          >
            {styleData.name}
          </div>

          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.44)",
              marginBottom: "10px",
            }}
          >
            {styleData.sport}
          </div>

          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "13px",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.56)",
            }}
          >
            {styleData.desc}
          </div>
        </div>
      </div>
    </a>
  );
}