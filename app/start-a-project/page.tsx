"use client";
 
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
 
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
};
 
/* ------------------------------------------------------------------ */
/*  Product → prefill map                                             */
/*  Extend this when new PDPs ship.                                   */
/* ------------------------------------------------------------------ */
 
type Prefill = { need: NeedOption; productName: string };
 
const PRODUCT_PREFILL: Record<string, Prefill> = {
  "heavyweight-tee":  { need: "Apparel",        productName: "Heavyweight Tee" },
  "resin-keychains":  { need: "Custom Product", productName: "Resin Keychains" },
  "insulated-bottle": { need: "Merch",          productName: "Insulated Bottle" },
};
 
function buildDetailsSeed(productName: string): string {
  return `Product: ${productName}\n\n`;
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
        gap: 16,
        paddingBottom: 16,
        borderBottom: "1px solid rgba(245,245,240,0.12)",
        marginBottom: 32,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 11,
          letterSpacing: "0.24em",
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
          fontSize: 13,
          letterSpacing: "0.22em",
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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "rgba(245,245,240,0.65)",
        }}
      >
        {label}
        {required && <span style={{ color: LIME, marginLeft: 4 }}>*</span>}
      </span>
      {children}
    </label>
  );
}
 
const inputBase: React.CSSProperties = {
  width: "100%",
  height: 48,
  padding: "0 0 10px 0",
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
  minHeight: 160,
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
  const searchParams = useSearchParams();
  const product = searchParams.get("product");

  const [form, setForm] = useState<EnquiryForm>(DEFAULT_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
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
    }));
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
    body: JSON.stringify({
    ...form,
    product,
    }),
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
          padding: "120px 48px",
        }}
      >
        <div style={{ maxWidth: 680, textAlign: "center" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: LIME,
              marginBottom: 24,
            }}
          >
            Enquiry Sent
          </div>
          <h1
            style={{
              margin: 0,
              fontWeight: 900,
              fontSize: "clamp(48px, 7vw, 96px)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            Got It<span style={{ color: LIME }}>.</span>
            <br />
            Thanks {form.name || "— we've got it"}
            <span style={{ color: LIME }}>.</span>
          </h1>
          <p
            style={{
              marginTop: 28,
              fontSize: 16,
              lineHeight: 1.55,
              color: "rgba(245,245,240,0.7)",
            }}
          >
            A real human will come back to you within one business day with
            next steps, a quote range, and a sample plan.
          </p>
          <div
            style={{
              marginTop: 40,
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
                height: 56,
                padding: "0 28px",
                backgroundColor: LIME,
                color: BG,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 13,
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
                height: 56,
                padding: "0 26px",
                color: FG,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 13,
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
      <section style={{ padding: "96px 48px 48px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: LIME,
            marginBottom: 20,
          }}
        >
          Start a Project
        </div>
        <h1
          style={{
            margin: 0,
            fontWeight: 900,
            fontSize: "clamp(64px, 9vw, 140px)",
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          Start<span style={{ color: LIME }}>.</span>
          <br />
          A Project<span style={{ color: LIME }}>.</span>
        </h1>
      </section>
 
      {/* Two-column body */}
      <section
        style={{
          padding: "48px 48px 120px",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 96,
          alignItems: "start",
        }}
      >
        {/* Sticky sidebar */}
        <aside
          style={{
            position: "sticky",
            top: 48,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
         {product && (
  <div
    style={{
      fontSize: 11,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      fontWeight: 700,
      color: "rgba(245,245,240,0.44)",
      marginBottom: 14,
          }}
            >
            Product: {PRODUCT_PREFILL[product]?.productName || product}
            </div>
            )} 
            <h2
            style={{
              margin: 0,
              fontWeight: 900,
              fontSize: "clamp(36px, 4vw, 56px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            Tell us<br />what you<br />need<span style={{ color: LIME }}>.</span>
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: "rgba(245,245,240,0.65)",
              maxWidth: 320,
            }}
          >
            No brief yet? Fine. A few lines is enough to get us started. We'll
            come back with a real sample plan and a real quote — not a generic
            spreadsheet.
          </p>
          <div
            style={{
              marginTop: 8,
              padding: "18px 20px",
              border: "1px solid rgba(245,245,240,0.12)",
              fontSize: 13,
              lineHeight: 1.55,
              color: "rgba(245,245,240,0.7)",
            }}
          >
            Rather email direct?{" "}
            <a href="mailto:ben@tendencies.co.nz" style={{ color: LIME, textDecoration: "none" }}>
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
            gap: 56,
          }}
          noValidate
        >
          {/* 01 — About you */}
          <div>
            <SectionKicker index="01" title="About You" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
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
            <SectionKicker index="02" title="Your Project" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="What do you need?" required>
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
                      Pick one
                    </option>
                    {NEED_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} style={{ backgroundColor: BG, color: FG }}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Approx Quantity">
                <input
                  type="text"
                  placeholder="e.g. 120"
                  value={form.quantity}
                  onChange={update("quantity")}
                  style={inputBase}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = LIME)}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = "rgba(245,245,240,0.15)")
                  }
                />
              </Field>
              <Field label="Timeline">
                <input
                  type="text"
                  placeholder="e.g. 6 weeks"
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
                <Field label="Budget (optional)">
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
            <SectionKicker index="03" title="The Brief" />
            <Field label="Project Details">
              <textarea
                value={form.details}
                onChange={update("details")}
                placeholder="Tell us what you're building — colours, sizing, decoration, event date, anything you've already mocked up. File links welcome."
                style={textareaBase}
                onFocus={(e) => (e.currentTarget.style.borderColor = LIME)}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(245,245,240,0.15)")
                }
              />
            </Field>
          </div>
 
          {/* Submit */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                height: 56,
                padding: "0 32px",
                backgroundColor: LIME,
                color: BG,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 13,
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
                {errorMessage || "Something went wrong. Try again or email hello@tendencies.co"}
              </div>
            )}
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.04em",
                color: "rgba(245,245,240,0.5)",
              }}
            >
              One business day response. No autoresponder. No sales spam.
            </div>
          </div>
        </form>
      </section>
 
      {/* Reassurance strip */}
      <section
        style={{
          padding: "48px 48px 96px",
          borderTop: "1px solid rgba(245,245,240,0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
          }}
        >
          {[
            { title: "No brief? Fine.", body: "A line and a logo is enough. We'll shape it with you." },
            { title: "Not a quote form.", body: "You get real numbers after a real conversation." },
            { title: "Real people.", body: "You'll deal with the same person from brief to delivery." },
          ].map((c) => (
            <div key={c.title}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {c.title}
                <span style={{ color: LIME }}>.</span>
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "rgba(245,245,240,0.65)",
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