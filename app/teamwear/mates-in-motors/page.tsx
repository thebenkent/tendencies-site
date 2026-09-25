"use client";
import { useState, useEffect, useCallback } from "react";
import { sizesFor, guideFor, type ProductKey } from "@/lib/merch/mim-size-guides";

const BG = "#080808";
const FG = "#f5f5f0";
const LIME = "#b8f400";
const CARD_BG = "#0f0f0f";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_MID = "rgba(255,255,255,0.12)";
const FONT = "Helvetica, Arial, sans-serif";

// Sunday 11 October 2026, 9:00 pm NZDT
const ORDER_CUTOFF = new Date("2026-10-11T21:00:00+13:00");
const COLLECTION_DATE = "Wednesday 28 October 2026";

const TANK_PRICE = 39.0;
const TEE_PRICE = 45.0;

const PRODUCTS: Record<ProductKey, { label: string; price: number; front: string; back: string }> = {
  "staple-tee": {
    label: "Staple Tee",
    price: TEE_PRICE,
    front: "/teamwear/mim-tee-front-staple.png",
    back: "/teamwear/mim-tee-back-staple.png",
  },
  "maple-tee": {
    label: "Maple Tee",
    price: TEE_PRICE,
    front: "/teamwear/mim-tee-front-maple.png",
    back: "/teamwear/mim-tee-back-maple.png",
  },
  "staple-tank": {
    label: "Staple Tank",
    price: TANK_PRICE,
    front: "/teamwear/mim-tank-front-staple.png",
    back: "/teamwear/mim-tank-back-staple.png",
  },
  "maple-tank": {
    label: "Maple Tank",
    price: TANK_PRICE,
    front: "/teamwear/mim-tank-front-maple.png",
    back: "/teamwear/mim-tank-back-maple.png",
  },
};

type TimeLeft = { days: number; hours: number; mins: number; secs: number };

function calcTimeLeft(): TimeLeft {
  const diff = ORDER_CUTOFF.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
}

function formatDeadline(): string {
  return new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(ORDER_CUTOFF);
}

