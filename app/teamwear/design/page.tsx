"use client";

import { useEffect, useState } from "react";

const FONT = "Helvetica, Arial, sans-serif";
const BG = "#080808";
const FG = "#f5f5f0";
const LIME = "#b8f400";

type SportOption = "Touch" | "Rugby League" | "Rugby" | "Netball" | "Basketball";
type CutOption = "Singlet" | "Short Sleeve" | "Long Sleeve";
type StyleLane = {
  id: string;
  name: string;
  line: string;
  image: string | null;
  blank?: boolean;
};

const SPORTS: SportOption[] = [
  "Touch",
  "Rugby League",
  "Rugby",
  "Netball",
  "Basketball",
];

const CUTS: CutOption[] = ["Singlet", "Short Sleeve", "Long Sleeve"];

const STYLES: StyleLane[] = [
  {
    id: "clean",
    name: "Clean",
    line: "Structured. Brand-led. Minimal.",
    image: "/style-clean.jpg",
  },
  {
    id: "strike",
    name: "Strike",
    line: "Sharp geometry. Built for impact.",
    image: "/style-bold.jpg",
  },
  {
    id: "fade",
    name: "Fade",
    line: "Tonal blend. Smooth transitions.",
    image: "/style-gradient.jpg",
  },
  {
    id: "pattern",
    name: "Pattern",
    line: "Repeat systems. Graphic or cultural.",
    image: "/style-pattern.jpg",
  },
  {
    id: "heritage",
    name: "Heritage",
    line: "Classic sport DNA.",
    image: "/style-heritage.jpg",
  },
  {
    id: "lockup",
    name: "Sponsor Lockup",
    line: "Built around sponsor hierarchy.",
    image: "/style-sponsor.jpg",
  },
  {
    id: "artwork",
    name: "Custom Artwork",
    line: "Full-coverage illustration.",
    image: "/style-custom.jpg",
  },
  {
    id: "blank",
    name: "Blank Canvas",
    line: "You bring the design.",
    image: null,
    blank: true,
  },
];

type FormState = {
  sport: SportOption;
  cut: CutOption;
  style: string;
  teamName: string;
  colours: string;
  brief: string;
  contactName: string;
  contactEmail: string;
  organisation: string;
  primaryLogo: File | null;
  sponsorLogos: File[];
  references: File[];
  artwork: File | null;
};

const INITIAL_STATE: FormState = {
  sport: "Touch",
  cut: "Short Sleeve",
  style: "",
  teamName: "",
  colours: "",
  brief: "",
  contactName: "",
  contactEmail: "",
  organisation: "",
  primaryLogo: null,
  sponsorLogos: [],
  references: [],
  artwork: null,
};

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

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: LIME,
          marginBottom: 10,
        }}
      >
        {number}
      </div>
      <h2
        style={{
          fontFamily: FONT,
          fontSize: "clamp(32px, 4.2vw, 58px)",
          fontWeight: 900,
          letterSpacing: "-0.05em",
          lineHeight: 0.92,
          textTransform: "uppercase",
          color: FG,
          margin: 0,
        }}
      >
        {title}
        <span style={{ color: LIME }}>.</span>
      </h2>
      {subtitle ? (
        <p
          style={{
            margin: "12px 0 0",
            fontFamily: FONT,
            fontSize: 14,
            lineHeight: 1.62,
            color: "rgba(245,245,240,0.58)",
            maxWidth: 540,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(245,245,240,0.68)",
        marginBottom: 10,
      }}
    >
      {label}
      {required ? <span style={{ color: LIME, marginLeft: 4 }}>*</span> : null}
    </div>
  );
}

function ChoiceCard({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 68,
        padding: "16px 14px",
        border: active ? `1px solid ${LIME}` : "1px solid rgba(255,255,255,0.1)",
        background: active ? "rgba(184,244,0,0.08)" : "#0d0d0d",
        color: FG,
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}

function StyleCard({
  style,
  active,
  onClick,
}: {
  style: StyleLane;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        textAlign: "left",
        border: active ? `1px solid ${LIME}` : "1px solid rgba(255,255,255,0.1)",
        background: "#0d0d0d",
        color: FG,
        padding: 0,
        cursor: "pointer",
        overflow: "hidden",
        transition: "border-color 0.2s ease, transform 0.2s ease, background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {active ? (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: LIME,
            color: BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          ✓
        </div>
      ) : null}

      {style.blank ? (
        <div
          style={{
            aspectRatio: "4 / 3",
            borderBottom: "1px dashed rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              border: "1px dashed rgba(245,245,240,0.24)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontSize: 26,
              color: LIME,
            }}
          >
            +
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 3",
            overflow: "hidden",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "#111",
          }}
        >
          <img
            src={style.image || ""}
            alt={style.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.86)",
            }}
          />
        </div>
      )}

      <div style={{ padding: "14px 14px 16px" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: FG,
            marginBottom: 6,
          }}
        >
          {style.name}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 12,
            lineHeight: 1.5,
            color: "rgba(245,245,240,0.62)",
          }}
        >
          {style.line}
        </div>
      </div>
    </button>
  );
}

