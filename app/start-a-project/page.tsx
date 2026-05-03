"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Tendencies — Start a Project                                      */
/*  File path in repo: app/start-a-project/page.tsx                   */
/*                                                                    */
/*  Query params supported:                                           */
/*    ?product=heavyweight-tee   → Need = Apparel                     */
/*    ?product=resin-keychains   → Need = Custom Product              */
/*    ?product=insulated-bottle  → Need = Merch                       */
/*                                                                    */
/*  Prefill only happens once on mount. Once the user types, the      */
/*  form state is never overwritten by URL params again.              */
/* ------------------------------------------------------------------ */

const FONT = "Helvetica, Arial, sans-serif";
const BG = "#080808";
const FG = "#f5f5f0";
const LIME = "#b8f400";
const CONTACT_EMAIL = "ben@tendencies.co.nz";

type NeedOption = "Merch" | "Apparel" | "Teamwear" | "Custom Product" | "Unsure";

const NEED_OPTIONS: NeedOption[] = [
  "Merch",
  "Apparel",
  "Teamwear",
  "Custom Product",
  "Unsure",
];

type EnquiryForm = {
  name: string;
  email: string;
  company: string;
  need: NeedOption | "";
  quantity: string;
  timeline: string;
  budget: string;
  details: string;
  product: string; // slug — submitted through to /api/enquiry so the
                   // receiver knows which PDP the enquiry came from.
};

const DEFAULT_FORM: EnquiryForm = {
  name: "",
  email: "",
  company: "",
  need: "",
  quantity: "",
  timeline: "",
  budget: "",
  details: "",
  product: "",
};

/* ------------------------------------------------------------------ */
/*  Product → prefill map                                             */
/*  Extend this when new PDPs ship.                                   */
/* ------------------------------------------------------------------ */

type Prefill = { need: NeedOption; productName: string };

const PRODUCT_PREFILL: Record<string, Prefill> = {
  "heavyweight-hoodie": { need: "Apparel",        productName: "Heavyweight Hoodie" },
  "crew-sweat":         { need: "Apparel",        productName: "Crew Sweat" },
  "heavyweight-tee":    { need: "Apparel",        productName: "Heavyweight Tee" },
  "structured-cap":     { need: "Merch",          productName: "Structured Cap" },
  "field-bottle":       { need: "Merch",          productName: "Field Bottle" },
  "resin-keychains":    { need: "Custom Product", productName: "Resin Keychains" },
  "insulated-bottle":   { need: "Merch",          productName: "Insulated Bottle" },
  "union-mug":          { need: "Merch",          productName: "Union Mug" },
};

function buildDetailsSeed(productName: string): string {
  return `Product: ${productName}\n\n`;
}

/* ------------------------------------------------------------------ */
/*  Mobile hook — mirrors the one in components/catalogue/shared.tsx  */
/*  Kept local so this page has no new imports.                       */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Small presentational pieces                                       */
/* ------------------------------------------------------------------ */

