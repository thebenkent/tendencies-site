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

const ORDER_CUTOFF = new Date("2026-05-10T21:00:00+12:00");
const DELIVERY_DATE = "1 June 2026";

const TEE_PRICE = 42;
const HOODIE_PRICE = 60;

const SIZES: Record<string, string[]> = {
  Mens: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  Womens: ["8", "10", "12", "14", "16", "18", "20"],
  Youth: ["6", "8", "10", "12", "14"],
};

const HOODIE_CHART_SRC = "/tanc-hoodie-size-chart.png";
const TEE_CHART_SRC = "/tanc-tee-size-chart.png";

// ── Types ────────────────────────────────────────────────────────────────────
type ProductType = "Tee" | "Hoodie";
type FitType = "Mens" | "Womens" | "Youth";

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
    fit: "Mens",
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
        Sunday 10 May · 9:00pm NZST
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

// ── Product card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  label,
  price,
  detail,
  frontSrc,
  backSrc,
  isMobile,
  onViewChart,
}: {
  product: ProductType;
  label: string;
  price: number;
  detail: string;
  frontSrc: string;
  backSrc: string;
  isMobile: boolean;
  onViewChart: () => void;
}) {
  const [hovered, setHovered] = useState(false);

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
        <img
          src={frontSrc}
          alt={`${label} front`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.55s ease",
          }}
        />
        <img
          src={backSrc}
          alt={`${label} back`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.55s ease",
          }}
        />

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
          ${price}{" "}
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
            ${price}{" "}
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
  product: "Tee" | "Hoodie";
  onClose: () => void;
}) {
  const src = product === "Tee" ? TEE_CHART_SRC : HOODIE_CHART_SRC;
  const alt =
    product === "Tee"
      ? "Te Atatū Netball Tee Size Chart"
      : "Te Atatū Netball Hoodie Size Chart";

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
          <img
            src={src}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              touchAction: "pinch-zoom",
            }}
          />
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
  const availableSizes = SIZES[item.fit] ?? [];
  const itemPrice = item.product === "Tee" ? TEE_PRICE : HOODIE_PRICE;

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
                <option value="Tee">Te Atatū Tee — $42</option>
                <option value="Hoodie">Te Atatū Hoodie — $60</option>
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
              <Label>Fit</Label>
              <select
                value={item.fit}
                onChange={(e) => {
                  onUpdate(item.id, "fit", e.target.value);
                  onUpdate(item.id, "size", "");
                }}
                style={selectBase}
              >
                <option value="Mens">Mens</option>
                <option value="Womens">Womens</option>
                <option value="Youth">Youth</option>
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
                {availableSizes.map((s) => (
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
            ${itemPrice}
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
        gridTemplateColumns: "32px 180px 140px 120px 1fr 70px 44px",
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
        <option value="Tee">Tee — $42</option>
        <option value="Hoodie">Hoodie — $60</option>
      </select>

      {/* Fit */}
      <select
        value={item.fit}
        onChange={(e) => {
          onUpdate(item.id, "fit", e.target.value);
          onUpdate(item.id, "size", "");
        }}
        style={selectBase}
      >
        <option value="Mens">Mens</option>
        <option value="Womens">Womens</option>
        <option value="Youth">Youth</option>
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
        {availableSizes.map((s) => (
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
        ${itemPrice}
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
export default function TeAtatuStorePage() {
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
    (sum, item) => sum + (item.product === "Tee" ? TEE_PRICE : HOODIE_PRICE),
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
      const res = await fetch("/api/teamwear/te-atatu/checkout", {
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
        <div style={{ marginBottom: sectionGap }}>
          <Eyebrow>Te Atatū Netball Club · Team Store</Eyebrow>

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
              margin: "0 0 32px",
            }}
          >
            TEAM
            <br />
            WEAR
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
            Order your kit below. Each garment is personalised with your name
            and delivered to the club.
          </p>

          {/* Delivery badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: `1px solid rgba(184,244,0,0.2)`,
              background: "rgba(184,244,0,0.04)",
              marginBottom: "40px",
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
              Delivered to the club · {DELIVERY_DATE}
            </span>
          </div>

          {/* Countdown */}
          <CountdownBlock timeLeft={timeLeft} isMobile={isMobile} />
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
              label="Te Atatū Tee"
              price={TEE_PRICE}
              detail="Short-sleeve. Crew neck. Printed name."
              frontSrc="/tanc-tee-front.jpg"
              backSrc="/tanc-tee-back.jpg"
              isMobile={isMobile}
              onViewChart={() => setOpenChart("Tee")}
            />
            <ProductCard
              product="Hoodie"
              label="Te Atatū Hoodie"
              price={HOODIE_PRICE}
              detail="Pullover. Kangaroo pocket. Printed name."
              frontSrc="/tanc-hoodie-front.jpg"
              backSrc="/tanc-hoodie-back.jpg"
              isMobile={isMobile}
              onViewChart={() => setOpenChart("Hoodie")}
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
                gridTemplateColumns: "32px 180px 140px 120px 1fr 70px 44px",
                gap: "8px",
                padding: "0 0 10px",
                borderBottom: `1px solid rgba(255,255,255,0.14)`,
                marginBottom: "2px",
              }}
            >
              {[
                "",
                "Product",
                "Fit",
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
                {(["Tee", "Hoodie"] as ProductType[]).map((p) => (
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
                    Te Atatū {item.product}
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
                  ${item.product === "Tee" ? TEE_PRICE : HOODIE_PRICE}
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
                ${totalNZD}
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

          {/* Delivery note */}
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
              All orders will be delivered to the club · {DELIVERY_DATE}
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
                  : `Pay Now — $${totalNZD} NZD →`}
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
