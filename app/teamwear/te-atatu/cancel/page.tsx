"use client";

const FONT = "Helvetica, Arial, sans-serif";

export default function TeAtatuCancelPage() {
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
      <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "20px",
          }}
        >
          Te Atatū Netball Club · Team Store
        </div>

        <h1
          style={{
            fontSize: "clamp(40px, 9vw, 72px)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            textTransform: "uppercase",
            margin: "0 0 28px",
          }}
        >
          Payment not
          <br />
          completed
          <span style={{ color: "#b8f400" }}>.</span>
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.55)",
            margin: "0 0 36px",
          }}
        >
          Your order has not been placed. You can return to the store and try again.
        </p>

        <a
          href="/teamwear/te-atatu"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "52px",
            padding: "0 32px",
            borderRadius: "999px",
            background: "#b8f400",
            color: "#080808",
            textDecoration: "none",
            fontFamily: FONT,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Return to Store →
        </a>
      </div>
    </main>
  );
}
