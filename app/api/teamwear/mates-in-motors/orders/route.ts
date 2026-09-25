import { NextResponse } from "next/server";
import Stripe from "stripe";

// Simple token auth — set MIM_EXPORT_SECRET in Vercel env vars
const EXPORT_SECRET = process.env.MIM_EXPORT_SECRET;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("secret");

  if (!EXPORT_SECRET || token !== EXPORT_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const rows: string[][] = [
    ["Session ID", "Date", "Customer", "Email", "Phone", "Item count", "Total NZD", "Order summary", "Notes"],
  ];

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
      ) {
        continue;
      }

      const created = new Date(session.created * 1000).toISOString();
      const total = session.amount_total ? (session.amount_total / 100).toFixed(2) : "";
      const m = session.metadata || {};

      rows.push([
        session.id,
        created,
        m.customer_name || "",
        m.email || session.customer_email || "",
        m.phone || "",
        m.item_count || "",
        total,
        m.order_summary || "",
        m.notes || "",
      ]);
    }

    hasMore = sessions.has_more;
    if (sessions.data.length > 0) {
      startingAfter = sessions.data[sessions.data.length - 1].id;
    } else {
      break;
    }
  }

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mim-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
