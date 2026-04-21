export default function Header() {
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
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <a
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
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
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
            textDecoration: "none",
          }}
        >
          Work
        </a>

        <a
          href="/what-we-do"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
            textDecoration: "none",
          }}
        >
          What We Do
        </a>

        <a
          href="/process"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
            textDecoration: "none",
          }}
        >
          Process
        </a>

        <a
          href="/catalogue"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
            textDecoration: "none",
          }}
        >
          Catalogue
        </a>

        <a
          href="/teamwear"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
            textDecoration: "none",
          }}
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
  }}

>

  Start a Project

</a>
      </nav>
    </header>
  );
}