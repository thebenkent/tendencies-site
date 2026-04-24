export default function Philosophy() {
  return (
    <>
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          margin: "120px 0 80px",
        }}
      />

      <section
        style={{
          background: "#0a0a0a",
          color: "#fff",
          padding: "0 48px 140px",
          marginTop: "-20px",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
              gap: "48px",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#b8f400",
                  marginBottom: "18px",
                }}
              >
                Our philosophy
              </div>

              <h2
                style={{
                  fontSize: "clamp(56px, 8vw, 96px)",
                  lineHeight: 0.92,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.05em",
                  margin: 0,
                  maxWidth: "920px",
                  color: "#f5f5f0",
                }}
              >
                <span style={{ opacity: 0.96 }}>Good Design.</span>
                <br />
                <span style={{ opacity: 0.96 }}>Better Product.</span>
                <br />
                <span style={{ color: "#b8f400" }}>Best Outcome.</span>
              </h2>
            </div>

            <div
              style={{
                paddingTop: "12px",
                maxWidth: "360px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.58)",
                }}
              >
                Most promo gets issued and ignored. We build things people
                actually want to keep. The framework is simple — the execution
                is what sets us apart.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}