import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

const INTERNAL_EMAIL =
  process.env.TEAMWEAR_INTERNAL_EMAIL || "ben@tendencies.co.nz";

const FROM_EMAIL =
  process.env.ENQUIRY_FROM_EMAIL || "orders@tendencies.co.nz";

function formatCurrency(amount?: number | null) {
  if (!amount) return "$0.00 NZD";
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(amount / 100);
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook verification failed:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata || {};
    const customerEmail = session.customer_email || metadata.email;
    const customerName = metadata.customer_name || "Customer";
    const phone = metadata.phone || "";
    const notes = metadata.notes || "";
    const orderSummary = metadata.order_summary || "";
    const itemCount = metadata.item_count || "";
    const total = formatCurrency(session.amount_total);

    const subject = "Te Atatū Netball — Order Confirmed";

    const customerHtml = `
      <div style="font-family: Helvetica, Arial, sans-serif; background:#080808; color:#f5f5f0; padding:32px;">
        <div style="max-width:640px; margin:0 auto;">
          <div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#b8f400; font-weight:700; margin-bottom:20px;">
            Te Atatū Netball Club · Team Store
          </div>

          <h1 style="font-size:42px; line-height:0.95; letter-spacing:-0.04em; text-transform:uppercase; margin:0 0 24px;">
            Order confirmed<span style="color:#b8f400;">.</span>
          </h1>

          <p style="font-size:15px; line-height:1.6; color:rgba(255,255,255,0.7); margin:0 0 24px;">
            Thanks ${customerName}, your teamwear order has been received and paid.
          </p>

          <div style="border:1px solid rgba(255,255,255,0.12); background:#0f0f0f; padding:20px; margin-bottom:24px;">
            <div style="font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.45); margin-bottom:10px;">
              Order details
            </div>
            <p style="font-size:14px; line-height:1.6; margin:0; color:#f5f5f0;">
              Items: ${itemCount}<br />
              Summary: ${orderSummary}<br />
              Total paid: ${total}
            </p>
          </div>

          <div style="border:1px solid rgba(184,244,0,0.25); background:rgba(184,244,0,0.06); padding:18px; margin-bottom:28px;">
            <strong style="color:#b8f400;">Delivery:</strong>
            <span style="color:rgba(255,255,255,0.72);"> All orders will be delivered to the club on 1 June 2026.</span>
          </div>

          <p style="font-size:13px; line-height:1.6; color:rgba(255,255,255,0.5); margin:0;">
            If anything looks wrong, reply to this email and we’ll help.
          </p>
        </div>
      </div>
    `;

    const internalHtml = `
      <div style="font-family: Helvetica, Arial, sans-serif; padding:24px;">
        <h2>New Te Atatū Teamwear Order</h2>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Item count:</strong> ${itemCount}</p>
        <p><strong>Order summary:</strong> ${orderSummary}</p>
        <p><strong>Notes:</strong> ${notes || "None"}</p>
        <p><strong>Stripe session:</strong> ${session.id}</p>
      </div>
    `;

    try {
      if (customerEmail) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: customerEmail,
          subject,
          html: customerHtml,
        });
      }

      await resend.emails.send({
        from: FROM_EMAIL,
        to: INTERNAL_EMAIL,
        subject: `New Te Atatū order — ${customerName}`,
        html: internalHtml,
      });

      console.log("ORDER EMAILS SENT", session.id);
    } catch (err) {
      console.error("Failed to send order emails:", err);
    }
  }

  return NextResponse.json({ received: true });
}