"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const FONT = "Helvetica, Arial, sans-serif";
const BG = "#080808";
const FG = "#f5f5f0";
const LIME = "#b8f400";

const SPORT_OPTIONS = [
  "Touch",
  "Rugby League",
  "Rugby",
  "Netball",
  "Basketball",
  "Football",
  "Hockey",
  "Cricket",
  "Baseball",
  "Lawn Bowls",
  "Off-Field",
] as const;

const STYLE_MAP = {
  "touch-01": { name: "Touch 01", sport: "Touch" },
  "touch-02": { name: "Touch 02", sport: "Touch" },
  "rugby-01": { name: "Rugby 01", sport: "Rugby" },
  "league-01": { name: "League 01", sport: "League" },
  "netball-01": { name: "Netball 01", sport: "Netball" },
  "basketball-01": { name: "Basketball 01", sport: "Basketball" },
  "football-01": { name: "Football 01", sport: "Football" },
  "hockey-01": { name: "Hockey 01", sport: "Hockey" },
  "cricket-01": { name: "Cricket 01", sport: "Cricket" },
  "baseball-01": { name: "Baseball 01", sport: "Baseball" },
  "lawn-bowls-01": { name: "Lawn Bowls 01", sport: "Lawn Bowls" },
  "off-field-01": { name: "Off-Field 01", sport: "Off-Field" },
} as const;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: LIME,
        marginBottom: "16px",
      }}
    >
      {children}
    </div>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: FONT,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.44)",
        marginBottom: "10px",
      }}
    >
      {children}
      {required ? <span style={{ color: LIME, marginLeft: 4 }}>*</span> : null}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "48px",
  padding: "0 14px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#111111",
  color: FG,
  fontFamily: FONT,
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "140px",
  padding: "14px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#111111",
  color: FG,
  fontFamily: FONT,
  fontSize: "14px",
  lineHeight: 1.6,
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

