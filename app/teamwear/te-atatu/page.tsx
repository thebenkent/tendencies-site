"use client";

import { useState, useEffect } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const FONT = "Helvetica, Arial, sans-serif";
const BG = "#080808";
const FG = "#f5f5f0";
const LIME = "#b8f400";
const CARD_BG = "#0f0f0f";
const BORDER = "rgba(255,255,255,0.08)";

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

// ── Shared input styles ──────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  width: "100%",
  height: "42px",
  padding: "0 12px",
  background: "#111",
  border: "1px solid rgba(255,255,255,0.12)",
  color: FG,
  fontFamily: FONT,
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  appearance: "none",
  WebkitAppearance: "none" as React.CSSProperties["WebkitAppearance"],
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M1 1l4 4 4-4' stroke='%23b8f400' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: "28px",
  cursor: "pointer",
};

// ── Size Chart Modal ─────────────────────────────────────────────────────────
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
        background: "rgba(0,0,0,0.88)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{ position: "relative", maxWidth: "min(800px, 94vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close size chart"
          style={{
            position: "absolute",
            top: "-44px",
            right: 0,
            background: "transparent",
            border: "none",
            color: FG,
            fontSize: "28px",
            lineHeight: 1,
            cursor: "pointer",
            fontFamily: FONT,
            padding: "4px 8px",
          }}
        >
          ×
        </button>

        {/* Image — allow pinch-to-zoom on mobile */}
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
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {alt}
        </div>
      </div>
    </div>
  );
}

