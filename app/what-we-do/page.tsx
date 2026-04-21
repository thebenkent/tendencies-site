"use client";

import { useEffect, useState } from "react";

// -----------------------------------------------------------------------------
// Image mapping — all visuals live at /public/work-*.jpg
//   • /work-streets-prototype.jpg  → Streets resin keychain prototype (diptych L)
//   • /work-streets-finished.jpg   → Streets resin keychain finished (diptych R)
//   • /work-knitwear.jpg           → Source & Produce block visual
//   • /work-kerastase.jpg          → Deliver & Fulfil block visual
// -----------------------------------------------------------------------------

const DESIGN_CASE = {
  prototypeImg: "/work-streets-prototype.jpg",
  finishedImg: "/work-streets-finished.jpg",
};

const BLOCKS = [
  {
    number: "01",
    title: ["DESIGN", "& DEVELOP"],
    intro:
      "Product that earns its keep. We move from sketch to sampled prototype to finished run — shaping ideas into branded merchandise that’s useful, on-brand, and built to last. If it won’t get worn, carried, or kept, we don’t make it.",
    bullets: [
      "Concept & Ideation",
      "Industrial Design",
      "Mould & Prototype",
      "Brand Integration",
    ],
    special: "design-case",
    ctaLabel: "See the Streets Case Study",
    ctaHref: "/work/streets-keychains",
    reverse: false,
  },
  {
    number: "02",
    title: ["SOURCE", "& PRODUCE"],
    intro:
      "We source properly and produce with intent. Materials, finishes, lead times, and factory capability all get resolved before anything moves to a final run. Better inputs. Better results.",
    bullets: [
      "Factory Sourcing",
      "Material Selection",
      "Sampling & Approvals",
      "Production Management",
    ],
    image: "/work-knitwear.jpg",
    eyebrow: "Source & Produce",
    imageLabel: "Source & produce — considered product, built to spec",
    ctaLabel: "View Work",
    ctaHref: "/work",
    reverse: true,
  },
  {
    number: "03",
    title: ["DELIVER", "& FULFIL"],
    intro:
      "Getting product made is only half the job. We pack it, move it, kit it, and get it where it needs to go — whether that’s warehouse stock, retail support, campaign rollout, or straight into people’s hands.",
    bullets: [
      "Kitting & Packing",
      "Freight Coordination",
      "Campaign Rollouts",
      "Fulfilment & Delivery",
    ],
    image: "/work-kerastase.jpg",
    eyebrow: "Deliver & Fulfil",
    imageLabel: "Deliver & fulfil — packed, moved, and handled properly",
    ctaLabel: "View Work",
    ctaHref: "/work",
    reverse: false,
  },
];

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
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

