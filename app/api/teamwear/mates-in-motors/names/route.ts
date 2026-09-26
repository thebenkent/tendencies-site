import { NextResponse } from "next/server";
import Stripe from "stripe";

const ALL_PRODUCTS = ["Staple Tee", "Maple Tee", "Staple Tank", "Maple Tank"];
const ALL_SIZES = ["XSM", "SML", "MED", "LRG", "XLG", "2XL", "3XL", "4XL", "5XL"];

const productOrder = Object.fromEntries(ALL_PRODUCTS.map((p, i) => [p, i]));
const sizeOrder = Object.fromEntries(ALL_SIZES.map((s, i) => [s, i]));

function csvCell(value: string): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("secret");

  if (!process.env.MIM_EXPORT_SECRET || token !== process.env.MIM_EXPORT_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const rows: string[][] = [];

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

      const summary = session.metadata?.order_summary || "";
      const customerName = session.metadata?.customer_name || "";

      for (const part of summary.split(";")) {
        if (!part.trim()) continue;
        const segments = part.split("/");
        if (segments.length >= 3) {
          rows.push([
            segments.slice(2).join("/").trim(), // name to print
            segments[0].trim(),                  // product
            segments[1].trim(),                  // size
            customerName,                        // customer
            session.id,                          // session ID
          ]);
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

  rows.sort((a, b) => {
    const pd = (productOrder[a[1]] ?? 99) - (productOrder[b[1]] ?? 99);
    if (pd !== 0) return pd;
    return (sizeOrder[a[2]] ?? 99) - (sizeOrder[b[2]] ?? 99);
  });

  const header = ["Name to print", "Product", "Size", "Customer", "Session ID"];
  const lines = [
    header.map(csvCell).join(","),
    ...rows.map((r) => r.map(csvCell).join(",")),
  ];

  const csv = lines.join("\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mim-names-${date}.csv"`,
    },
  });
}
