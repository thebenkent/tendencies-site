"use client";

const FONT = "Helvetica, Arial, sans-serif";

export default function TeAtatuSuccessPage() {
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
          Te Atatū Netball Club · Team Store
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
          Confirmed
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
          A confirmation has been emailed to you.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "28px",
            padding: "14px 20px",
            border: "1px solid rgba(255,255,255,0.12)",
            fontSize: "13px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.5,
            textAlign: "left",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#b8f400",
              flexShrink: 0,
            }}
          />
          Orders will be delivered to the club on 1 June 2026.
        </div>

        <div style={{ marginTop: "40px" }}>
          <a
            href="/teamwear/te-atatu"
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
            Back to Store
          </a>
        </div>
      </div>
    </main>
  );
}
