import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sizesFor } from "@/lib/merch/mim-size-guides";

// Sunday 11 October 2026, 9:00 pm NZDT — must match page.tsx
const ORDER_CUTOFF = new Date("2026-10-11T21:00:00+13:00");

// Prices are authoritative here — never trust values from the browser
type ProductKey = "staple-tee" | "maple-tee" | "staple-tank" | "maple-tank";

const PRICES_CENTS: Record<ProductKey, number> = {
  "staple-tee":  4900,
  "maple-tee":   4900,
  "staple-tank": 3900,
  "maple-tank":  3900,
};

const PRODUCT_LABELS: Record<ProductKey, string> = {
  "staple-tee":  "Staple Tee",
  "maple-tee":   "Maple Tee",
  "staple-tank": "Staple Tank",
  "maple-tank":  "Maple Tank",
};

const VALID_PRODUCTS = new Set<ProductKey>(["staple-tee", "maple-tee", "staple-tank", "maple-tank"]);

type OrderItem = { product: ProductKey; size: string; name: string };
type Customer = { fullName: string; email: string; phone: string; notes: string };

const trunc = (s: string, max = 490) => (s.length > max ? s.slice(0, max) + "…" : s);

function getBaseUrl(req: Request): string {
  // Prefer the forwarded host so preview deploys redirect back to themselves
  const forwarded = req.headers.get("x-forwarded-host");
  if (forwarded) {
    const proto = req.headers.get("x-forwarded-proto") || "https";
    return `${proto}://${forwarded}`;
  }
  const origin = new URL(req.url).origin;
  if (origin && origin !== "null") return origin;
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.tendencies.co.nz";
}

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    if (new Date() > ORDER_CUTOFF) {
      return NextResponse.json({ error: "Orders for this store are now closed." }, { status: 410 });
    }

    const body = await req.json();
    const { customer, items } = body as { customer: Customer; items: OrderItem[] };

    if (!customer?.fullName?.trim() || !customer?.email?.trim() || !customer?.phone?.trim()) {
      return NextResponse.json({ error: "Please fill in all required customer fields." }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order." }, { status: 400 });
    }

    for (const item of items) {
      if (!VALID_PRODUCTS.has(item.product)) {
        return NextResponse.json({ error: `Unknown product: ${item.product}` }, { status: 400 });
      }
      const allowed = sizesFor(item.product) as string[];
      if (!allowed.includes(item.size)) {
        return NextResponse.json(
          { error: `Size ${item.size} is not available for ${PRODUCT_LABELS[item.product]}.` },
          { status: 400 }
        );
      }
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "nzd",
        product_data: {
          name: `MIM ${PRODUCT_LABELS[item.product]} — ${item.size} / ${item.name.trim()}`,
        },
        unit_amount: PRICES_CENTS[item.product],
      },
      quantity: 1 as const,
    }));

    const orderSummary = trunc(
      items.map((i) => `${PRODUCT_LABELS[i.product]}/${i.size}/${i.name.trim()}`).join(";")
    );

    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "nzd",
      line_items: lineItems,
      customer_email: customer.email,
      metadata: {
        team: "Mates in Motors",
        customer_name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        notes: trunc(customer.notes || ""),
        collection_date: "2026-10-28",
        item_count: String(items.length),
        order_summary: orderSummary,
      },
      success_url: `${baseUrl}/teamwear/mates-in-motors/success`,
      cancel_url: `${baseUrl}/teamwear/mates-in-motors/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("MIM checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
