import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      company,
      need,
      quantity,
      timeline,
      budget,
      details,
      product,
    } = body ?? {};

    if (!name || !email || !details) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const to = process.env.ENQUIRY_TO_EMAIL;
    const from = process.env.ENQUIRY_FROM_EMAIL;

    if (!to || !from || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email environment variables are not configured." },
        { status: 500 }
      );
    }

    const subject = `New Project Enquiry — ${name}${company ? ` (${company})` : ""}`;

    const html = `
      <div style="font-family: Helvetica, Arial, sans-serif; color: #111;">
        <h2>New Start a Project enquiry</h2>
       <p><strong>Product:</strong> ${escapeHtml(product || "-")}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company / School / Club:</strong> ${escapeHtml(company || "-")}</p>
        <p><strong>Need:</strong> ${escapeHtml(need || "-")}</p>
        <p><strong>Approx Quantity:</strong> ${escapeHtml(quantity || "-")}</p>
        <p><strong>Timeline / Deadline:</strong> ${escapeHtml(timeline || "-")}</p>
        <p><strong>Budget Range:</strong> ${escapeHtml(budget || "-")}</p>
        <p><strong>Project Details:</strong></p>
        <div style="white-space: pre-wrap; border: 1px solid #ddd; padding: 12px; border-radius: 8px;">
          ${escapeHtml(details)}
        </div>
      </div>
    `;

    const text = [
      "New Start a Project enquiry",
      "",
      `Product: ${product || "-"}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Company / School / Club: ${company || "-"}`,
      `Need: ${need || "-"}`,
      `Approx Quantity: ${quantity || "-"}`,
      `Timeline / Deadline: ${timeline || "-"}`,
      `Budget Range: ${budget || "-"}`,
      "",
      "Project Details:",
      details,
    ].join("\n");

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      html,
      text,
    });
try {
  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
        name,
        email,
        company,
        need,
        quantity,
        timeline,
        budget,
        details,
      }),
    });
  }
} catch (error) {
  console.error("Google Sheets webhook failed:", error);
}
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Enquiry email error:", error);
    return NextResponse.json(
      { error: "Failed to send enquiry." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}