type OrderItem = { id: string; product: ProductKey; size: string; name: string };
type Customer = { fullName: string; email: string; phone: string; notes: string };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function SizeChartModal({ pkey, onClose }: { pkey: ProductKey; onClose: () => void }) {
  const guide = guideFor(pkey);
  const product = PRODUCTS[pkey];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111", border: `1px solid ${BORDER_MID}`,
          maxWidth: "480px", width: "100%", padding: "28px",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Size guide — {product.label}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: FG, fontSize: "20px", cursor: "pointer", padding: "0 4px", fontFamily: FONT, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: "0 0 18px" }}>
          Garment measurements (cm)
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER_MID}` }}>
              {["Size", "Body Width (cm)", "Body Length (cm)"].map((h) => (
                <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guide.chart.map(({ size, width, length }) => (
              <tr key={size} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td style={{ padding: "8px 8px", fontWeight: 700, color: LIME }}>{size}</td>
                <td style={{ padding: "8px 8px", color: "rgba(255,255,255,0.7)" }}>{width}</td>
                <td style={{ padding: "8px 8px", color: "rgba(255,255,255,0.7)" }}>{length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "14px", fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
          {guide.note}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ pkey, onAdd }: { pkey: ProductKey; onAdd: (item: Omit<OrderItem, "id">) => void }) {
  const p = PRODUCTS[pkey];
  const sizes = sizesFor(pkey);
  const [hovered, setHovered] = useState(false);
  const [size, setSize] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  function handleAdd() {
    if (!size) { setError("Select a size"); return; }
    if (!name.trim()) { setError("Enter the name to print"); return; }
    onAdd({ product: pkey, size, name: name.trim() });
    setSize("");
    setName("");
    setError("");
  }

  return (
    <>
      <div
        style={{
          background: CARD_BG,
          border: `1px solid ${BORDER}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image */}
        <div
          style={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden", cursor: "pointer" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={p.front}
            alt={`${p.label} front`}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "contain", transition: "opacity 0.35s",
              opacity: hovered ? 0 : 1, background: "#111",
            }}
          />
          <img
            src={p.back}
            alt={`${p.label} back`}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "contain", transition: "opacity 0.35s",
              opacity: hovered ? 1 : 0, background: "#111",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: "10px", right: "10px",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
              pointerEvents: "none",
            }}
          >
            {hovered ? "back" : "front"}
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" }}>
              {p.label}
            </div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: LIME }}>
              ${p.price.toFixed(2)}
            </div>
          </div>

          {/* Size selector */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                Size
              </div>
              <button
                type="button"
                onClick={() => setSizeChartOpen(true)}
                style={{
                  background: "none", border: "none", color: "rgba(184,244,0,0.75)",
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", fontFamily: FONT, cursor: "pointer",
                  padding: 0, textDecoration: "underline", textUnderlineOffset: "2px",
                }}
              >
                Size guide
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setSize(s); setError(""); }}
                  style={{
                    padding: "5px 10px", fontSize: "12px", fontWeight: 600,
                    fontFamily: FONT,
                    border: `1px solid ${size === s ? LIME : BORDER_MID}`,
                    background: size === s ? LIME : "transparent",
                    color: size === s ? "#000" : FG,
                    cursor: "pointer", borderRadius: "4px", transition: "all 0.15s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Name to print */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
              Name to print
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Johnson"
              maxLength={40}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "10px 12px", fontSize: "14px",
                background: "#161616", border: `1px solid ${BORDER_MID}`,
                color: FG, fontFamily: FONT, borderRadius: "4px", outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: "12px", color: "#ff5555", marginBottom: "10px" }}>{error}</div>
          )}

          <button
            type="button"
            onClick={handleAdd}
            style={{
              width: "100%", padding: "12px", fontSize: "12px",
              fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: FONT, background: LIME, color: "#000",
              border: "none", cursor: "pointer", borderRadius: "4px",
              transition: "opacity 0.15s",
            }}
          >
            Add to order
          </button>
        </div>
      </div>

      {sizeChartOpen && <SizeChartModal pkey={pkey} onClose={() => setSizeChartOpen(false)} />}
    </>
  );
}

