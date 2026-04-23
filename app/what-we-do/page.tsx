"use client";

import { useEffect, useState } from "react";

const DESIGN_CASE = {
  prototypeImg: "/work-streets-mold.jpg",
  finishedImg: "/work-streets-prototype.jpg",
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
    image: "/key-chains.jpg",
    eyebrow: "Source & Produce",
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
    image: "/grocery.jpg",
    eyebrow: "Deliver & Fulfil",
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

function Button({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
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
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textDecoration: "none",
        transition: "all 0.2s ease",
        background: primary ? "#b8f400" : "transparent",
        color: primary ? "#080808" : "#fff",
        border: primary
          ? "none"
          : "1px solid rgba(255,255,255,0.18)",
      }}
      onMouseEnter={(e) => {
        if (primary) {
          e.currentTarget.style.opacity = "0.88";
        } else {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        }
      }}
      onMouseLeave={(e) => {
        if (primary) {
          e.currentTarget.style.opacity = "1";
        } else {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {children}
    </a>
  );
}

export default function WhatWeDoPage() {
  const isMobile = useIsMobile();

  return (
    <section style={{ background: "#080808", color: "#f5f5f0" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "72px 24px" : "104px 56px",
        }}
      >
        {/* HERO */}
        <h1
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: isMobile
              ? "clamp(56px, 16vw, 92px)"
              : "clamp(72px, 10vw, 140px)",
            fontWeight: 900,
            letterSpacing: "-0.065em",
            lineHeight: 0.88,
            margin: 0,
            marginBottom: isMobile ? "40px" : "52px",
            textTransform: "uppercase",
          }}
        >
          DESIGN<span style={{ color: "#b8f400" }}>.</span>
          <br />
          SOURCE<span style={{ color: "#b8f400" }}>.</span>
          <br />
          DELIVER<span style={{ color: "#b8f400" }}>.</span>
        </h1>

        {/* BLOCKS */}
        {BLOCKS.map((block) => {
          const isDesign = block.special === "design-case";

          return (
            <section
              key={block.number}
              style={{
                padding: isMobile ? "64px 0" : "96px 0",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : isDesign
                    ? "minmax(0, 390px) minmax(0, 700px)"
                    : "minmax(0, 390px) minmax(0, 520px)",
                  gap: isMobile ? "32px" : "80px",
                  alignItems: "start",
                  justifyContent: "space-between",
                }}
              >
                {/* TEXT */}
                <div style={{ maxWidth: "390px" }}>
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: isMobile ? "64px" : "84px",
                      fontWeight: 900,
                      letterSpacing: "-0.06em",
                      lineHeight: 0.84,
                      marginBottom: "12px",
                    }}
                  >
                    {block.number}
                    <span style={{ color: "#b8f400" }}>.</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: isMobile ? "22px" : "25px",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      lineHeight: 0.96,
                      margin: 0,
                      marginBottom: "20px",
                      textTransform: "uppercase",
                    }}
                  >
                    {block.title[0]}
                    <br />
                    {block.title[1]}
                  </h3>

                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.68,
                      margin: 0,
                      marginBottom: "24px",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {block.intro}
                  </p>

                  <div
                    style={{
                      marginBottom: "24px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {block.bullets.map((b) => (
                      <div
                        key={b}
                        style={{
                          padding: "14px 0",
                          borderBottom:
                            "1px solid rgba(255,255,255,0.06)",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#f5f5f0",
                        }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>

                  <Button href={block.ctaHref || "/work"}>
                    {block.ctaLabel || "View Work"}
                  </Button>
                </div>

                {/* VISUAL */}
                <div style={{ width: "100%", maxWidth: isDesign ? "700px" : "520px" }}>
                  {isDesign ? (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                          gap: "10px",
                          marginBottom: "12px",
                        }}
                      >
                        <img
                          src={DESIGN_CASE.prototypeImg}
                          alt="Streets Ice Cream rough prototype development"
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            objectPosition: "center center",
                            filter: "brightness(0.78) contrast(1.06)",
                            display: "block",
                          }}
                        />
                        <img
                          src={DESIGN_CASE.finishedImg}
                          alt="Streets Ice Cream refined prototype"
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            objectPosition: "center top",
                            filter: "brightness(0.98) contrast(1.02)",
                            display: "block",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.48)",
                          marginTop: "2px",
                        }}
                      >
                        Rough → Refined
                      </div>
                    </>
                  ) : (
                    <img
                      src={block.image}
                      alt={block.eyebrow}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        objectPosition:
                          block.number === "02" ? "center top" : "center center",
                        filter:
                          block.number === "02"
                            ? "brightness(0.96)"
                            : "brightness(0.9) contrast(1.02)",
                        display: "block",
                      }}
                    />
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <div style={{ marginTop: "80px", paddingBottom: isMobile ? "56px" : "72px" }}>
          <Button href="/start-a-project" primary>
            Start a Project
          </Button>
        </div>
      </div>
    </section>
  );
}