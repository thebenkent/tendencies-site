"use client";

import { useState, useEffect } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const FONT = "Helvetica, Arial, sans-serif";
const BG = "#080808";
const FG = "#f5f5f0";
const LIME = "#b8f400";
const CARD_BG = "#0f0f0f";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_MID = "rgba(255,255,255,0.12)";

const ORDER_CUTOFF = new Date("2026-09-20T21:00:00+12:00");
const COLLECTION_DATE = "28 October 2026";

const TEE_PRICE = 45;
const TANK_PRICE = 39.39;

const SIZES = ["XSM", "SML", "MED", "LRG", "XLG", "2XL", "3XL", "4XL", "5XL"];

const TEE_CHART_SRC = "/mim-size-chart.png";
const TANK_CHART_SRC = "/mim-size-chart.png";

function formatPrice(n: number) {
  return Number.isInteger(n) ? `${n}` : n.toFixed(2);
}

// ── Types ────────────────────────────────────────────────────────────────────
type ProductType = "Tee" | "Tank";
type FitType = "Staple" | "Maple";

type OrderItem = {
  id: string;
  product: ProductType;
  fit: FitType;
  size: string;
  name: string;
};

type Customer = {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function calcTimeLeft(): TimeLeft {
  const diff = ORDER_CUTOFF.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  };
}

function newItem(): OrderItem {
  return {
    id: Math.random().toString(36).slice(2),
    product: "Tee",
    fit: "Staple",
    size: "",
    name: "",
  };
}

function useIsMobile(bp = 768) {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const check = () => setIs(window.innerWidth <= bp);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [bp]);
  return is;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

// ── Input / select base styles ───────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  width: "100%",
  height: "48px",
  padding: "0 14px",
  background: "#111",
  border: `1px solid ${BORDER_MID}`,
  color: FG,
  fontFamily: FONT,
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  appearance: "none",
  WebkitAppearance: "none" as React.CSSProperties["WebkitAppearance"],
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M1 1l4 4 4-4' stroke='%23b8f400' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "32px",
  cursor: "pointer",
};

// ── Label ────────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.55)",
        marginBottom: "8px",
      }}
    >
      {children}
    </div>
  );
}

