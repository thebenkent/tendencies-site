"use client";

import { useEffect, useState } from "react";

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
            fontSize: isMobile
              ? "clamp(56px, 16vw, 92px)"
              : "clamp(72px, 10vw, 140px)",
            fontWeight: 900,
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
            marginBottom: "40px",
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
                    ? "420px 620px"
                    : "420px 520px",
                  gap: isMobile ? "32px" : "80px",
                }}
              >
                {/* TEXT */}
                <div style={{ maxWidth: "420px" }}>
                  <div
                    style={{
                      fontSize: isMobile ? "64px" : "84px",
                      fontWeight: 900,
                      marginBottom: "12px",
                    }}
                  >
                    {block.number}
                    <span style={{ color: "#b8f400" }}>.</span>
                  </div>

                  <h3
                    style={{
                      fontSize: isMobile ? "22px" : "26px",
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
                      fontSize: "15px",
                      lineHeight: 1.6,
                      marginBottom: "24px",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {block.intro}
                  </p>

                  <div style={{ marginBottom: "24px" }}>
                    {block.bullets.map((b) => (
                      <div
                        key={b}
                        style={{
                          padding: "14px 0",
                          borderBottom:
                            "1px solid rgba(255,255,255,0.06)",
                          fontSize: "12px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
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
                <div>
                  {isDesign ? (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "14px",
                          marginBottom: "12px",
                        }}
                      >
                        <img
                          src={DESIGN_CASE.prototypeImg}
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                          }}
                        />
                        <img
                          src={DESIGN_CASE.finishedImg}
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.18em",
                          opacity: 0.6,
                        }}
                      >
                        PROTOTYPE → FINISHED
                      </div>
                    </>
                  ) : (
                    <img
                      src={block.image}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <div style={{ marginTop: "80px" }}>
          <Button href="/start-a-project" primary>
            Start a Project
          </Button>
        </div>
      </div>
    </section>
  );
}