function FileDropZone({
  title,
  helper,
  multiple,
  files,
  singleFile,
  onFiles,
}: {
  title: string;
  helper: string;
  multiple?: boolean;
  files?: File[];
  singleFile?: File | null;
  onFiles: (files: FileList | null) => void;
}) {
  const list = multiple ? files || [] : singleFile ? [singleFile] : [];

  return (
    <label
      style={{
        display: "block",
        border: "1px dashed rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.02)",
        padding: 16,
        cursor: "pointer",
      }}
    >
      <input
        type="file"
        multiple={multiple}
        onChange={(e) => onFiles(e.target.files)}
        style={{ display: "none" }}
      />

      <div
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: FG,
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontFamily: FONT,
          fontSize: 13,
          lineHeight: 1.55,
          color: "rgba(245,245,240,0.58)",
          marginBottom: list.length ? 12 : 0,
        }}
      >
        {helper}
      </div>

      {list.length ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
          }}
        >
          {list.map((file) => (
            <div
              key={`${file.name}-${file.size}`}
              style={{
                padding: "8px 10px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "#111",
                fontFamily: FONT,
                fontSize: 12,
                color: FG,
              }}
            >
              {file.name}
            </div>
          ))}
        </div>
      ) : null}
    </label>
  );
}

export default function TeamwearDesignPage() {
  const isMobile = useIsMobile();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isBlankCanvas = form.style === "blank";

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addMultipleFiles(key: "sponsorLogos" | "references", fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    setForm((prev) => ({
      ...prev,
      [key]: [...prev[key], ...incoming],
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("enquiryType", "Teamwear Design Brief");
      formData.append("sport", form.sport);
      formData.append("cut", form.cut);
      formData.append("style", form.style);
      formData.append("teamName", form.teamName);
      formData.append("colours", form.colours);
      formData.append("brief", form.brief);
      formData.append("contactName", form.contactName);
      formData.append("contactEmail", form.contactEmail);
      formData.append("organisation", form.organisation);

      if (form.primaryLogo) formData.append("primaryLogo", form.primaryLogo);
      if (form.artwork) formData.append("artwork", form.artwork);

      form.sponsorLogos.forEach((file) => {
        formData.append("sponsorLogos", file);
      });

      form.references.forEach((file) => {
        formData.append("references", file);
      });

      try {
        const res = await fetch("/api/enquiry", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Failed to send brief.");
        }
      } catch (apiErr) {
        console.log("[Teamwear brief fallback]", {
          ...form,
          primaryLogo: form.primaryLogo?.name || null,
          sponsorLogos: form.sponsorLogos.map((f) => f.name),
          references: form.references.map((f) => f.name),
          artwork: form.artwork?.name || null,
        });
        if (apiErr instanceof Error && !apiErr.message.includes("Failed to send")) {
          throw apiErr;
        }
      }

      setStatus("submitted");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "submitted") {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: BG,
          color: FG,
          display: "grid",
          placeItems: "center",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: 760, textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: LIME,
              marginBottom: 16,
            }}
          >
            Teamwear Brief Sent
          </div>

          <h1
            style={{
              fontFamily: FONT,
              fontSize: "clamp(54px, 9vw, 110px)",
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            OVER
            <br />
            TO US
            <span style={{ color: LIME }}>.</span>
          </h1>

          <p
            style={{
              margin: "20px auto 0",
              maxWidth: 560,
              fontFamily: FONT,
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(245,245,240,0.68)",
            }}
          >
            We’ll come back with a concept direction, a sample plan, and next steps within 24–48 hours.
          </p>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a
              href="/teamwear"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                padding: "0 24px",
                background: LIME,
                color: BG,
                textDecoration: "none",
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Back to Teamwear
            </a>

            <button
              type="button"
              onClick={() => {
                setForm(INITIAL_STATE);
                setStatus("idle");
              }}
              style={{
                height: 50,
                padding: "0 24px",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "transparent",
                color: FG,
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.12em",
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
          maxWidth: 1440,
          margin: "0 auto",
          padding: isMobile ? "84px 24px 72px" : "96px 48px 80px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
            gap: isMobile ? 14 : 24,
            alignItems: "start",
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginBottom: 6,
              }}
            >
              Teamwear
            </div>

            <div
              style={{
                fontFamily: FONT,
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.56)",
              }}
            >
              Guided concept brief
            </div>
          </div>

          <div
            style={{
              justifySelf: "start",
              textAlign: "left",
              maxWidth: 420,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.45,
              }}
            >
              Tell us how it should look,
              <br />
              feel, and perform
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: LIME,
              marginBottom: 16,
            }}
          >
            Teamwear Design Brief
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: FONT,
              fontSize: isMobile ? "clamp(52px, 14vw, 82px)" : "clamp(58px, 10vw, 148px)",
              fontWeight: 900,
              letterSpacing: "-0.065em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              color: FG,
            }}
          >
            DESIGN YOUR KIT
            <span style={{ color: LIME }}>.</span>
            <br />
            WITHOUT DESIGNING IT
            <span style={{ color: LIME }}>.</span>
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
            alignItems: "center",
            paddingTop: 18,
            paddingBottom: 48,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: 620 }}>
            <p
              style={{
                margin: 0,
                fontFamily: FONT,
                fontSize: 15,
                lineHeight: 1.68,
                color: "rgba(245,245,240,0.52)",
              }}
            >
              This is not a DIY configurator. It’s a guided brief that helps you show us the direction, the logos, the colours, and the intent.
              <br />
              <span style={{ color: FG, fontWeight: 600 }}>
                We take it from there and turn it into a properly built kit.
              </span>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 48 : 56,
          }}
        >
          <section>
            <SectionHeader
              number="01"
              title="Sport & Cut"
              subtitle="Start with the code and the basic silhouette. Keep it simple — we’ll handle the detail later."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
              }}
            >
              <div>
                <FieldLabel label="Sport" required />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 10,
                  }}
                >
                  {SPORTS.map((sport) => (
                    <ChoiceCard
                      key={sport}
                      label={sport}
                      active={form.sport === sport}
                      onClick={() => setField("sport", sport)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="Cut" required />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 10,
                  }}
                >
                  {CUTS.map((cut) => (
                    <ChoiceCard
                      key={cut}
                      label={cut}
                      active={form.cut === cut}
                      onClick={() => setField("cut", cut)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              number="02"
              title="Style Direction"
              subtitle="Pick a direction. We’ll refine it properly."
            />

            <div
              style={{
                fontFamily: FONT,
                fontSize: 13,
                lineHeight: 1.6,
                color: "rgba(245,245,240,0.6)",
                marginBottom: 18,
                maxWidth: 520,
              }}
            >
              Choose the closest lane to what you have in mind. This is a design direction, not the final artwork.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {STYLES.map((style) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  active={form.style === style.id}
                  onClick={() => setField("style", style.id)}
                />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              number="03"
              title="Team Identity"
              subtitle="Give us the basics — who it’s for and the colour world it needs to live in."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              <div>
                <FieldLabel label="Team / Club Name" />
                <input
                  type="text"
                  value={form.teamName}
                  onChange={(e) => setField("teamName", e.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.14)",
                    color: FG,
                    fontFamily: FONT,
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <FieldLabel label="Colours / Pantones" />
                <input
                  type="text"
                  value={form.colours}
                  onChange={(e) => setField("colours", e.target.value)}
                  placeholder="e.g. black, lime, white / Pantone 375"
                  style={{
                    width: "100%",
                    height: 48,
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.14)",
                    color: FG,
                    fontFamily: FONT,
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              number="04"
              title={isBlankCanvas ? "Your Artwork" : "Uploads"}
              subtitle="Logos, sponsors, references — anything you’ve got. Rough is fine."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {isBlankCanvas ? (
                <>
                  <FileDropZone
                    title="Your Artwork"
                    helper="Upload the design or working file you want us to build from."
                    singleFile={form.artwork}
                    onFiles={(files) => setField("artwork", files?.[0] || null)}
                  />

                  <FileDropZone
                    title="Primary Logo"
                    helper="Club or team logo if it sits outside the supplied artwork."
                    singleFile={form.primaryLogo}
                    onFiles={(files) => setField("primaryLogo", files?.[0] || null)}
                  />

                  <FileDropZone
                    title="Sponsor Logos"
                    helper="Upload sponsor lockups if they need placing or refining."
                    multiple
                    files={form.sponsorLogos}
                    onFiles={(files) => addMultipleFiles("sponsorLogos", files)}
                  />

                  <FileDropZone
                    title="References"
                    helper="Any inspo images, old kits, or visual directions."
                    multiple
                    files={form.references}
                    onFiles={(files) => addMultipleFiles("references", files)}
                  />
                </>
              ) : (
                <>
                  <FileDropZone
                    title="Primary Logo"
                    helper="Main club or team logo. Single file."
                    singleFile={form.primaryLogo}
                    onFiles={(files) => setField("primaryLogo", files?.[0] || null)}
                  />

                  <FileDropZone
                    title="Sponsor Logos"
                    helper="One or more sponsor marks or lockups."
                    multiple
                    files={form.sponsorLogos}
                    onFiles={(files) => addMultipleFiles("sponsorLogos", files)}
                  />

                  <FileDropZone
                    title="References"
                    helper="Inspiration, examples, old kits, or anything close."
                    multiple
                    files={form.references}
                    onFiles={(files) => addMultipleFiles("references", files)}
                  />

                  <FileDropZone
                    title="Own Artwork"
                    helper="Optional. Upload anything already in progress."
                    singleFile={form.artwork}
                    onFiles={(files) => setField("artwork", files?.[0] || null)}
                  />
                </>
              )}
            </div>
          </section>

          <section>
            <SectionHeader
              number="05"
              title="The Brief"
              subtitle="Tell us what you want — style, references, comps, fit, feel, sponsor treatment, anything that matters."
            />

            <textarea
              value={form.brief}
              onChange={(e) => setField("brief", e.target.value)}
              placeholder="e.g. We want something clean but still aggressive. Mostly black with lime and white. Sponsor logos need to sit neatly without taking over. We like the Hawke's Bay touch look but want it sharper and more premium."
              style={{
                width: "100%",
                minHeight: isMobile ? 160 : 170,
                padding: 16,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: FG,
                fontFamily: FONT,
                fontSize: 15,
                lineHeight: 1.65,
                outline: "none",
                resize: "vertical",
              }}
            />
          </section>

          <section>
            <SectionHeader
              number="06"
              title="Contact"
              subtitle="Who should we come back to with concept direction and next steps?"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              <div>
                <FieldLabel label="Name" required />
                <input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => setField("contactName", e.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.14)",
                    color: FG,
                    fontFamily: FONT,
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <FieldLabel label="Email" required />
                <input
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) => setField("contactEmail", e.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.14)",
                    color: FG,
                    fontFamily: FONT,
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <FieldLabel label="Club / Organisation" />
                <input
                  type="text"
                  value={form.organisation}
                  onChange={(e) => setField("organisation", e.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.14)",
                    color: FG,
                    fontFamily: FONT,
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </section>

          <section
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 22,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 13,
                lineHeight: 1.65,
                color: "rgba(245,245,240,0.62)",
                marginBottom: 16,
              }}
            >
              No templates.
              <br />
              No generic kits.
              <br />
              Everything is built for your team.
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                disabled={status === "submitting"}
                style={{
                  height: 52,
                  padding: "0 26px",
                  border: "none",
                  background: LIME,
                  color: BG,
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: status === "submitting" ? "default" : "pointer",
                  opacity: status === "submitting" ? 0.7 : 1,
                }}
              >
                {status === "submitting" ? "Sending…" : "Send Brief"}
              </button>

              <a
                href="/teamwear"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 52,
                  padding: "0 22px",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: FG,
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Back to Teamwear
              </a>
            </div>

            {status === "error" ? (
              <div
                style={{
                  marginTop: 14,
                  fontFamily: FONT,
                  fontSize: 13,
                  color: "#ff8b6b",
                }}
              >
                {errorMessage || "Something went wrong. Please try again."}
              </div>
            ) : null}

            <div
              style={{
                marginTop: 12,
                fontFamily: FONT,
                fontSize: 12,
                lineHeight: 1.6,
                color: "rgba(245,245,240,0.46)",
              }}
            >
              We’ll review it properly and come back with next steps within 24–48 hours.
            </div>
          </section>
        </form>
      </section>
    </main>
  );
}