function SectionKicker({ index, title }: { index: string; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        paddingBottom: 12,
        borderBottom: "1px solid rgba(245,245,240,0.12)",
        marginBottom: 24,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: LIME,
        }}
      >
        {index}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: FG,
        }}
      >
        {title}
      </span>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "rgba(245,245,240,0.6)",
        }}
      >
        {label}
        {required && <span style={{ color: LIME, marginLeft: 4 }}>*</span>}
        {hint && (
          <span
            style={{
              marginLeft: 8,
              letterSpacing: "0.04em",
              textTransform: "none",
              fontWeight: 500,
              color: "rgba(245,245,240,0.4)",
            }}
          >
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 0 8px 0",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(245,245,240,0.15)",
  color: FG,
  fontFamily: FONT,
  fontSize: 15,
  outline: "none",
  transition: "border-color 160ms ease",
};

const textareaBase: React.CSSProperties = {
  width: "100%",
  minHeight: 140,
  padding: "12px 14px",
  backgroundColor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(245,245,240,0.15)",
  color: FG,
  fontFamily: FONT,
  fontSize: 15,
  lineHeight: 1.55,
  outline: "none",
  resize: "vertical",
  transition: "border-color 160ms ease",
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='%23b8f400' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 4px center",
  paddingRight: 24,
};

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function StartAProjectPage() {
  const [form, setForm] = useState<EnquiryForm>(DEFAULT_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  // The user-friendly product name we show in the hero label — empty when
  // no ?product= param was passed, or the slug wasn't one we recognise.
  const [productLabel, setProductLabel] = useState<string>("");
  const isMobile = useIsMobile();

  /* ---------------------------------------------------------------- */
  /*  One-time prefill from ?product= on first mount.                 */
  /*  Empty deps = runs once. We never overwrite typed input because  */
  /*  this effect never runs again for the lifetime of the component. */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get("product");
    if (!productSlug) return;
    const prefill = PRODUCT_PREFILL[productSlug];
    if (!prefill) return;
    setForm((f) => ({
      ...f,
      need: prefill.need,
      details: buildDetailsSeed(prefill.productName),
      product: productSlug,
    }));
    setProductLabel(prefill.productName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update =
    <K extends keyof EnquiryForm>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value as EnquiryForm[K] }));
    };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send enquiry.");
      }
      setStatus("submitted");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Try again or email us."
      );
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Success view                                                    */
  /* ---------------------------------------------------------------- */
  if (status === "submitted") {
    return (
      <main
        style={{
          backgroundColor: BG,
          color: FG,
          fontFamily: FONT,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: isMobile ? "72px 24px" : "96px 40px",
        }}
      >
        <div style={{ maxWidth: 680, textAlign: "center" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: LIME,
              marginBottom: 20,
            }}
          >
            Enquiry Received
          </div>
          <h1
            style={{
              margin: 0,
              fontWeight: 900,
              fontSize: isMobile
                ? "clamp(40px, 12vw, 72px)"
                : "clamp(48px, 7vw, 96px)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            Got It<span style={{ color: LIME }}>.</span>
            <br />
            Thanks {form.name || "—"}
            <span style={{ color: LIME }}>.</span>
          </h1>
          <p
            style={{
              marginTop: 22,
              fontSize: 15,
              lineHeight: 1.55,
              color: "rgba(245,245,240,0.7)",
            }}
          >
            A real person will be back within one business day with next steps,
            an indicative quote range, and a sample plan.
          </p>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setForm(DEFAULT_FORM);
                setStatus("idle");
              }}
              style={{
                height: 52,
                padding: "0 26px",
                backgroundColor: LIME,
                color: BG,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send Another
            </button>
            <a
              href="/work"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
                padding: "0 24px",
                color: FG,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid rgba(245,245,240,0.25)",
              }}
            >
              See Our Work
            </a>
          </div>
        </div>
      </main>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Form view                                                       */
  /* ---------------------------------------------------------------- */
  return (
    <main
      style={{
        backgroundColor: BG,
        color: FG,
        fontFamily: FONT,
        minHeight: "100vh",
      }}
    >
      {/* Hero */}
      <section style={{ padding: isMobile ? "72px 24px 28px" : "80px 48px 32px" }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: LIME,
            marginBottom: 18,
          }}
        >
          New Enquiry · For Teams, Brands & Clubs
        </div>

        {/* Clean product label — only appears when the page was opened
            from a PDP (e.g. /start-a-project?product=field-bottle). */}
        {productLabel && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              marginBottom: 18,
              border: "1px solid rgba(245,245,240,0.18)",
              fontFamily: FONT,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: FG,
            }}
          >
            <span style={{ color: LIME }}>Enquiring about</span>
            <span style={{ color: "rgba(245,245,240,0.4)" }}>·</span>
            <span>{productLabel}</span>
          </div>
        )}
        <h1
          style={{
            margin: 0,
            fontWeight: 900,
            fontSize: isMobile
              ? "clamp(48px, 14vw, 88px)"
              : "clamp(64px, 9vw, 140px)",
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
          }}
        >
          Start<span style={{ color: LIME }}>.</span>
          <br />
          A Project<span style={{ color: LIME }}>.</span>
        </h1>
        <p
          style={{
            margin: "22px 0 0",
            maxWidth: 640,
            fontSize: 16,
            lineHeight: 1.55,
            color: "rgba(245,245,240,0.7)",
          }}
        >
          For branded merch, apparel, teamwear, and custom product runs.
          Typical first projects start at 50+ units. Five fields below tell us
          enough to come back with real numbers.
        </p>
      </section>

      {/* Two-column body */}
      <section
        style={{
          padding: isMobile ? "24px 24px 72px" : "32px 48px 96px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
          gap: isMobile ? 40 : 72,
          alignItems: "start",
        }}
      >
        {/* Sticky sidebar — sticky only on desktop; on mobile it just stacks. */}
        <aside
          style={{
            position: isMobile ? "static" : "sticky",
            top: isMobile ? undefined : 48,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 900,
              fontSize: isMobile
                ? "clamp(32px, 10vw, 48px)"
                : "clamp(36px, 4vw, 56px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            The<br />Brief<span style={{ color: LIME }}>.</span>
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.55,
              color: "rgba(245,245,240,0.65)",
              maxWidth: 320,
            }}
          >
            No formal brief? Fine. A few lines on what you're making, who it's
            for, and when you need it is enough to get a real plan and a real
            quote — not an autoresponder.
          </p>
          <div
            style={{
              marginTop: 4,
              padding: "14px 16px",
              border: "1px solid rgba(245,245,240,0.12)",
              fontSize: 12,
              lineHeight: 1.55,
              letterSpacing: "0.02em",
              color: "rgba(245,245,240,0.7)",
            }}
          >
            Prefer email?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              style={{ color: LIME, textDecoration: "none", fontWeight: 700 }}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </aside>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 720,
            display: "flex",
            flexDirection: "column",
            gap: 40,
          }}
          noValidate
        >
          {/* 01 — About you */}
          <div>
            <SectionKicker index="01" title="About You" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 24,
              }}
            >
              <Field label="Name" required>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={update("name")}
                  autoComplete="name"
                  style={inputBase}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = LIME)}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = "rgba(245,245,240,0.15)")
                  }
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  autoComplete="email"
                  style={inputBase}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = LIME)}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = "rgba(245,245,240,0.15)")
                  }
                />
              </Field>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Company / School / Club">
                  <input
                    type="text"
                    value={form.company}
                    onChange={update("company")}
                    autoComplete="organization"
                    style={inputBase}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = LIME)}
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor = "rgba(245,245,240,0.15)")
                    }
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* 02 — Your project */}
          <div>
            <SectionKicker index="02" title="The Project" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 24,
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Project Type" required>
                  <select
                    required
                    value={form.need}
                    onChange={update("need")}
                    style={selectBase}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = LIME)}
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor = "rgba(245,245,240,0.15)")
                    }
                  >
                    <option value="" disabled style={{ color: "#888", backgroundColor: BG }}>
                      Select one
                    </option>
                    {NEED_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} style={{ backgroundColor: BG, color: FG }}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Quantity" required hint="approx units">
                <input
                  type="text"
                  required
                  placeholder="e.g. 100–250"
                  value={form.quantity}
                  onChange={update("quantity")}
                  style={inputBase}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = LIME)}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = "rgba(245,245,240,0.15)")
                  }
                />
              </Field>
              <Field label="Deadline" required hint="event or in-hand date">
                <input
                  type="text"
                  required
                  placeholder="e.g. 6 weeks / 12 Aug"
                  value={form.timeline}
                  onChange={update("timeline")}
                  style={inputBase}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = LIME)}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = "rgba(245,245,240,0.15)")
                  }
                />
              </Field>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Budget" hint="optional, but speeds things up">
                  <input
                    type="text"
                    placeholder="e.g. $3,000 – $5,000"
                    value={form.budget}
                    onChange={update("budget")}
                    style={inputBase}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = LIME)}
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor = "rgba(245,245,240,0.15)")
                    }
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* 03 — The brief */}
          <div>
            <SectionKicker index="03" title="The Detail" />
            <Field
              label="What you're making"
              hint="a few lines is enough"
            >
              <textarea
                value={form.details}
                onChange={update("details")}
                placeholder="What it is, who it's for, any colours / sizing / decoration notes, and links to anything you've already mocked up."
                style={textareaBase}
                onFocus={(e) => (e.currentTarget.style.borderColor = LIME)}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(245,245,240,0.15)")
                }
              />
            </Field>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                height: 52,
                padding: "0 28px",
                backgroundColor: LIME,
                color: BG,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                border: "none",
                cursor: status === "submitting" ? "default" : "pointer",
                opacity: status === "submitting" ? 0.6 : 1,
                alignSelf: "flex-start",
                transition: "opacity 160ms ease",
              }}
            >
              {status === "submitting" ? "Sending…" : "Send Enquiry →"}
            </button>
            {status === "error" && (
              <div
                style={{
                  fontSize: 13,
                  color: "#ff8b6b",
                  letterSpacing: "0.04em",
                }}
              >
                {errorMessage || `Something went wrong. Try again or email ${CONTACT_EMAIL}.`}
              </div>
            )}
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "rgba(245,245,240,0.45)",
              }}
            >
              One business day reply · No autoresponder · No sales spam
            </div>
          </div>
        </form>
      </section>

      {/* Reassurance strip */}
      <section
        style={{
          padding: isMobile ? "32px 24px 56px" : "40px 48px 72px",
          borderTop: "1px solid rgba(245,245,240,0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {[
            { title: "No brief? Fine", body: "A line and a logo is enough. We'll shape the rest with you." },
            { title: "Not a quote form", body: "You get real numbers after a real conversation — not a templated PDF." },
            { title: "One point of contact", body: "The same person you brief is the person who delivers it." },
          ].map((c) => (
            <div key={c.title}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {c.title}
                <span style={{ color: LIME }}>.</span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "rgba(245,245,240,0.6)",
                }}
              >
                {c.body}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
