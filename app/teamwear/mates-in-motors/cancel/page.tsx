"use client";

const FONT = "Helvetica, Arial, sans-serif";

export default function MIMCancelPage() {
  return (
    <main
      style={{
        background: "#080808",
        color: "#f5f5f0",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "80px 24px",
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#b8f400",
            marginBottom: "20px",
          }}
        >
          Mates in Motors · Team Store
        </div>

        <h1
          style={{
            fontSize: "clamp(48px, 10vw, 88px)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            textTransform: "uppercase",
            margin: "0 0 28px",
          }}
        >
          Order
          <br />
          Cancelled
          <span style={{ color: "#b8f400" }}>.</span>
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.65)",
            margin: "0 0 8px",
          }}
        >
          No payment was taken. You can go back and try again.
        </p>

        <div style={{ marginTop: "40px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/teamwear/mates-in-motors"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              padding: "0 26px",
              borderRadius: "999px",
              background: "#b8f400",
              color: "#000",
              textDecoration: "none",
              fontFamily: FONT,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Try again
          </a>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              padding: "0 26px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#f5f5f0",
              textDecoration: "none",
              fontFamily: FONT,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Home
          </a>
        </div>
      </div>
    </main>
  );
}