function TeamwearBriefForm() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState("");

  const styleId = searchParams.get("style");
  const selectedStyle = styleId
    ? STYLE_MAP[styleId as keyof typeof STYLE_MAP] ?? null
    : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    setStatus("submitting");
    setSubmitError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      styleId: formData.get("styleId"),
      source: formData.get("source"),
      website: formData.get("website"),
      selectedStyle: formData.get("selectedStyle"),
      sport: formData.get("sport"),
      clubName: formData.get("clubName"),
      teamName: formData.get("teamName"),
      quantity: formData.get("quantity"),
      timeline: formData.get("timeline"),
      contactName: formData.get("contactName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes"),
    };

    try {
      const res = await fetch("/api/teamwear-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Submission failed.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: BG,
          color: FG,
          display: "grid",
          placeItems: "center",
          padding: "80px 24px",
          fontFamily: FONT,
        }}
      >
        <div style={{ maxWidth: 720, textAlign: "center" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: LIME,
              marginBottom: "16px",
            }}
          >
            Teamwear Brief Sent
          </div>

          <h1
            style={{
              fontSize: "clamp(56px, 10vw, 120px)",
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            OVER
            <br />
            TO US
            <span style={{ color: LIME }}>.</span>
          </h1>

          <p
            style={{
              marginTop: "20px",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            We’ll come back with direction, pricing, and next steps within the
            week.
          </p>

          <div
            style={{
              marginTop: "28px",
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/teamwear"
              style={{
                height: "48px",
                padding: "0 24px",
                display: "inline-flex",
                alignItems: "center",
                background: LIME,
                color: BG,
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Back to Teamwear
            </a>

            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setSubmitError("");
              }}
              style={{
                height: "48px",
                padding: "0 24px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: FG,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Start Another
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        background: BG,
        color: FG,
        minHeight: "100vh",
      }}
    >
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "72px 24px" : "104px 56px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            alignItems: "start",
            gap: isMobile ? "16px" : "24px",
            marginBottom: "28px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.56)",
              }}
            >
              Teamwear Brief
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
                fontFamily: FONT,
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.5,
              }}
            >
              Start with a direction
              <br />
              and we’ll build it properly
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <Eyebrow>Teamwear · Brief</Eyebrow>

          <h1
            style={{
              fontFamily: FONT,
              fontSize: isMobile
                ? "clamp(56px, 16vw, 92px)"
                : "clamp(72px, 10vw, 152px)",
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: FG,
              margin: 0,
            }}
          >
            START A
            <br />
            BRIEF
            <span style={{ color: LIME }}>.</span>
          </h1>
        </div>

        <div
          style={{
            maxWidth: "560px",
            paddingTop: "18px",
            paddingBottom: isMobile ? "40px" : "56px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: "14px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.56)",
              margin: 0,
            }}
          >
            Tell us what you need and we’ll come back with direction, pricing,
            and next steps.
            <br />
            <span style={{ color: FG, fontWeight: 600 }}>
              Usually within the week.
            </span>
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 380px) 1fr",
            gap: isMobile ? "32px" : "80px",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0f0f0f",
                padding: isMobile ? "24px 20px" : "28px 24px",
                marginBottom: "20px",
              }}
            >
              {selectedStyle && (
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.44)",
                    marginBottom: "14px",
                  }}
                >
                  Selected: {selectedStyle.name} · {selectedStyle.sport}
                </div>
              )}

              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "28px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.98,
                  textTransform: "uppercase",
                  color: FG,
                  marginBottom: "12px",
                }}
              >
                Teamwear
                <br />
                Built Properly
              </div>

              <p
                style={{
                  fontFamily: FONT,
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.56)",
                  margin: 0,
                }}
              >
                Use this form to brief a club, school, sponsor-led, or custom
                teamwear job. We’ll use it to shape the direction before moving
                into design, sampling, and production.
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                marginBottom: "20px",
              }}
            >
              {[
                "Schools, clubs, rep teams, and event crews",
                "Start from a style or brief something custom",
                "Names, numbers, sizing, and ordering handled properly",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: LIME,
                      flex: "0 0 auto",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: FG,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="/teamwear"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 24px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.18)",
                color: FG,
                textDecoration: "none",
                fontFamily: FONT,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
              }}
            >
              Back to Teamwear
            </a>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f0f0f",
              padding: isMobile ? "24px 20px" : "32px 28px",
            }}
          >
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="styleId" value={styleId || ""} />
              <input
                type="hidden"
                name="source"
                value={styleId ? "teamwear-styles" : "teamwear-brief"}
              />
  <input
    type="text"
    name="website"
    tabIndex={-1}
    autoComplete="off"

    style={{
      position: "absolute",
      left: "-9999px",
      opacity: 0,
      pointerEvents: "none",
      height: 0,
      width: 0,
    }}

  />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <FieldLabel>Sport</FieldLabel>
                  <select
                    name="sport"
                    defaultValue={selectedStyle?.sport || ""}
                    style={inputStyle}
                  >
                    <option value="">Select sport</option>
                    {SPORT_OPTIONS.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel>Selected Style</FieldLabel>
                  <input
                    type="text"
                    name="selectedStyle"
                    defaultValue={selectedStyle?.name || ""}
                    placeholder="Optional"
                    style={inputStyle}
                    readOnly={!!selectedStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <FieldLabel required>Club or School Name</FieldLabel>
                  <input
                    type="text"
                    name="clubName"
                    placeholder="e.g. Te Atatu Netball"
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <FieldLabel>Team or Group</FieldLabel>
                  <input
                    type="text"
                    name="teamName"
                    placeholder="e.g. Senior A / U15 / Event Crew"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <FieldLabel>Estimated Quantity</FieldLabel>
                  <input
                    type="text"
                    name="quantity"
                    placeholder="e.g. 40"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <FieldLabel>Need By</FieldLabel>
                  <input
                    type="text"
                    name="timeline"
                    placeholder="e.g. Mid July"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <FieldLabel required>Contact Name</FieldLabel>
                  <input
                    type="text"
                    name="contactName"
                    placeholder="Your name"
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <FieldLabel required>Email</FieldLabel>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <FieldLabel>Phone</FieldLabel>
                <input
                  type="text"
                  name="phone"
                  placeholder="Optional"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <FieldLabel required>What do you need?</FieldLabel>
                <textarea
                  name="notes"
                  placeholder="Tell us the garments you need, colours, sponsor setup, names/numbers, and anything else that matters."
                  style={textareaStyle}
                  required
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "48px",
                    padding: "0 26px",
                    borderRadius: "999px",
                    background: LIME,
                    color: BG,
                    border: "none",
                    fontFamily: FONT,
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: isSubmitting ? "default" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send Brief"}
                </button>
              </div>

              {submitError && (
                <div
                  style={{
                    marginTop: "16px",
                    fontFamily: FONT,
                    fontSize: "13px",
                    lineHeight: 1.5,
                    color: "#ff8f8f",
                  }}
                >
                  {submitError}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
export default function TeamwearBriefPage() {
  return (
    <Suspense fallback={null}>
      <TeamwearBriefForm />
    </Suspense>
  );
}