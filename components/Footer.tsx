import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "64px 48px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "48px",
          alignItems: "start",
          marginBottom: "48px",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#f5f5f0",
              marginBottom: "8px",
            }}
          >
            Tendencies
          </div>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.5)",
              margin: 0,
            }}
          >
            Custom merch &amp; apparel.
            <br />
            Designed to be re-used.
          </p>
        </div>

        {/* Locations */}
        <div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "12px",
            }}
          >
            Locations
          </div>
          <div
            style={{
              fontSize: "13px",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Auckland
            <br />
            Melbourne
            <br />
            Shenzhen
          </div>
        </div>

       {/* Links */}

<div style={{ textAlign: "right" }}>

  <div

    style={{

      display: "flex",

      flexDirection: "column",

      gap: "8px",

    }}

  >

    <Link

      href="/work"

      className="link-lift"

      style={{

        fontSize: "12px",

        color: "rgba(255,255,255,0.6)",

        textDecoration: "none",

        transition: "color 0.2s ease",

      }}

    >

      Work

    </Link>

    <Link

      href="/catalogue"

      className="link-lift"

      style={{

        fontSize: "12px",

        color: "rgba(255,255,255,0.6)",

        textDecoration: "none",

        transition: "color 0.2s ease",

      }}

    >

      Catalogue

    </Link>

    <Link

      href="/about"

      className="link-lift"

      style={{

        fontSize: "12px",

        color: "rgba(255,255,255,0.6)",

        textDecoration: "none",

        transition: "color 0.2s ease",

      }}

    >

      About

    </Link>

    <Link

      href="/start-a-project"

      className="footer-link"

      style={{

        fontSize: "12px",

        color: "#b8f400",

        textDecoration: "none",

        transition: "opacity 0.2s ease",

      }}

    >

      Start a Project

    </Link>

  </div>

</div>
</div>
      {/* Footer bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "32px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: "10px",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <div>© 2025 Tendencies</div>
        <div>Since 2009</div>
      </div>
    </footer>
  );
}