// ── Eyebrow ──────────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: LIME,
        marginBottom: "14px",
      }}
    >
      {children}
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({
  eyebrow,
  title,
  isMobile,
}: {
  eyebrow: string;
  title: React.ReactNode;
  isMobile: boolean;
}) {
  return (
    <div style={{ marginBottom: isMobile ? "28px" : "36px" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <div
        style={{
          fontFamily: FONT,
          fontSize: isMobile ? "clamp(30px, 8vw, 42px)" : "clamp(36px, 4vw, 52px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
          textTransform: "uppercase",
          color: FG,
        }}
      >
        {title}
        <span style={{ color: LIME }}>.</span>
      </div>
    </div>
  );
}

// ── SectionDivider ───────────────────────────────────────────────────────────
function SectionDivider({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      style={{
        borderTop: `1px solid ${BORDER}`,
        paddingTop: isMobile ? "56px" : "72px",
        marginBottom: isMobile ? "0" : "0",
      }}
    />
  );
}

// ── Countdown block ──────────────────────────────────────────────────────────
function CountdownBlock({
  timeLeft,
  isMobile,
}: {
  timeLeft: TimeLeft;
  isMobile: boolean;
}) {
  if (timeLeft.expired) {
    return (
      <div
        style={{
          background: CARD_BG,
          border: `1px solid ${BORDER_MID}`,
          padding: isMobile ? "28px 24px" : "32px 36px",
          display: "inline-block",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Orders are now closed
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER_MID}`,
        padding: isMobile ? "24px 20px" : "32px 36px",
        display: isMobile ? "block" : "inline-block",
        width: isMobile ? "100%" : "auto",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "6px",
        }}
      >
        Orders close
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "rgba(255,255,255,0.65)",
          marginBottom: "24px",
        }}
      >
        Sunday 20 September · 9:00pm NZST
      </div>

      <div
        style={{
          display: "flex",
          gap: isMobile ? "8px" : "12px",
          alignItems: "stretch",
        }}
      >
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.minutes, label: "Mins" },
          { value: timeLeft.seconds, label: "Secs" },
        ].map(({ value, label }, i, arr) => (
          <div key={label} style={{ display: "flex", alignItems: "stretch", gap: isMobile ? "8px" : "12px" }}>
            <div
              style={{
                background: "#161616",
                border: `1px solid rgba(255,255,255,0.1)`,
                padding: isMobile ? "12px 14px" : "16px 20px",
                minWidth: isMobile ? "60px" : "76px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: isMobile ? "clamp(28px, 7vw, 40px)" : "44px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: FG,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pad2(value)}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.38)",
                  marginTop: "6px",
                }}
              >
                {label}
              </div>
            </div>
            {i < arr.length - 1 && (
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: isMobile ? "22px" : "28px",
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.18)",
                  alignSelf: "center",
                  lineHeight: 1,
                  marginTop: "-8px",
                }}
              >
                :
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Product image with graceful placeholder fallback ────────────────────────
function ProductImage({
  src,
  alt,
  visible,
}: {
  src: string;
  alt: string;
  visible: boolean;
}) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.55s ease",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Photo coming soon
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.55s ease",
      }}
    />
  );
}

// ── Product card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  label,
  price,
  detail,
  images,
  isMobile,
  onViewChart,
}: {
  product: ProductType;
  label: string;
  price: number;
  detail: string;
  images: Record<FitType, { front: string; back: string }>;
  isMobile: boolean;
  onViewChart: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [style, setStyle] = useState<FitType>("Staple");
  const current = images[style];

  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image — front/back cross-fade on hover */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4 / 5",
          background: "#141414",
          overflow: "hidden",
        }}
      >
        <ProductImage
          key={`${style}-front`}
          src={current.front}
          alt={`${label} — ${style} front`}
          visible={!hovered}
        />
        <ProductImage
          key={`${style}-back`}
          src={current.back}
          alt={`${label} — ${style} back`}
          visible={hovered}
        />

        {/* Style toggle */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            display: "flex",
            background: "rgba(8,8,8,0.78)",
            border: "1px solid rgba(255,255,255,0.1)",
            zIndex: 1,
          }}
        >
          {(["Staple", "Maple"] as FitType[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setStyle(s);
              }}
              style={{
                background: style === s ? LIME : "transparent",
                border: "none",
                color: style === s ? BG : "rgba(255,255,255,0.55)",
                fontFamily: FONT,
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Price badge */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            background: "rgba(8,8,8,0.78)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "6px 12px",
            fontFamily: FONT,
            fontSize: "13px",
            fontWeight: 700,
            color: FG,
            letterSpacing: "0.02em",
          }}
        >
          ${formatPrice(price)}{" "}
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
            NZD
          </span>
        </div>

        {/* Hover label */}
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            right: "14px",
            fontFamily: FONT,
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: LIME,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          Back view
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: isMobile ? "20px" : "24px 28px" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "6px",
          }}
        >
          {product}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: isMobile ? "22px" : "26px",
            fontWeight: 900,
            letterSpacing: "-0.025em",
            textTransform: "uppercase",
            color: FG,
            lineHeight: 1,
            marginBottom: "6px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: "13px",
            color: "rgba(255,255,255,0.45)",
            marginBottom: "20px",
            lineHeight: 1.5,
          }}
        >
          {detail}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: FG,
            }}
          >
            ${formatPrice(price)}{" "}
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.06em",
              }}
            >
              incl. GST
            </span>
          </div>
          <button
            type="button"
            onClick={onViewChart}
            style={{
              background: "transparent",
              border: `1px solid rgba(255,255,255,0.2)`,
              color: "rgba(255,255,255,0.6)",
              fontFamily: FONT,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "8px 14px",
              cursor: "pointer",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = FG;
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            Size chart →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Size chart modal ─────────────────────────────────────────────────────────
function SizeChartModal({
  product,
  onClose,
}: {
  product: ProductType;
  onClose: () => void;
}) {
  const src = product === "Tee" ? TEE_CHART_SRC : TANK_CHART_SRC;
  const alt =
    product === "Tee"
      ? "Mates in Motors Tee Size Chart"
      : "Mates in Motors Tank Size Chart";
  const [broken, setBroken] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product} size chart`}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{ position: "relative", maxWidth: "min(820px, 94vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close size chart"
          style={{
            position: "absolute",
            top: "-46px",
            right: 0,
            background: "transparent",
            border: "none",
            color: FG,
            fontSize: "30px",
            lineHeight: 1,
            cursor: "pointer",
            fontFamily: FONT,
            padding: "4px 8px",
          }}
        >
          ×
        </button>
        <div
          style={{
            maxHeight: "85vh",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
          }}
        >
          {broken ? (
            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_MID}`,
                padding: "40px 32px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: "18px",
                }}
              >
                Size chart image coming soon. Available sizes:
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                {SIZES.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: FONT,
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      padding: "8px 12px",
                      border: `1px solid ${BORDER_MID}`,
                      color: FG,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.35)",
                  marginTop: "16px",
                }}
              >
                4XL / 5XL made to order — limited stock.
              </div>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              onError={() => setBroken(true)}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                touchAction: "pinch-zoom",
              }}
            />
          )}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontFamily: FONT,
            fontSize: "11px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {alt}
        </div>
      </div>
    </div>
  );
}

// ── Item row ─────────────────────────────────────────────────────────────────
function ItemRow({
  item,
  index,
  total,
  isMobile,
  onUpdate,
  onRemove,
  onViewChart,
}: {
  item: OrderItem;
  index: number;
  total: number;
  isMobile: boolean;
  onUpdate: (id: string, field: keyof Omit<OrderItem, "id">, value: string) => void;
  onRemove: (id: string) => void;
  onViewChart: (p: ProductType) => void;
}) {
  const itemPrice = item.product === "Tee" ? TEE_PRICE : TANK_PRICE;

  if (isMobile) {
    return (
      <div
        style={{
          background: CARD_BG,
          border: `1px solid ${BORDER_MID}`,
          padding: "20px",
          marginBottom: "8px",
        }}
      >
        {/* Row header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: LIME,
            }}
          >
            Item {index + 1}
          </span>
          {total > 1 && (
            <button
              onClick={() => onRemove(item.id)}
              aria-label={`Remove item ${index + 1}`}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                fontSize: "22px",
                lineHeight: 1,
                cursor: "pointer",
                padding: "2px 6px",
                fontFamily: FONT,
              }}
            >
              ×
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Product + chart */}
          <div>
            <Label>Product</Label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <select
                value={item.product}
                onChange={(e) => onUpdate(item.id, "product", e.target.value)}
                style={{ ...selectBase, flex: 1 }}
              >
                <option value="Tee">Mates in Motors Tee — ${formatPrice(TEE_PRICE)}</option>
                <option value="Tank">Mates in Motors Tank — ${formatPrice(TANK_PRICE)}</option>
              </select>
              <button
                type="button"
                onClick={() => onViewChart(item.product)}
                style={{
                  flexShrink: 0,
                  height: "48px",
                  padding: "0 12px",
                  background: "transparent",
                  border: `1px solid ${BORDER_MID}`,
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Sizes
              </button>
            </div>
          </div>

          {/* Fit + Size */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <Label>Style</Label>
              <select
                value={item.fit}
                onChange={(e) => onUpdate(item.id, "fit", e.target.value)}
                style={selectBase}
              >
                <option value="Staple">Staple (Mens)</option>
                <option value="Maple">Maple (Womens)</option>
              </select>
            </div>
            <div>
              <Label>Size</Label>
              <select
                value={item.size}
                onChange={(e) => onUpdate(item.id, "size", e.target.value)}
                style={selectBase}
              >
                <option value="" disabled>
                  Select
                </option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label>Name (printed on garment)</Label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => onUpdate(item.id, "name", e.target.value)}
              placeholder="e.g. Alice Smith"
              style={inputBase}
            />
          </div>

          {/* Item price */}
          <div
            style={{
              fontFamily: FONT,
              fontSize: "15px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              textAlign: "right",
            }}
          >
            ${formatPrice(itemPrice)}
          </div>
        </div>
      </div>
    );
  }

  // Desktop row
  // Columns: index | product | fit | size | name | price | remove
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "32px 220px 140px 100px 1fr 70px 44px",
        gap: "8px",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      {/* Index */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.3)",
          userSelect: "none",
        }}
      >
        {pad2(index + 1)}
      </div>

      {/* Product */}
      <select
        value={item.product}
        onChange={(e) => onUpdate(item.id, "product", e.target.value)}
        style={selectBase}
      >
        <option value="Tee">Tee — ${formatPrice(TEE_PRICE)}</option>
        <option value="Tank">Tank — ${formatPrice(TANK_PRICE)}</option>
      </select>

      {/* Fit */}
      <select
        value={item.fit}
        onChange={(e) => onUpdate(item.id, "fit", e.target.value)}
        style={selectBase}
      >
        <option value="Staple">Staple (Mens)</option>
        <option value="Maple">Maple (Womens)</option>
      </select>

      {/* Size */}
      <select
        value={item.size}
        onChange={(e) => onUpdate(item.id, "size", e.target.value)}
        style={selectBase}
      >
        <option value="" disabled>
          Size
        </option>
        {SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Name */}
      <input
        type="text"
        value={item.name}
        onChange={(e) => onUpdate(item.id, "name", e.target.value)}
        placeholder="Name for garment"
        style={inputBase}
      />

      {/* Price */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: "15px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.55)",
          textAlign: "right",
        }}
      >
        ${formatPrice(itemPrice)}
      </div>

      {/* Remove */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {total > 1 && (
          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Remove item ${index + 1}`}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              fontSize: "22px",
              lineHeight: 1,
              cursor: "pointer",
              padding: "4px",
              transition: "color 0.2s",
              fontFamily: FONT,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,100,100,0.75)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
            }
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MatesInMotorsStorePage() {
  const isMobile = useIsMobile();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft);

  const [items, setItems] = useState<OrderItem[]>([newItem()]);
  const [customer, setCustomer] = useState<Customer>({
    fullName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [openChart, setOpenChart] = useState<ProductType | null>(null);
  const [checkoutState, setCheckoutState] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Countdown ticker
  useEffect(() => {
    if (timeLeft.expired) return;
    const t = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(t);
  }, [timeLeft.expired]);

  // Item management
  const addItem = () => setItems((prev) => [...prev, newItem()]);

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const updateItem = (
    id: string,
    field: keyof Omit<OrderItem, "id">,
    value: string
  ) =>
    setItems((prev) =>
      prev.map((item) => (item.id !== id ? item : { ...item, [field]: value }))
    );

  const updateCustomer =
    (field: keyof Customer) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCustomer((c) => ({ ...c, [field]: e.target.value }));

  const totalNZD = items.reduce(
    (sum, item) => sum + (item.product === "Tee" ? TEE_PRICE : TANK_PRICE),
    0
  );

  function validate(): string | null {
    if (!customer.fullName.trim()) return "Please enter your full name.";
    if (!customer.email.trim()) return "Please enter your email address.";
    if (!customer.phone.trim()) return "Please enter your phone number.";
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.size) return `Please select a size for item ${i + 1}.`;
      if (!item.name.trim()) return `Please enter a name for item ${i + 1}.`;
    }
    return null;
  }

  async function handleCheckout() {
    const err = validate();
    if (err) {
      setErrorMsg(err);
      setCheckoutState("error");
      return;
    }
    setCheckoutState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/teamwear/mates-in-motors/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.url;
    } catch (e) {
      setCheckoutState("error");
      setErrorMsg(
        e instanceof Error
          ? e.message
          : "Failed to start checkout. Please try again."
      );
    }
  }

  const px = isMobile ? "20px" : "48px";
  const sectionGap = isMobile ? "64px" : "88px";

  return (
    <div style={{ background: BG, color: FG, minHeight: "100vh", fontFamily: FONT }}>
      {/* Size chart modal */}
      {openChart && (
        <SizeChartModal product={openChart} onClose={() => setOpenChart(null)} />
      )}

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: `88px ${px} 104px`,
        }}
      >

        {/* ── HERO ────────────────────────────────────────────────── */}
        <div
          style={{
            marginBottom: sectionGap,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "flex-end",
            gap: isMobile ? "0" : "48px",
          }}
        >
          {/* Left: heading + copy + collection badge */}
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <Eyebrow>Civil Contractors NZ · Mates in Motors 2026</Eyebrow>

            <h1
              style={{
                fontFamily: FONT,
                fontSize: isMobile
                  ? "clamp(56px, 16vw, 88px)"
                  : "clamp(80px, 12vw, 140px)",
                fontWeight: 900,
                letterSpacing: "-0.065em",
                lineHeight: 0.86,
                textTransform: "uppercase",
                margin: "0 0 36px",
              }}
            >
              GEAR
              <br />
              UP
              <span style={{ color: LIME }}>.</span>
            </h1>

            <p
              style={{
                fontFamily: FONT,
                fontSize: "15px",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.55)",
                margin: "0 0 28px",
                maxWidth: "500px",
              }}
            >
              Order your kit below for the Taupō weekend. Each garment is
              personalised with your name and collected as one group order —
              no individual freight.
            </p>

            {/* Collection badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 16px",
                border: `1px solid rgba(184,244,0,0.2)`,
                background: "rgba(184,244,0,0.04)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: LIME,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Collected from Tendencies, Auckland · {COLLECTION_DATE}
              </span>
            </div>
          </div>

          {/* Right: countdown */}
          <div
            style={{
              minWidth: isMobile ? "auto" : "320px",
              width: isMobile ? "100%" : "auto",
              marginTop: isMobile ? "32px" : "0",
              flexShrink: 0,
            }}
          >
            <CountdownBlock timeLeft={timeLeft} isMobile={isMobile} />
          </div>
        </div>

        {/* ── PRODUCTS ────────────────────────────────────────────── */}
        <div style={{ marginBottom: sectionGap }}>
          <SectionDivider isMobile={isMobile} />
          <SectionHeading eyebrow="Products" title="The Kit" isMobile={isMobile} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "2px",
            }}
          >
            <ProductCard
              product="Tee"
              label="Mates in Motors Tee"
              price={TEE_PRICE}
              detail="Staple (Mens) / Maple (Womens). Left chest + centre back print. Printed name."
              images={{
                Staple: {
                  front: "/mim-tee-front-staple.png",
                  back: "/mim-tee-back-staple.png",
                },
                Maple: {
                  front: "/mim-tee-front-maple.png",
                  back: "/mim-tee-back-maple.png",
                },
              }}
              isMobile={isMobile}
              onViewChart={() => setOpenChart("Tee")}
            />
            <ProductCard
              product="Tank"
              label="Mates in Motors Tank"
              price={TANK_PRICE}
              detail="Staple (Mens) / Maple (Womens). Left chest + centre back print. Printed name."
              images={{
                Staple: {
                  front: "/mim-tank-front-staple.png",
                  back: "/mim-tank-back-staple.png",
                },
                Maple: {
                  front: "/mim-tank-front-maple.png",
                  back: "/mim-tank-back-maple.png",
                },
              }}
              isMobile={isMobile}
              onViewChart={() => setOpenChart("Tank")}
            />
          </div>
        </div>

        {/* ── ORDER BUILDER ────────────────────────────────────────── */}
        <div style={{ marginBottom: sectionGap }}>
          <SectionDivider isMobile={isMobile} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            <SectionHeading
              eyebrow="Your Order"
              title="Add Items"
              isMobile={isMobile}
            />
            <div
              style={{
                fontFamily: FONT,
                fontSize: "13px",
                color: "rgba(255,255,255,0.38)",
                letterSpacing: "0.04em",
                marginBottom: isMobile ? "0" : "8px",
              }}
            >
              One row per garment
            </div>
          </div>

          {/* Desktop column headers */}
          {!isMobile && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "32px 220px 140px 100px 1fr 70px 44px",
                gap: "8px",
                padding: "0 0 10px",
                borderBottom: `1px solid rgba(255,255,255,0.14)`,
                marginBottom: "2px",
              }}
            >
              {[
                "",
                "Product",
                "Style",
                "Size",
                "Name (on garment)",
                "Price",
                "",
              ].map((h, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: FONT,
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.38)",
                    textAlign: i === 5 ? "right" : "left",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
          )}

          {/* Item rows */}
          {items.map((item, i) => (
            <ItemRow
              key={item.id}
              item={item}
              index={i}
              total={items.length}
              isMobile={isMobile}
              onUpdate={updateItem}
              onRemove={removeItem}
              onViewChart={setOpenChart}
            />
          ))}

          {/* Add item + size chart links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <button
              type="button"
              onClick={addItem}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "44px",
                padding: "0 20px",
                background: "transparent",
                border: `1px solid ${BORDER_MID}`,
                color: "rgba(255,255,255,0.6)",
                fontFamily: FONT,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = LIME;
                e.currentTarget.style.color = FG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER_MID;
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
            >
              <span style={{ fontSize: "18px", lineHeight: 1, marginTop: "-1px" }}>
                +
              </span>
              Add another item
            </button>

            {!isMobile && (
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.04em",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                Size charts:
                {(["Tee", "Tank"] as ProductType[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setOpenChart(p)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: FONT,
                      fontSize: "12px",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── CUSTOMER DETAILS ──────────────────────────────────────── */}
        <div style={{ marginBottom: sectionGap }}>
          <SectionDivider isMobile={isMobile} />
          <SectionHeading
            eyebrow="Your Details"
            title="Contact Info"
            isMobile={isMobile}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "20px",
              maxWidth: "720px",
            }}
          >
            <div>
              <Label>Full Name *</Label>
              <input
                type="text"
                required
                autoComplete="name"
                value={customer.fullName}
                onChange={updateCustomer("fullName")}
                placeholder="Your full name"
                style={inputBase}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(184,244,0,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = BORDER_MID)
                }
              />
            </div>
            <div>
              <Label>Email *</Label>
              <input
                type="email"
                required
                autoComplete="email"
                value={customer.email}
                onChange={updateCustomer("email")}
                placeholder="your@email.com"
                style={inputBase}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(184,244,0,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = BORDER_MID)
                }
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <input
                type="tel"
                required
                autoComplete="tel"
                value={customer.phone}
                onChange={updateCustomer("phone")}
                placeholder="+64 21 000 0000"
                style={inputBase}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(184,244,0,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = BORDER_MID)
                }
              />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <textarea
                value={customer.notes}
                onChange={updateCustomer("notes")}
                placeholder="Any special instructions"
                rows={3}
                style={{
                  ...inputBase,
                  height: "auto",
                  padding: "12px 14px",
                  resize: "vertical",
                  lineHeight: 1.55,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(184,244,0,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = BORDER_MID)
                }
              />
            </div>
          </div>
        </div>

        {/* ── ORDER SUMMARY + CHECKOUT ──────────────────────────────── */}
        <div>
          <SectionDivider isMobile={isMobile} />
          <SectionHeading
            eyebrow="Review"
            title="Order Summary"
            isMobile={isMobile}
          />

          {/* Summary list */}
          <div
            style={{
              border: `1px solid ${BORDER_MID}`,
              background: CARD_BG,
              marginBottom: "20px",
              maxWidth: "640px",
            }}
          >
            {items.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "16px 22px",
                  borderBottom:
                    i < items.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: "15px",
                      fontWeight: 700,
                      color: FG,
                      lineHeight: 1.3,
                      marginBottom: "3px",
                    }}
                  >
                    Mates in Motors {item.product}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.fit}
                    {item.size ? ` · ${item.size}` : ""}
                    {item.name ? ` · ${item.name}` : ""}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "15px",
                    fontWeight: 700,
                    color: FG,
                    whiteSpace: "nowrap",
                  }}
                >
                  ${formatPrice(item.product === "Tee" ? TEE_PRICE : TANK_PRICE)}
                </div>
              </div>
            ))}

            {/* Total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 22px",
                background: "#161616",
                borderTop: `1px solid rgba(255,255,255,0.12)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Total incl. GST
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: FG,
                }}
              >
                ${totalNZD.toFixed(2)}
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.4)",
                    marginLeft: "6px",
                    letterSpacing: "0.04em",
                  }}
                >
                  NZD
                </span>
              </div>
            </div>
          </div>

          {/* Collection note */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 18px",
              border: `1px solid rgba(184,244,0,0.18)`,
              background: "rgba(184,244,0,0.04)",
              marginBottom: "36px",
              maxWidth: "640px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: LIME,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: FONT,
                fontSize: "13px",
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.5,
              }}
            >
              No freight — all orders collected as one group from Tendencies,
              Auckland · {COLLECTION_DATE}
            </span>
          </div>

          {/* Error */}
          {checkoutState === "error" && errorMsg && (
            <div
              role="alert"
              style={{
                marginBottom: "24px",
                padding: "14px 18px",
                border: "1px solid rgba(255,80,80,0.3)",
                background: "rgba(255,80,80,0.06)",
                fontFamily: FONT,
                fontSize: "14px",
                color: "#ff8b6b",
                maxWidth: "640px",
                lineHeight: 1.5,
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Checkout button */}
          {timeLeft.expired ? (
            <div
              style={{
                fontFamily: FONT,
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                padding: "18px 0",
              }}
            >
              Orders are closed.
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkoutState === "loading"}
                style={{
                  height: "58px",
                  padding: "0 44px",
                  background:
                    checkoutState === "loading" ? "rgba(184,244,0,0.6)" : LIME,
                  color: BG,
                  fontFamily: FONT,
                  fontSize: "14px",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: checkoutState === "loading" ? "default" : "pointer",
                  transition: "opacity 0.2s",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) => {
                  if (checkoutState !== "loading")
                    e.currentTarget.style.opacity = "0.88";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                {checkoutState === "loading"
                  ? "Redirecting to payment…"
                  : `Pay Now — $${totalNZD.toFixed(2)} NZD →`}
              </button>

              <div
                style={{
                  marginTop: "14px",
                  fontFamily: FONT,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.04em",
                  maxWidth: "400px",
                  lineHeight: 1.5,
                }}
              >
                You&apos;ll be taken to Stripe&apos;s secure checkout. We don&apos;t store
                your card details.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