// ── Item Row ─────────────────────────────────────────────────────────────────
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
          border: `1px solid ${BORDER}`,
          padding: "20px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
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
                color: "rgba(255,255,255,0.35)",
                fontSize: "18px",
                lineHeight: 1,
                cursor: "pointer",
                padding: "4px 6px",
                fontFamily: FONT,
              }}
            >
              ×
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Product */}
          <div>
            <Label>Product</Label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <select
                value={item.product}
                onChange={(e) => onUpdate(item.id, "product", e.target.value)}
                style={{ ...selectBase, flex: 1 }}
              >
                <option value="Tee">Tee — $42</option>
                <option value="Hoodie">Hoodie — $60</option>
              </select>
              <button
                type="button"
                onClick={() => onViewChart(item.product)}
                style={{
                  flexShrink: 0,
                  height: "42px",
                  padding: "0 12px",
                  background: "transparent",
                  border: `1px solid ${BORDER}`,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Size chart
              </button>
            </div>
          </div>

          {/* Fit + Size */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
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
                <option value="" disabled>Select</option>
                {availableSizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
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

          <div
            style={{
              fontFamily: FONT,
              fontSize: "13px",
              color: "rgba(255,255,255,0.4)",
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
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 170px 120px 110px 1fr 52px 40px",
        gap: "8px",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      {/* Row number */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.28)",
          userSelect: "none",
        }}
      >
        {pad2(index + 1)}
      </div>

      {/* Product */}
      <div>
        <select
          value={item.product}
          onChange={(e) => onUpdate(item.id, "product", e.target.value)}
          style={selectBase}
        >
          <option value="Tee">Tee — $42</option>
          <option value="Hoodie">Hoodie — $60</option>
        </select>
      </div>

      {/* Fit */}
      <div>
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

      {/* Size */}
      <div>
        <select
          value={item.size}
          onChange={(e) => onUpdate(item.id, "size", e.target.value)}
          style={selectBase}
        >
          <option value="" disabled>Size</option>
          {availableSizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate(item.id, "name", e.target.value)}
          placeholder="Name for garment"
          style={inputBase}
        />
      </div>

      {/* Price */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: "13px",
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
              fontSize: "20px",
              lineHeight: 1,
              cursor: "pointer",
              padding: "4px",
              transition: "color 0.2s",
              fontFamily: FONT,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,100,100,0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        marginBottom: "6px",
      }}
    >
      {children}
    </div>
  );
}

// ── Countdown Unit ───────────────────────────────────────────────────────────
function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: "clamp(28px, 5vw, 44px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: FG,
          tabularNums: true,
        } as React.CSSProperties}
      >
        {pad2(value)}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          marginTop: "4px",
        }}
      >
        {label}
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
  const [checkoutState, setCheckoutState] = useState<"idle" | "loading" | "error">("idle");
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

  const updateItem = (id: string, field: keyof Omit<OrderItem, "id">, value: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id !== id ? item : { ...item, [field]: value }
      )
    );

  // Customer field helper
  const updateCustomer = (field: keyof Customer) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCustomer((c) => ({ ...c, [field]: e.target.value }));

  // Totals
  const totalNZD = items.reduce(
    (sum, item) => sum + (item.product === "Tee" ? TEE_PRICE : HOODIE_PRICE),
    0
  );

  // Validation
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
      setErrorMsg(e instanceof Error ? e.message : "Failed to start checkout. Please try again.");
    }
  }

  const px = isMobile ? "20px" : "48px";

  return (
    <div style={{ background: BG, color: FG, minHeight: "100vh", fontFamily: FONT }}>

      {/* Size chart modal */}
      {openChart && (
        <SizeChartModal product={openChart} onClose={() => setOpenChart(null)} />
      )}

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: `80px ${px} 96px` }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: isMobile ? "56px" : "72px" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: LIME,
              marginBottom: "16px",
            }}
          >
            Te Atatū Netball Club · Team Store
          </div>

          <h1
            style={{
              fontSize: isMobile ? "clamp(52px, 14vw, 88px)" : "clamp(72px, 10vw, 128px)",
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.88,
              textTransform: "uppercase",
              margin: "0 0 28px",
            }}
          >
            TEAMWEAR
            <span style={{ color: LIME }}>.</span>
          </h1>

          {/* Delivery badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: `1px solid ${BORDER}`,
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
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Delivered to the club · {DELIVERY_DATE}
            </span>
          </div>

          {/* Countdown */}
          <div
            style={{
              padding: isMobile ? "24px 20px" : "28px 32px",
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              display: "inline-block",
              minWidth: isMobile ? "100%" : "auto",
            }}
          >
            {timeLeft.expired ? (
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.55)",
                  textTransform: "uppercase",
                }}
              >
                Orders are now closed.
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.38)",
                    marginBottom: "14px",
                  }}
                >
                  Orders close in
                </div>
                <div style={{ display: "flex", gap: isMobile ? "20px" : "28px", alignItems: "center" }}>
                  <CountUnit value={timeLeft.days} label="Days" />
                  <Divider />
                  <CountUnit value={timeLeft.hours} label="Hours" />
                  <Divider />
                  <CountUnit value={timeLeft.minutes} label="Mins" />
                  <Divider />
                  <CountUnit value={timeLeft.seconds} label="Secs" />
                </div>
                <div
                  style={{
                    marginTop: "14px",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  Closes Sun 10 May 2026 · 9:00pm NZST
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── PRODUCTS ─────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            paddingTop: isMobile ? "48px" : "64px",
            marginBottom: isMobile ? "56px" : "72px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: LIME,
              marginBottom: "24px",
            }}
          >
            Products
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "2px",
            }}
          >{[
  {
    product: "Tee" as ProductType,
    label: "Te Atatū Tee",
    price: TEE_PRICE,
    detail: "Short-sleeve, crew neck.",
    images: ["/tanc-tee-front.jpg", "/tanc-tee-back.jpg"],
  },
  {
    product: "Hoodie" as ProductType,
    label: "Te Atatū Hoodie",
    price: HOODIE_PRICE,
    detail: "Pullover, kangaroo pocket.",
    images: ["/tanc-hoodie-front.jpg", "/tanc-hoodie-back.jpg"],
  },
].map(({ product, label, price, detail, images }) => (
  <div
    key={product}
    style={{
      background: CARD_BG,
      border: `1px solid ${BORDER}`,
      overflow: "hidden",
    }}
  >
    {/* IMAGE */}
    <div
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        background: "#111",
        overflow: "hidden",
      }}
    >
      <img
        src={images[0]}
        alt={label}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "opacity 0.3s ease",
        }}
        onMouseOver={(e) => {
          if (images[1]) e.currentTarget.src = images[1];
        }}
        onMouseOut={(e) => {
          e.currentTarget.src = images[0];
        }}
      />
    </div>

    {/* CONTENT */}
    <div style={{ padding: isMobile ? "20px" : "24px" }}>
      <div
        style={{
          fontSize: "10px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          marginBottom: "6px",
        }}
      >
        {product}
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "16px",
        }}
      >
        {detail}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
                }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: 900,
          }}
        >
          ${price}
        </div>

        <button
          type="button"
          onClick={() => setOpenChart(product)}
          style={{
            background: "transparent",
            border: `1px solid ${BORDER}`,
            color: "rgba(255,255,255,0.6)",
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          Size chart
        </button>
      </div>
    </div>
  </div>
))}
          </div>
        </div>

        {/* ── ORDER BUILDER ────────────────────────────────────────── */}
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            paddingTop: isMobile ? "48px" : "64px",
            marginBottom: isMobile ? "56px" : "72px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: LIME,
                  marginBottom: "8px",
                }}
              >
                Your Order
              </div>
              <div
                style={{
                  fontSize: isMobile ? "26px" : "32px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: FG,
                }}
              >
                Add Items
                <span style={{ color: LIME }}>.</span>
              </div>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.04em",
              }}
            >
              Each row = one garment
            </div>
          </div>

          {/* Desktop column headers */}
          {!isMobile && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "28px 170px 120px 110px 1fr 52px 40px",
                gap: "8px",
                padding: "0 0 8px",
                borderBottom: `1px solid rgba(255,255,255,0.12)`,
                marginBottom: "4px",
              }}
            >
              {["", "Product", "Fit", "Size", "Name (on garment)", "Price", ""].map(
                (h, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: FONT,
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      textAlign: i === 5 ? "right" : "left",
                    }}
                  >
                    {h}
                  </div>
                )
              )}
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

          {/* Add item */}
          <div style={{ marginTop: "16px" }}>
            <button
              type="button"
              onClick={addItem}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "42px",
                padding: "0 18px",
                background: "transparent",
                border: `1px solid ${BORDER}`,
                color: "rgba(255,255,255,0.55)",
                fontFamily: FONT,
                fontSize: "11px",
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
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              }}
            >
              <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
              Add item
            </button>
          </div>

          {/* Size chart note for desktop */}
          {!isMobile && (
            <div
              style={{
                marginTop: "16px",
                fontSize: "11px",
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.04em",
              }}
            >
              Size charts:{" "}
              <button
                type="button"
                onClick={() => setOpenChart("Tee")}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: FONT,
                  fontSize: "11px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Tee
              </button>
              {" · "}
              <button
                type="button"
                onClick={() => setOpenChart("Hoodie")}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: FONT,
                  fontSize: "11px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Hoodie
              </button>
            </div>
          )}
        </div>

        {/* ── CUSTOMER DETAILS ─────────────────────────────────────── */}
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            paddingTop: isMobile ? "48px" : "64px",
            marginBottom: isMobile ? "56px" : "72px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: LIME,
              marginBottom: "8px",
            }}
          >
            Your Details
          </div>
          <div
            style={{
              fontSize: isMobile ? "26px" : "32px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: FG,
              marginBottom: "28px",
            }}
          >
            Contact Info
            <span style={{ color: LIME }}>.</span>
          </div>

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
              />
            </div>
            <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
              <Label>Notes (optional)</Label>
              <textarea
                value={customer.notes}
                onChange={updateCustomer("notes")}
                placeholder="Any special instructions or questions"
                rows={3}
                style={{
                  ...inputBase,
                  height: "auto",
                  padding: "10px 12px",
                  resize: "vertical",
                  lineHeight: 1.55,
                }}
              />
            </div>
          </div>
        </div>

        {/* ── ORDER SUMMARY + CHECKOUT ──────────────────────────────── */}
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            paddingTop: isMobile ? "48px" : "64px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: LIME,
              marginBottom: "8px",
            }}
          >
            Review
          </div>
          <div
            style={{
              fontSize: isMobile ? "26px" : "32px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: FG,
              marginBottom: "28px",
            }}
          >
            Order Summary
            <span style={{ color: LIME }}>.</span>
          </div>

          {/* Summary items */}
          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              marginBottom: "16px",
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
                  padding: "14px 20px",
                  borderBottom:
                    i < items.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: "14px", fontWeight: 600, color: FG, lineHeight: 1.3 }}
                  >
                    Te Atatū {item.product}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.45)",
                      marginTop: "2px",
                    }}
                  >
                    {item.fit}
                    {item.size ? ` · ${item.size}` : ""}
                    {item.name ? ` · ${item.name}` : ""}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: FG,
                    whiteSpace: "nowrap",
                  }}
                >
                  ${item.product === "Tee" ? TEE_PRICE : HOODIE_PRICE}
                </div>
              </div>
            ))}

            {/* Total row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
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
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Total incl. GST
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "20px",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: FG,
                }}
              >
                ${totalNZD} NZD
              </div>
            </div>
          </div>

          {/* Delivery note */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              border: `1px solid rgba(184,244,0,0.18)`,
              background: "rgba(184,244,0,0.04)",
              marginBottom: "32px",
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
                fontSize: "12px",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              All orders will be delivered to the club · {DELIVERY_DATE}
            </span>
          </div>

          {/* Error message */}
          {checkoutState === "error" && errorMsg && (
            <div
              role="alert"
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                border: "1px solid rgba(255,80,80,0.3)",
                background: "rgba(255,80,80,0.06)",
                fontFamily: FONT,
                fontSize: "13px",
                color: "#ff8b6b",
                maxWidth: "640px",
                letterSpacing: "0.02em",
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
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.38)",
                padding: "16px 0",
              }}
            >
              Orders are closed.
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutState === "loading"}
              style={{
                height: "56px",
                padding: "0 40px",
                background: checkoutState === "loading" ? "rgba(184,244,0,0.6)" : LIME,
                color: BG,
                fontFamily: FONT,
                fontSize: "13px",
                fontWeight: 900,
                letterSpacing: "0.1em",
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
              {checkoutState === "loading" ? "Redirecting…" : `Pay Now — $${totalNZD} NZD →`}
            </button>
          )}

          <div
            style={{
              marginTop: "14px",
              fontFamily: FONT,
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.06em",
              maxWidth: "400px",
            }}
          >
            You'll be taken to Stripe's secure checkout. No card details are stored by us.
          </div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: "1px",
        height: "36px",
        background: "rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}
    />
  );
}
