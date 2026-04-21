"use client";

// -----------------------------------------------------------------------------
// Image mapping — all card/feature images live at /public/work-*.jpg
//   • /work-streets-finished.jpg   → Streets Ice Cream resin keychains (final)
//   • /work-streets-prototype.jpg  → Streets prototypes (used in case study)
//   • /work-milo.jpg               → Nestlé Milo promotional soccer ball
//   • /work-lynx.jpg               → Unilever / Lynx promotional vest
//   • /work-knitwear.jpg           → Swire corporate knitwear
//   • /work-kerastase.jpg          → Kérastase satin pillowcase GWP
//   • /work-colas.jpg              → Colas civil construction teamwear
// -----------------------------------------------------------------------------

const PROJECTS = [
  {
    client: "Streets Ice Cream",
    title: "Resin Keychains",
    tag: "Custom Product",
    image: "/work-streets-finished.jpg",
    href: "/work/streets-keychains",
  },
  {
    client: "Nestlé Milo",
    title: "Promotional Soccer Ball",
    tag: "Promotional",
    image: "/work-milo.jpg",
    href: "/work",
  },
  {
    client: "Unilever / Lynx",
    title: "Promotional Vest",
    tag: "Apparel",
    image: "/work-lynx.jpg",
    href: "/work",
  },
  {
    client: "Swire",
    title: "Embroidered Knitwear",
    tag: "Apparel",
    image: "/work-knitwear.jpg",
    href: "/work",
  },
  {
    client: "Kérastase",
    title: "Satin Pillowcase GWP",
    tag: "GWP",
    image: "/work-kerastase.jpg",
    href: "/work",
  },
  {
    client: "Colas",
    title: "Civil Construction Teamwear",
    tag: "Teamwear",
    image: "/work-colas.jpg",
    href: "/work",
  },
];

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48px",
        padding: "0 26px",
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
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.86")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </a>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48px",
        padding: "0 24px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "#ffffff",
        textDecoration: "none",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: "transparent",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </a>
  );
}

function WorkCard({
  project,
  large = false,
}: {
  project: (typeof PROJECTS)[0];
  large?: boolean;
}) {
  return (
    <a
      href={project.href}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "block",
        minHeight: large ? "560px" : "320px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0f0f0f",
        textDecoration: "none",
      }}
    >
      <img
        src={project.image}
        alt={`${project.client} — ${project.title}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: large ? "brightness(0.78)" : "brightness(0.72)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: large
            ? "linear-gradient(to top, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.28) 52%, transparent 100%)"
            : "linear-gradient(to top, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.42) 55%, transparent 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          background: "rgba(8,8,8,0.82)",
          color: "#b8f400",
          border: "1px solid rgba(255,255,255,0.12)",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "7px 10px",
        }}
      >
        {project.tag}
      </div>

      <div
        style={{
          position: "absolute",
          right: "16px",
          top: "16px",
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "14px",
        }}
      >
        ↗
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: large ? "28px" : "22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            marginBottom: "8px",
          }}
        >
          {project.client}
        </div>

        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: large ? "clamp(28px, 2.4vw, 38px)" : "22px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.95,
            marginBottom: "10px",
            maxWidth: large ? "420px" : "280px",
          }}
        >
          {project.title}
        </div>

        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "13px",
            color: "rgba(255,255,255,0.62)",
            lineHeight: 1.6,
            maxWidth: large ? "340px" : "260px",
          }}
        >
          View project
        </div>
      </div>
    </a>
  );
}

export default function WorkPage() {
  return (
    <section
      style={{
        background: "#080808",
        color: "#f5f5f0",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "116px 48px 0",
        }}
      >
        {/* HERO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "start",
            gap: "24px",
            marginBottom: "26px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginBottom: "6px",
              }}
            >
              Since · 2009
            </div>

            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.56)",
              }}
            >
              Auckland · Melbourne · Shenzhen
            </div>
          </div>

          <div
            style={{
              justifySelf: "end",
              textAlign: "right",
              maxWidth: "360px",
            }}
          >
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.45,
              }}
            >
              Selected work
              <br />
              built to be used
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b8f400",
              marginBottom: "18px",
            }}
          >
            Work
          </div>

          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "clamp(72px, 10vw, 152px)",
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            WORK
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            DONE RIGHT
            <span style={{ color: "#b8f400" }}>.</span>
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "32px",
            alignItems: "center",
            paddingTop: "22px",
            paddingBottom: "72px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.48)",
                margin: 0,
              }}
            >
              A selection of branded product, apparel, giveaways, and custom
              projects designed to be used — not ignored.
              <br />
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                Work we&rsquo;re proud to put our name on.
              </span>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <PrimaryButton href="/start-a-project">Start a Project</PrimaryButton>
            <SecondaryButton href="/what-we-do">What We Do</SecondaryButton>
          </div>
        </div>

        {/* GRID */}
        <section
          style={{
            padding: "0 0 108px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: "14px",
              paddingTop: "28px",
              marginBottom: "14px",
            }}
          >
            <WorkCard project={PROJECTS[0]} large />

            <div
              style={{
                display: "grid",
                gridTemplateRows: "1fr 1fr",
                gap: "14px",
              }}
            >
              <WorkCard project={PROJECTS[1]} />
              <WorkCard project={PROJECTS[2]} />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "14px",
            }}
          >
            <WorkCard project={PROJECTS[3]} />
            <WorkCard project={PROJECTS[4]} />
            <WorkCard project={PROJECTS[5]} />
          </div>
        </section>
      </div>

      {/* CTA BAND */}
      <section
        style={{
          background: "#b8f400",
          color: "#080808",
          padding: "108px 48px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "32px",
            alignItems: "end",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "clamp(72px, 10vw, 140px)",
                fontWeight: 900,
                letterSpacing: "-0.065em",
                lineHeight: 0.84,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              LET’S
              <br />
              BUILD
              <br />
              SOMETHING.
            </h2>
          </div>

          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "rgba(8,8,8,0.72)",
                maxWidth: "240px",
                margin: "0 0 22px auto",
              }}
            >
              Big enough to deliver. Small enough to care.
            </p>

            <a
              href="/start-a-project"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 26px",
                borderRadius: "999px",
                border: "1px solid rgba(8,8,8,0.18)",
                color: "#080808",
                textDecoration: "none",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
              }}
            >
              Start a Project
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
