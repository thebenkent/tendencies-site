"use client";

import { useState, useEffect } from "react";

const STEPS = [

  {

    number: "01",

    title: ["BRIEF", "& DIRECTION"],

    intro:

      "We start with the job the product needs to do. Audience, use case, timelines, quantity, budget, and brand fit all get resolved up front so the direction is clear before anything gets made.",

    bullets: [

      "Scope & Objectives",

      "Audience & Use Case",

      "Budget & Quantity",

      "Creative Direction",

    ],

    image: "/design-1.jpg",

    eyebrow: "Brief & Direction",

    imageLabel:

      "Design brief and concept direction for Kinetic Pride campaign",

  },

  {

    number: "02",

    title: ["SAMPLE", "& REFINE"],

    intro:

      "Once the direction is right, we test it properly. Materials, finishes, branding application, colours, and fit all get reviewed through samples and approvals before we move into final production.",

    bullets: [

      "Material Sampling",

      "Fit & Finish Checks",

      "Branding Approvals",

      "Final Sign-off",

    ],

    image: "/process-sample-flag.jpg",

    eyebrow: "Sample & Refine",

    imageLabel:

      "Pre-production print review of Pride campaign flag artwork",

    reverse: true,

  },

  {

    number: "03",

    title: ["MAKE", "& MANAGE"],

    intro:

      "We move into production with the details locked. Factory coordination, quality control, timelines, and communication are handled tightly so there are no surprises halfway through the run.",

    bullets: [

      "Production Management",

      "Factory Coordination",

      "Quality Control",

      "Timeline Oversight",

    ],

    image: "/process-make-bus.jpg",

    eyebrow: "Make & Manage",

    imageLabel:

      "Campaign artwork produced and applied at full scale",

  },

  {

    number: "04",

    title: ["PACK", "& DELIVER"],

    intro:

      "The final step is getting product where it needs to go. Kitting, packing, dispatch, freight, and rollout are all part of the job. Finished properly means the last mile gets the same attention as the first.",

    bullets: [

      "Kitting & Packing",

      "Freight & Dispatch",

      "Rollout Coordination",

      "Final Delivery",

    ],

    image: "/process-deliver-team.jpg",

    eyebrow: "Pack & Deliver",

    imageLabel:

      "Finished campaign assets in use by team at Pride event",

    reverse: true,

  },

];

const FAQS = [
  {
    q: "Do we need a full brief before we start?",
    a: "No. A rough outline is enough. We can help shape the brief, narrow the product direction, and work out the right next step from there.",
  },
  {
    q: "Can you work from an existing design reference?",
    a: "Yes. Old kits, screenshots, moodboards, sketches, competitor examples — all of it helps. We’ll use that material to guide the direction without just copying it.",
  },
  {
    q: "Do you handle sampling before production?",
    a: "Yes. Where the brief needs it, we’ll sample, refine, and approve before anything moves to a final run.",
  },
  {
    q: "Can you manage freight and delivery as well?",
    a: "Yes. We can handle kitting, dispatch, freight coordination, and final delivery so the project is carried through properly to the end.",
  },
  {
    q: "How long does the process usually take?",
    a: "It depends on the product, quantity, and level of customisation. We’ll give you realistic timing once the scope is clear.",
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

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "16px",
          alignItems: "center",
          padding: "18px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          color: "#f5f5f0",
        }}
      >
        <span
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            lineHeight: 1.5,
          }}
        >
          {q}
        </span>

        <span
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "22px",
            lineHeight: 1,
            color: open ? "#b8f400" : "rgba(255,255,255,0.5)",
          }}
        >
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div
          style={{
            padding: "0 0 18px",
            maxWidth: "760px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "14px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.58)",
          }}
        >
          {a}
        </div>
      ) : null}
    </div>
  );
}

export default function ProcessPage() {
  const isMobile = useIsMobile();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
              The process
              <br />
              from brief to delivery
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
            Process
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
            BRIEF
            <span style={{ color: "#b8f400" }}>.</span>
            <br />
            SAMPLE
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
          <div style={{ maxWidth: "580px" }}>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.48)",
                margin: 0,
              }}
            >
              We keep the process tight so the outcome stays strong. From brief
              to sample to final delivery, every step is handled with intent,
              not passed around.
              <br />
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                Clear process. Better product. Fewer surprises.
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
            <SecondaryButton href="/what-we-do">What We Do</SecondaryButton>
          </div>
        </div>

        {/* STEP SECTION */}
        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: isMobile ? "56px" : "72px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
              gap: isMobile ? "24px" : "40px",
              alignItems: "start",
            }}
          >
            {!isMobile ? (
              <div
                style={{
                  position: "sticky",
                  top: "120px",
                }}
              >
                <div
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#b8f400",
                    marginBottom: "14px",
                  }}
                >
                  Process Steps
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {STEPS.map((step) => (
                    <div
                      key={step.number}
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.46)",
                      }}
                    >
                      {step.number} · {step.title[0]}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              {STEPS.map((step, i) => {
                const visual = (
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
                      src={step.image}
                      alt={step.imageLabel || step.title.join(" ")}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter:
                          step.number === "02"
                            ? "brightness(0.95)"
                            : "brightness(0.85)",
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
                      {step.eyebrow}
                    </div>

                    {!isMobile ? (
                      <div
                        style={{
                          position: "absolute",
                          right: "20px",
                          bottom: "10px",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: "92px",
                          fontWeight: 900,
                          lineHeight: 1,
                          letterSpacing: "-0.08em",
                          color: "rgba(255,255,255,0.12)",
                          pointerEvents: "none",
                        }}
                      >
                        {step.number}
                      </div>
                    ) : null}
                  </div>
                );

                const text = (
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
                      {step.number}
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
                      {step.title[0]}
                      <br />
                      {step.title[1]}
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
                      {step.intro}
                    </p>

                    <div
                      style={{
                        maxWidth: "520px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        marginBottom: "28px",
                      }}
                    >
                      {step.bullets.map((item) => (
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
                  </div>
                );

                return (
                  <div
                    key={step.number}
                    style={{
                      paddingBottom: i === STEPS.length - 1 ? 0 : isMobile ? "56px" : "72px",
                      marginBottom: i === STEPS.length - 1 ? 0 : isMobile ? "56px" : "72px",
                      borderBottom:
                        i === STEPS.length - 1
                          ? "none"
                          : "1px solid rgba(255,255,255,0.06)",
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
                      ) : step.reverse ? (
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
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: isMobile ? "56px" : "72px",
            paddingBottom: isMobile ? "64px" : "88px",
            marginTop: isMobile ? "56px" : "72px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr",
              gap: isMobile ? "28px" : "56px",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#b8f400",
                  marginBottom: "12px",
                }}
              >
                Common Questions
              </div>

              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: isMobile ? "clamp(40px, 10vw, 64px)" : "clamp(40px, 5vw, 72px)",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                  color: "#f5f5f0",
                  margin: "0 0 18px",
                }}
              >
                WHAT PEOPLE
                <br />
                ASK
                <span style={{ color: "#b8f400" }}>.</span>
              </h2>

              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.56)",
                  maxWidth: "420px",
                  margin: 0,
                }}
              >
                The usual questions, without turning the page into a wall of text.
              </p>
            </div>

            <div>
              {FAQS.map((faq, idx) => (
                <FaqItem
                  key={faq.q}
                  q={faq.q}
                  a={faq.a}
                  open={openFaq === idx}
                  onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                />
              ))}
            </div>
          </div>
        </section>
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
              Give us the rough brief and we’ll shape the right next step from there.
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