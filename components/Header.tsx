"use client";
export default function Header() {
  const navLinkStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.62)",
    textDecoration: "none",
    transition: "color 0.2s ease, opacity 0.2s ease",
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "64px",
        padding: "0 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(8,8,8,0.94)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <a
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <img
          src="/tendencies-logo.svg"
          alt="Tendencies"
          style={{
            height: "36px",
            width: "auto",
            display: "block",
          }}
        />
      </a>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <a
          href="/work"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.62)")
          }
        >
          Work
        </a>

        <a
          href="/what-we-do"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.62)")
          }
        >
          What We Do
        </a>

        <a
          href="/process"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.62)")
          }
        >
          How It Works
        </a>

        <a
          href="/catalogue"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.62)")
          }
        >
          Catalogue
        </a>

        <a
          href="/teamwear"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.62)")
          }
        >
          Teamwear
        </a>

        <a
          href="/start-a-project"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "38px",
            padding: "0 18px",
            borderRadius: "999px",
            background: "#b8f400",
            color: "#080808",
            textDecoration: "none",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Start a Project
        </a>
      </nav>
    </header>
  );
}