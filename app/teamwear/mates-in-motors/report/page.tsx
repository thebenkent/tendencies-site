import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import Stripe from "stripe";
import { PrintButton } from "./PrintButton";

export const dynamic = "force-dynamic";

const ORDER_CUTOFF = new Date("2026-10-11T21:00:00+13:00");

const BG = "#080808";
const FG = "#f5f5f0";
const LIME = "#b8f400";
const CARD_BG = "#0f0f0f";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_MID = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.4)";
const FONT = "Helvetica, Arial, sans-serif";

const ALL_PRODUCTS = ["Staple Tee", "Maple Tee", "Staple Tank", "Maple Tank"];
const ALL_SIZES = ["XSM", "SML", "MED", "LRG", "XLG", "2XL", "3XL", "4XL", "5XL"];
const TEE_PRODUCTS = new Set(["Staple Tee", "Maple Tee"]);

type ParsedItem = {
  product: string;
  size: string;
  name: string;
  customer: string;
  sessionId: string;
};

type ReportData = {
  totalOrders: number;
  totalGarments: number;
  revenueNZD: number;
  items: ParsedItem[];
};

async function fetchReportData(): Promise<ReportData> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const items: ParsedItem[] = [];
  let totalOrders = 0;
  let revenueNZD = 0;

  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const session of sessions.data) {
      if (
        session.metadata?.team !== "Mates in Motors" ||
        session.payment_status !== "paid"
      )
        continue;

      totalOrders++;
      revenueNZD += (session.amount_total || 0) / 100;

      const summary = session.metadata?.order_summary || "";
      const customerName = session.metadata?.customer_name || "";

      for (const part of summary.split(";")) {
        if (!part.trim()) continue;
        const segments = part.split("/");
        if (segments.length >= 3) {
          items.push({
            product: segments[0].trim(),
            size: segments[1].trim(),
            name: segments.slice(2).join("/").trim(),
            customer: customerName,
            sessionId: session.id,
          });
        }
      }
    }

    hasMore = sessions.has_more;
    if (sessions.data.length > 0) {
      startingAfter = sessions.data[sessions.data.length - 1].id;
    } else {
      break;
    }
  }

  return { totalOrders, totalGarments: items.length, revenueNZD, items };
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(n);
}