export default function MatesInMotorsPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft);
  const [orderClosed, setOrderClosed] = useState(() => Date.now() >= ORDER_CUTOFF.getTime());
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({ fullName: "", email: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [deadlineLabel] = useState(formatDeadline);

  useEffect(() => {
    if (orderClosed) return;
    const id = setInterval(() => {
      const t = calcTimeLeft();
      setTimeLeft(t);
      if (t.days === 0 && t.hours === 0 && t.mins === 0 && t.secs === 0) {
        setOrderClosed(true);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [orderClosed]);

  const addItem = useCallback((item: Omit<OrderItem, "id">) => {
    setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const orderTotal = items.reduce((sum, i) => sum + PRODUCTS[i.product].price, 0);

  async function handleCheckout() {
    setCheckoutError("");
    if (items.length === 0) { setCheckoutError("Add at least one item to your order."); return; }
    if (!customer.fullName.trim()) { setCheckoutError("Enter your full name."); return; }
    if (!customer.email.trim()) { setCheckoutError("Enter your email address."); return; }
    if (!customer.phone.trim()) { setCheckoutError("Enter your phone number."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/teamwear/mates-in-motors/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: items.map((i) => ({ product: i.product, size: i.size, name: i.name })),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setCheckoutError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (orderClosed) {
    return (
      <main style={{ background: BG, color: FG, minHeight: "100vh", display: "grid", placeItems: "center", padding: "80px 24px", fontFamily: FONT }}>
        <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: LIME, marginBottom: "20px" }}>
            Mates in Motors · Team Store
          </div>
          <h1 style={{ fontSize: "clamp(48px,10vw,88px)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 28px" }}>
            Orders<br />Closed<span style={{ color: LIME }}>.</span>
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.65, color: "rgba(255,255,255,0.65)", margin: 0 }}>
            The order window has closed. Collection is on {COLLECTION_DATE}.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: BG, color: FG, minHeight: "100vh", fontFamily: FONT }}>
      {/* Header */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 24px 0" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: LIME, marginBottom: "20px" }}>
          Mates in Motors · Team Store
        </div>
        <h1 style={{ fontSize: "clamp(48px,9vw,96px)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.88, textTransform: "uppercase", margin: "0 0 32px" }}>
          Team<br />Gear<span style={{ color: LIME }}>.</span>
        </h1>
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.65)", maxWidth: "520px", margin: "0 0 40px" }}>
          Choose your style, pick your size, and enter the name to be printed. Secure checkout via Stripe. Collection at Mates in Motors on {COLLECTION_DATE} — no freight.
        </p>

        {/* Countdown */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, padding: "24px 28px", marginBottom: "48px", display: "inline-flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
            Order deadline
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "baseline" }}>
            {([["days", timeLeft.days], ["hrs", timeLeft.hours], ["min", timeLeft.mins], ["sec", timeLeft.secs]] as const).map(([label, val]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: LIME }}>
                  {pad(Number(val))}
                </div>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
            Closes {deadlineLabel}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", background: BORDER }}>
          {(Object.keys(PRODUCTS) as ProductKey[]).map((key) => (
            <div key={key} style={{ background: BG }}>
              <ProductCard pkey={key} onAdd={addItem} />
            </div>
          ))}
        </div>
      </div>

      {/* Order summary + checkout */}
      {items.length > 0 && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER_MID}` }}>
            <div style={{ padding: "24px 28px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                Your order ({items.length} {items.length === 1 ? "item" : "items"})
              </div>
            </div>
            <div>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: `1px solid ${BORDER}`, gap: "12px" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>{PRODUCTS[item.product].label}</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", marginLeft: "10px" }}>
                      {item.size} · {item.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                    <span style={{ fontSize: "14px", fontWeight: 700 }}>${PRODUCTS[item.product].price.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "18px", lineHeight: 1, padding: 0, fontFamily: FONT }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderBottom: `1px solid ${BORDER_MID}` }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>Total incl. GST</span>
                <span style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.02em" }}>${orderTotal.toFixed(2)} NZD</span>
              </div>
            </div>

            {/* Customer details */}
            <div style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "18px" }}>
                Your details
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px", marginBottom: "12px" }}>
                {([
                  { key: "fullName", label: "Full name", type: "text", placeholder: "Jane Smith" },
                  { key: "email", label: "Email", type: "email", placeholder: "jane@example.com" },
                  { key: "phone", label: "Phone", type: "tel", placeholder: "+64 21 000 0000" },
                ] as const).map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                      {label} <span style={{ color: LIME }}>*</span>
                    </label>
                    <input
                      type={type}
                      value={customer[key]}
                      onChange={(e) => setCustomer((c) => ({ ...c, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{
                        width: "100%", boxSizing: "border-box",
                        padding: "10px 12px", fontSize: "14px",
                        background: "#161616", border: `1px solid ${BORDER_MID}`,
                        color: FG, fontFamily: FONT, borderRadius: "4px", outline: "none",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                  Notes (optional)
                </label>
                <textarea
                  value={customer.notes}
                  onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                  rows={2}
                  placeholder="Any special requests or questions"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "10px 12px", fontSize: "14px",
                    background: "#161616", border: `1px solid ${BORDER_MID}`,
                    color: FG, fontFamily: FONT, borderRadius: "4px", outline: "none", resize: "vertical",
                  }}
                />
              </div>

              {checkoutError && (
                <div style={{ fontSize: "13px", color: "#ff5555", marginBottom: "14px", padding: "12px", background: "rgba(255,85,85,0.08)", border: "1px solid rgba(255,85,85,0.2)" }}>
                  {checkoutError}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{
                    padding: "14px 32px", fontSize: "13px",
                    fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    fontFamily: FONT, background: loading ? "rgba(184,244,0,0.5)" : LIME, color: "#000",
                    border: "none", cursor: loading ? "not-allowed" : "pointer", borderRadius: "4px",
                  }}
                >
                  {loading ? "Redirecting…" : `Pay $${orderTotal.toFixed(2)} NZD`}
                </button>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                  Secure checkout via Stripe.<br />Collection {COLLECTION_DATE} — no freight.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
