import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing webhook configuration." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await handleCompletedSession(session, stripe, resend);
    } catch (err) {
      // Log but return 200 — Stripe will not retry, preventing duplicate emails
      console.error("Error processing completed session:", err);
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCompletedSession(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  resend: Resend
) {
  const meta = session.metadata ?? {};
  const customerName = meta.customer_name ?? "Customer";
  const email = meta.email ?? session.customer_email ?? "";
  const phone = meta.phone ?? "";
  const notes = meta.notes ?? "";
  const stripeRef = session.id;
  const totalCents = session.amount_total ?? 0;
  const totalFormatted = `$${(totalCents / 100).toFixed(2)} NZD`;

  // Fetch all line items (handles orders > 10 items)
  const lineItemsPage = await stripe.checkout.sessions.listLineItems(
    session.id,
    { limit: 100 }
  );
  const lineItems = lineItemsPage.data;

  const fromEmail =
    process.env.ENQUIRY_FROM_EMAIL ?? "orders@tendencies.co.nz";

  const itemsRowsHtml = lineItems
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #e8e8e8;font-size:14px;line-height:1.4;">${esc(item.description ?? "")}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e8e8e8;font-size:14px;text-align:right;white-space:nowrap;">$${((item.amount_subtotal ?? 0) / 100).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const itemsText = lineItems
    .map(
      (item) =>
        `  ${item.description}  —  $${((item.amount_subtotal ?? 0) / 100).toFixed(2)}`
    )
    .join("\n");

  // ── Customer confirmation ──────────────────────────────────────────────
  if (email) {
    const customerHtml = `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;">
  <tr><td style="background:#080808;padding:32px 36px;">
    <p style="color:#b8f400;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;margin:0 0 10px;">Te Atatū Netball Club · Team Store</p>
    <h1 style="color:#f5f5f0;font-size:30px;font-weight:900;letter-spacing:-0.03em;text-transform:uppercase;margin:0;">Order Confirmed<span style="color:#b8f400;">.</span></h1>
  </td></tr>
  <tr><td style="padding:32px 36px;">
    <p style="font-size:15px;line-height:1.6;color:#333;margin:0 0 28px;">Hi ${esc(customerName)}, your order is confirmed and in the production queue.</p>
    <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#666;margin:0 0 12px;border-bottom:1px solid #eee;padding-bottom:8px;">Order Summary</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">${itemsRowsHtml}
      <tr style="background:#080808;">
        <td style="padding:12px 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#f5f5f0;">Total incl. GST</td>
        <td style="padding:12px 14px;font-size:13px;font-weight:700;text-align:right;color:#b8f400;">${esc(totalFormatted)}</td>
      </tr>
    </table>
    <div style="background:#f8f8f8;border-left:3px solid #b8f400;padding:16px 20px;margin-bottom:28px;">
      <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:#555;margin:0 0 4px;">Delivery</p>
      <p style="font-size:14px;color:#333;margin:0;">Your order will be delivered to the club on 1 June 2026.</p>
    </div>
    <p style="font-size:12px;color:#999;margin:0;">Questions? Reply to this email and someone will get back to you.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    const customerText = [
      "TE ATATŪ TEAM STORE — ORDER CONFIRMED",
      "",
      `Hi ${customerName}, your order is confirmed.`,
      "",
      "ORDER SUMMARY",
      "─────────────────────────────────────",
      itemsText,
      "─────────────────────────────────────",
      `Total incl. GST: ${totalFormatted}`,
      "",
      "DELIVERY",
      "Your order will be delivered to the club on 1 June 2026.",
      "",
      "Questions? Reply to this email.",
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: email,
      replyTo: fromEmail,
      subject: `Te Atatū Order Confirmed — ${customerName}`,
      html: customerHtml,
      text: customerText,
    });
  }

  // ── Google Sheets order log ────────────────────────────────────────────
  await logToSheets({
    orderId: stripeRef,
    customerName,
    email,
    phone,
    notes,
    lineItems,
  });

  // ── Internal production email ──────────────────────────────────────────
  const internalTo = process.env.TEAMWEAR_INTERNAL_EMAIL;
  if (internalTo) {
    const internalItemRows = lineItems
      .map(
        (item, i) => `
        <tr style="${i % 2 === 1 ? "background:#f9f9f9" : ""}">
          <td style="padding:10px 12px;font-size:12px;color:#999;">${i + 1}</td>
          <td style="padding:10px 12px;font-size:14px;">${esc(item.description ?? "")}</td>
          <td style="padding:10px 12px;font-size:14px;text-align:right;">$${((item.amount_subtotal ?? 0) / 100).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const internalHtml = `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table width="700" cellpadding="0" cellspacing="0" style="background:#fff;max-width:700px;">
  <tr><td style="background:#080808;padding:24px 32px;">
    <p style="color:#b8f400;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;margin:0 0 6px;">New Order · Te Atatū Netball</p>
    <h1 style="color:#f5f5f0;font-size:22px;font-weight:900;margin:0;">${esc(customerName)} · ${lineItems.length} item${lineItems.length !== 1 ? "s" : ""}</h1>
  </td></tr>
  <tr><td style="padding:28px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;font-size:14px;">
      <tr><td style="padding:8px 0;font-weight:700;width:140px;color:#555;">Customer</td><td style="padding:8px 0;">${esc(customerName)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#555;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(email)}" style="color:#080808;">${esc(email)}</a></td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#555;">Phone</td><td style="padding:8px 0;">${esc(phone)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#555;">Delivery</td><td style="padding:8px 0;">1 June 2026 (to club)</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#555;">Stripe Ref</td><td style="padding:8px 0;font-family:monospace;font-size:12px;">${esc(stripeRef)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#555;vertical-align:top;">Notes</td><td style="padding:8px 0;">${esc(notes || "—")}</td></tr>
    </table>
    <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#555;margin:0 0 12px;border-bottom:1px solid #eee;padding-bottom:8px;">Production Items</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <thead><tr style="background:#f0f0f0;">
        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#666;">#</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#666;">Item</th>
        <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;color:#666;">Price</th>
      </tr></thead>
      <tbody>${internalItemRows}</tbody>
      <tfoot><tr style="background:#080808;">
        <td colspan="2" style="padding:12px 14px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;color:#f5f5f0;">Total incl. GST</td>
        <td style="padding:12px 14px;font-size:13px;font-weight:900;text-align:right;color:#b8f400;">${esc(totalFormatted)}</td>
      </tr></tfoot>
    </table>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

    const internalText = [
      "NEW TE ATATŪ ORDER",
      "═══════════════════════════════════",
      `Customer:  ${customerName}`,
      `Email:     ${email}`,
      `Phone:     ${phone}`,
      `Stripe:    ${stripeRef}`,
      `Delivery:  1 June 2026 (to club)`,
      `Notes:     ${notes || "—"}`,
      "",
      "PRODUCTION ITEMS",
      "─────────────────────────────────────",
      itemsText,
      "─────────────────────────────────────",
      `Total incl. GST: ${totalFormatted}`,
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: internalTo,
      subject: `Te Atatū Order — ${customerName} (${lineItems.length} item${lineItems.length !== 1 ? "s" : ""})`,
      html: internalHtml,
      text: internalText,
    });
  }
}

// ── Google Sheets logger ─────────────────────────────────────────────────────
async function logToSheets({
  orderId,
  customerName,
  email,
  phone,
  notes,
  lineItems,
}: {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  notes: string;
  lineItems: Stripe.LineItem[];
}) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return;

  const items = lineItems.map((li) => {
    const desc = li.description ?? "";
    // Format: "Te Atatū Tee — Mens / M / John Smith"
    const [productPart = "", rest = ""] = desc.split(" — ");
    const product = productPart.replace("Te Atatū ", "").trim();
    const parts = rest.split(" / ");
    const fit = parts[0]?.trim() ?? "";
    const size = parts[1]?.trim() ?? "";
    const garmentName = parts.slice(2).join(" / ").trim();
    return { product, fit, size, garmentName };
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, customerName, email, phone, notes, items }),
    });
    if (!res.ok) {
      console.error("Sheets log failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Sheets log error:", err);
  }
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
