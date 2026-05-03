import { NextResponse } from "next/server";
import Stripe from "stripe";

const ORDER_CUTOFF = new Date("2026-05-10T21:00:00+12:00");
const TEE_PRICE_CENTS = 4200;
const HOODIE_PRICE_CENTS = 6000;

type OrderItem = {
  product: "Tee" | "Hoodie";
  fit: string;
  size: string;
  name: string;
};

type Customer = {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
};

const trunc = (s: string, max = 490) =>
  s.length > max ? s.slice(0, max) + "…" : s;

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    if (new Date() > ORDER_CUTOFF) {
      return NextResponse.json(
        { error: "Orders for this store are now closed." },
        { status: 410 }
      );
    }

    const body = await req.json();
    const { customer, items } = body as { customer: Customer; items: OrderItem[] };

    if (!customer?.fullName?.trim() || !customer?.email?.trim() || !customer?.phone?.trim()) {
      return NextResponse.json(
        { error: "Please fill in all required customer fields." },
        { status: 400 }
      );
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order." }, { status: 400 });
    }
    for (const item of items) {
      if (!item.product || !item.fit || !item.size || !item.name?.trim()) {
        return NextResponse.json(
          { error: "Each item must have a product, fit, size, and name." },
          { status: 400 }
        );
      }
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "nzd",
        product_data: {
          name: `Te Atatū ${item.product} — ${item.fit} / ${item.size} / ${item.name}`,
        },
        unit_amount: item.product === "Tee" ? TEE_PRICE_CENTS : HOODIE_PRICE_CENTS,
      },
      quantity: 1 as const,
    }));

    // Compact summary for metadata (500-char limit per value)
    const orderSummary = trunc(
      items.map((i) => `${i.product[0]}/${i.fit[0]}/${i.size}/${i.name}`).join(";")
    );

    const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.tendencies.co.nz";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "nzd",
      line_items: lineItems,
      customer_email: customer.email,
      metadata: {
        team: "Te Atatu",
        customer_name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        notes: trunc(customer.notes || ""),
        delivery_date: "2026-06-01",
        item_count: String(items.length),
        order_summary: orderSummary,
      },
      success_url: `${baseUrl}/teamwear/te-atatu/success`,
      cancel_url: `${baseUrl}/teamwear/te-atatu/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Te Atatū checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