export default function WhatWeDoPage() {
  const isMobile = useIsMobile();

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
          padding: isMobile ? "88px 24px 0" : "116px 48px 0",
        }}
      >
        {/* HERO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            alignItems: "start",
            gap: isMobile ? "16px" : "24px",
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
              justifySelf: isMobile ? "start" : "end",
              textAlign: isMobile ? "left" : "right",
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
              What we do
              <br />
              &amp; how we do it
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
            What We Do
          </div>

          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: isMobile ? "clamp(56px, 16vw, 92px)" : "clamp(72px, 10vw, 152px)",
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            DESIGN
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            SOURCE
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            DELIVER
            <span style={{ color: "#b8f400" }}>.</span>
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: "32px",
            alignItems: isMobile ? "start" : "center",
            paddingTop: "22px",
            paddingBottom: isMobile ? "56px" : "72px",
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
              Three capabilities, one team. We design product worth keeping,
              source it without cutting corners, and deliver it to where it
              needs to go.
              <br />
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                No handoffs. No excuses.
              </span>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: isMobile ? "flex-start" : "flex-end",
            }}
          >
            <PrimaryButton href="/start-a-project">Start a Project</PrimaryButton>
            <SecondaryButton href="/process">See the Process</SecondaryButton>
          </div>
        </div>

        {/* BLOCKS */}
        {BLOCKS.map((block, i) => {
          const text = renderText(block, isMobile);
          const visual = renderVisual(block, isMobile);

          return (
            <section
              key={block.number}
              style={{
                padding: isMobile
                  ? "56px 0"
                  : i === 1
                  ? "80px 0"
                  : "92px 0",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? "28px" : "56px",
                  alignItems: "start",
                }}
              >
                {isMobile ? (
                  <>
                    {text}
                    {visual}
                  </>
                ) : block.reverse ? (
                  <>
                    {visual}
                    {text}
                  </>
                ) : (
                  <>
                    {text}
                    {visual}
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA BAND */}
      <section
        style={{
          background: "#b8f400",
          color: "#080808",
          padding: isMobile ? "72px 24px" : "108px 48px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: "32px",
            alignItems: "end",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: isMobile ? "clamp(56px, 16vw, 96px)" : "clamp(72px, 10vw, 140px)",
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

          <div style={{ textAlign: isMobile ? "left" : "right" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "rgba(8,8,8,0.72)",
                maxWidth: "240px",
                margin: isMobile ? "0 0 22px 0" : "0 0 22px auto",
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

function renderText(block: (typeof BLOCKS)[number], isMobile: boolean) {
  return (
    <div>
      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: isMobile ? "72px" : "92px",
          fontWeight: 900,
          letterSpacing: "-0.06em",
          lineHeight: 0.85,
          color: "#f5f5f0",
          marginBottom: "12px",
        }}
      >
        {block.number}
        <span style={{ color: "#b8f400" }}>.</span>
      </div>

      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: isMobile ? "24px" : "28px",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 0.94,
          textTransform: "uppercase",
          color: "#f5f5f0",
          marginBottom: "22px",
        }}
      >
        {block.title[0]}
        <br />
        {block.title[1]}
      </div>

      <p
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "15px",
          lineHeight: 1.68,
          color: "rgba(255,255,255,0.56)",
          maxWidth: "500px",
          margin: "0 0 28px",
        }}
      >
        {block.intro}
      </p>

      <div
        style={{
          maxWidth: "520px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "28px",
        }}
      >
        {block.bullets.map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#b8f400",
                flex: "0 0 auto",
              }}
            />
            <span
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#f5f5f0",
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      <SecondaryButton href={block.ctaHref || "/work"}>
        {block.ctaLabel || "View Work"}
      </SecondaryButton>
    </div>
  );
}

function renderVisual(block: (typeof BLOCKS)[number], isMobile: boolean) {
  if (block.special === "design-case") {
    return (
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "5 / 4",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f0f0f",
            }}
          >
            <img
              src={DESIGN_CASE.prototypeImg}
              alt="Streets Ice Cream — resin keychain prototypes, uncoloured cast"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.82)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "rgba(8,8,8,0.86)",
                color: "#f5f5f0",
                border: "1px solid rgba(255,255,255,0.12)",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "7px 10px",
              }}
            >
              • Prototype
            </div>
          </div>

          <div
            style={{
              position: "relative",
              aspectRatio: "5 / 4",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f0f0f",
            }}
          >
            <img
              src={DESIGN_CASE.finishedImg}
              alt="Streets Ice Cream — finished resin keychains with brand livery"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.95)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "#b8f400",
                color: "#080808",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "7px 10px",
              }}
            >
              • Finished
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "14px",
          }}
        >
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#f5f5f0",
              marginBottom: "10px",
            }}
          >
            Streets Ice Cream
          </div>

          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.44)",
            }}
          >
            Resin Keychain · Mould → Delivered
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          position: "relative",
          aspectRatio: "5 / 4",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#0f0f0f",
        }}
      >
        <img
          src={block.image}
          alt={block.imageLabel || block.title.join(" ")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.85)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            background: "rgba(8,8,8,0.82)",
            color: "#f5f5f0",
            border: "1px solid rgba(255,255,255,0.12)",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "7px 10px",
          }}
        >
          {block.eyebrow}
        </div>
      </div>
    </div>
  );
}