function getTimeLeft(): string {
  const now = new Date();
  if (now >= ORDER_CUTOFF) return "Orders closed";
  const diff = ORDER_CUTOFF.getTime() - now.getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  return `${days}d ${hours}h ${mins}m`;
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const { secret } = await searchParams;

  if (!process.env.MIM_EXPORT_SECRET || secret !== process.env.MIM_EXPORT_SECRET) {
    notFound();
  }

  const data = await fetchReportData();

  // Stock matrix: product → size → count
  const matrix: Record<string, Record<string, number>> = {};
  for (const p of ALL_PRODUCTS) {
    matrix[p] = {};
    for (const s of ALL_SIZES) matrix[p][s] = 0;
  }
  for (const item of data.items) {
    if (matrix[item.product] !== undefined) {
      matrix[item.product][item.size] = (matrix[item.product][item.size] || 0) + 1;
    }
  }

  const productTotals: Record<string, number> = {};
  for (const p of ALL_PRODUCTS) {
    productTotals[p] = ALL_SIZES.reduce((s, sz) => s + (matrix[p][sz] || 0), 0);
  }

  const sizeTotals: Record<string, number> = {};
  for (const sz of ALL_SIZES) {
    sizeTotals[sz] = ALL_PRODUCTS.reduce((s, p) => s + (matrix[p][sz] || 0), 0);
  }

  // Print requirements
  const teeCount = data.items.filter((i) => TEE_PRODUCTS.has(i.product)).length;
  const gangSheets = data.totalGarments > 0 ? Math.ceil(data.totalGarments / 15) : 0;
  const spareSlots = gangSheets * 15 - data.totalGarments;

  // Names list sorted by product order then size order
  const productOrder = Object.fromEntries(ALL_PRODUCTS.map((p, i) => [p, i]));
  const sizeOrder = Object.fromEntries(ALL_SIZES.map((s, i) => [s, i]));
  const sortedItems = [...data.items].sort((a, b) => {
    const pd = (productOrder[a.product] ?? 99) - (productOrder[b.product] ?? 99);
    if (pd !== 0) return pd;
    return (sizeOrder[a.size] ?? 99) - (sizeOrder[b.size] ?? 99);
  });

  const timeLeft = getTimeLeft();
  const encodedSecret = encodeURIComponent(secret!);

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          * { background: #fff !important; color: #000 !important; box-shadow: none !important; border-color: #ccc !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      <main
        style={{
          background: BG,
          color: FG,
          minHeight: "100vh",
          fontFamily: FONT,
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "48px",
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
                  marginBottom: "12px",
                }}
              >
                Mates in Motors · Orders Report
              </div>
              <h1
                style={{
                  fontSize: "clamp(36px, 5vw, 56px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Production
                <br />
                Summary<span style={{ color: LIME }}>.</span>
              </h1>
            </div>

            <div
              className="no-print"
              style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}
            >
              <PrintButton />
              <a
                href={`/api/teamwear/mates-in-motors/orders?secret=${encodedSecret}`}
                style={downloadLinkStyle()}
              >
                Orders CSV
              </a>
              <a
                href={`/api/teamwear/mates-in-motors/names?secret=${encodedSecret}`}
                style={downloadLinkStyle()}
              >
                Names CSV
              </a>
            </div>
          </div>

          {/* 1. Headline stats */}
          <Section title="Summary">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: "1px",
                background: BORDER,
              }}
            >
              {(
                [
                  ["Orders", String(data.totalOrders)],
                  ["Garments", String(data.totalGarments)],
                  ["Revenue incl. GST", formatCurrency(data.revenueNZD)],
                  ["Deadline", timeLeft],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} style={{ background: CARD_BG, padding: "20px 22px" }}>
                  <div style={statLabelStyle()}>{label}</div>
                  <div
                    style={{
                      fontSize: "26px",
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      color:
                        label === "Deadline" && timeLeft === "Orders closed"
                          ? MUTED
                          : FG,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 2. Stock to order */}
          <Section title="Stock to Order (AS Colour)">
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                  minWidth: "640px",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER_MID}` }}>
                    <th style={thStyle("left")}>Product</th>
                    {ALL_SIZES.map((s) => (
                      <th key={s} style={thStyle("center")}>
                        {s}
                      </th>
                    ))}
                    <th style={{ ...thStyle("center"), color: LIME }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_PRODUCTS.map((p) => (
                    <tr key={p} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: "10px 10px", fontWeight: 600 }}>{p}</td>
                      {ALL_SIZES.map((s) => {
                        const v = matrix[p][s] || 0;
                        return (
                          <td
                            key={s}
                            style={{
                              padding: "10px 10px",
                              textAlign: "center",
                              color: v > 0 ? FG : "rgba(255,255,255,0.18)",
                            }}
                          >
                            {v > 0 ? v : "—"}
                          </td>
                        );
                      })}
                      <td
                        style={{
                          padding: "10px 10px",
                          textAlign: "center",
                          fontWeight: 700,
                          color: LIME,
                        }}
                      >
                        {productTotals[p]}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: `1px solid ${BORDER_MID}` }}>
                    <td
                      style={{ padding: "10px 10px", fontWeight: 700, color: LIME }}
                    >
                      Total
                    </td>
                    {ALL_SIZES.map((s) => (
                      <td
                        key={s}
                        style={{
                          padding: "10px 10px",
                          textAlign: "center",
                          fontWeight: 700,
                          color: sizeTotals[s] > 0 ? LIME : "rgba(255,255,255,0.18)",
                        }}
                      >
                        {sizeTotals[s] > 0 ? sizeTotals[s] : "—"}
                      </td>
                    ))}
                    <td
                      style={{
                        padding: "10px 10px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "15px",
                        color: LIME,
                      }}
                    >
                      {data.totalGarments}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* 3. Print requirements */}
          <Section title="Print Requirements">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1px",
                background: BORDER,
                marginBottom: "16px",
              }}
            >
              {(
                [
                  ["Back graphic", data.totalGarments, "all garments"],
                  ["Chest logo", data.totalGarments, "all garments"],
                  ["Sleeve badge", teeCount, "tees only"],
                  ["MATES sleeve patch", teeCount, "tees only"],
                  ["Printed names", data.totalGarments, "all garments"],
                ] as [string, number, string][]
              ).map(([label, count, note]) => (
                <div key={label} style={{ background: CARD_BG, padding: "18px 20px" }}>
                  <div style={statLabelStyle()}>{label}</div>
                  <div
                    style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "4px" }}
                  >
                    {count}
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                    {note}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                padding: "20px 24px",
                display: "flex",
                gap: "48px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={statLabelStyle()}>Gang sheets</div>
                <div
                  style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-0.03em", color: LIME }}
                >
                  {gangSheets}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                  at 15 per sheet
                </div>
              </div>
              <div>
                <div style={statLabelStyle()}>Spare slots on last sheet</div>
                <div
                  style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-0.03em" }}
                >
                  {spareSlots}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                  {spareSlots === 0 ? "sheet is full" : `${spareSlots} unused`}
                </div>
              </div>
            </div>
          </Section>

          {/* 4. Names list — pressing checklist */}
          <Section title="Names List — Pressing Checklist" className="print-break">
            <table
              style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER_MID}` }}>
                  {(["#", "Name to print", "Product", "Size", "Customer"] as const).map(
                    (h) => (
                      <th key={h} style={thStyle(h === "#" ? "center" : "left")}>
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "32px 10px",
                        textAlign: "center",
                        color: MUTED,
                      }}
                    >
                      No paid orders yet.
                    </td>
                  </tr>
                ) : (
                  sortedItems.map((item, i) => (
                    <tr
                      key={`${item.sessionId}-${i}`}
                      style={{ borderBottom: `1px solid ${BORDER}` }}
                    >
                      <td
                        style={{
                          padding: "10px 10px",
                          textAlign: "center",
                          color: "rgba(255,255,255,0.25)",
                          width: "40px",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td style={{ padding: "10px 10px", fontWeight: 700, color: LIME }}>
                        {item.name}
                      </td>
                      <td style={{ padding: "10px 10px" }}>{item.product}</td>
                      <td style={{ padding: "10px 10px", fontWeight: 600 }}>{item.size}</td>
                      <td style={{ padding: "10px 10px", color: "rgba(255,255,255,0.5)" }}>
                        {item.customer}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Section>

        </div>
      </main>
    </>
  );
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className} style={{ marginBottom: "52px" }}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: MUTED,
          marginBottom: "14px",
          paddingBottom: "10px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function thStyle(align: "left" | "center"): CSSProperties {
  return {
    padding: "8px 10px",
    textAlign: align,
    color: MUTED,
    fontWeight: 600,
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
}

function statLabelStyle(): CSSProperties {
  return {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: "8px",
  };
}

function downloadLinkStyle(): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    height: "40px",
    padding: "0 18px",
    border: `1px solid ${BORDER_MID}`,
    color: FG,
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: FONT,
    borderRadius: "4px",
  };
}
