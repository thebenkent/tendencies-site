import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.website) {
      return NextResponse.json({
        ok: true,
        message: "Brief submitted successfully.",
      });
    }

    const requiredFields = ["clubName", "contactName", "email", "notes"];
    const missing = requiredFields.filter((field) => {
      const value = body[field];
      return !value || String(value).trim() === "";
    });

    if (missing.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const {
      styleId,
      source,
      selectedStyle,
      sport,
      clubName,
      teamName,
      quantity,
      timeline,
      contactName,
      email,
      phone,
      notes,
    } = body ?? {};

    const to = process.env.ENQUIRY_TO_EMAIL;
    const from = process.env.ENQUIRY_FROM_EMAIL;
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!to || !from || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          message: "Email environment variables are not configured.",
        },
        { status: 500 }
      );
    }

    const subject = `[Teamwear] ${clubName}${sport ? ` — ${sport}` : ""}`;

    const internalHtml = `
      <div style="background:#080808;padding:40px 20px;font-family:Helvetica,Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#0f0f0f;border:1px solid rgba(255,255,255,0.08);padding:28px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#b8f400;margin-bottom:16px;">
            Teamwear Brief
          </div>

          <h2 style="font-size:28px;line-height:1.1;margin:0 0 20px 0;color:#f5f5f0;">
            ${escapeHtml(clubName || "New Submission")}
          </h2>

          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;margin-top:16px;">
            ${row("Sport", sport)}
            ${row("Selected Style", selectedStyle)}
            ${row("Style ID", styleId)}
            ${row("Source", source)}
            ${row("Team / Group", teamName)}
            ${row("Quantity", quantity)}
            ${row("Need By", timeline)}
          </div>

          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;margin-top:20px;">
            ${row("Contact", contactName)}
            ${row("Email", email)}
            ${row("Phone", phone)}
          </div>

          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;margin-top:20px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:rgba(255,255,255,0.5);margin-bottom:10px;">
              Brief Notes
            </div>

            <div style="white-space:pre-wrap;background:#111;border:1px solid rgba(255,255,255,0.1);padding:14px;color:#f5f5f0;font-size:14px;line-height:1.6;">
              ${escapeHtml(notes || "")}
            </div>
          </div>
        </div>
      </div>
    `;

    const internalText = [
      "New Teamwear Brief",
      "",
      `Club / School: ${clubName || "-"}`,
      `Team / Group: ${teamName || "-"}`,
      `Sport: ${sport || "-"}`,
      `Selected Style: ${selectedStyle || "-"}`,
      `Style ID: ${styleId || "-"}`,
      `Source: ${source || "-"}`,
      `Estimated Quantity: ${quantity || "-"}`,
      `Need By: ${timeline || "-"}`,
      `Contact Name: ${contactName || "-"}`,
      `Email: ${email || "-"}`,
      `Phone: ${phone || "-"}`,
      "",
      "Brief Notes:",
      notes || "",
    ].join("\n");

    await resend.emails.send({
      from,
      to,
      replyTo: email || undefined,
      subject,
      html: internalHtml,
      text: internalText,
    });

    if (email) {
      try {
        await resend.emails.send({
          from,
          to: email,
          subject: "We’ve received your teamwear brief",
          html: `
            <div style="background:#080808;padding:40px 20px;font-family:Helvetica,Arial,sans-serif;">
              <div style="max-width:600px;margin:0 auto;background:#0f0f0f;border:1px solid rgba(255,255,255,0.08);padding:28px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#b8f400;margin-bottom:16px;">
                  Tendencies · Teamwear
                </div>

                <h2 style="font-size:28px;line-height:1.1;margin:0 0 20px 0;color:#f5f5f0;">
                  We’ve got your brief.
                </h2>

                <p style="font-size:14px;line-height:1.7;color:rgba(255,255,255,0.72);margin:0 0 16px 0;">
                  Thanks ${escapeHtml(contactName || "")} — we’ve received your teamwear brief and will review it properly.
                </p>

                <p style="font-size:14px;line-height:1.7;color:rgba(255,255,255,0.72);margin:0 0 16px 0;">
                  We’ll come back with direction, pricing, and next steps within the week.
                </p>

                <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;margin-top:20px;">
                  ${row("Club / School", clubName)}
                  ${row("Sport", sport)}
                  ${row("Selected Style", selectedStyle)}
                  ${row("Team / Group", teamName)}
                  ${row("Quantity", quantity)}
                  ${row("Need By", timeline)}
                </div>

                <div style="margin-top:24px;">
                  <a
                    href="https://tendencies.co.nz/teamwear"
                    style="display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 20px;background:#b8f400;color:#080808;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;"
                  >
                    View Teamwear
                  </a>
                </div>
              </div>
            </div>
          `,
          text: [
            "We’ve received your teamwear brief",
            "",
            `Thanks ${contactName || ""} — we’ve received your teamwear brief.`,
            "We’ll come back with direction, pricing, and next steps within the week.",
            "",
            `Club / School: ${clubName || "-"}`,
            `Sport: ${sport || "-"}`,
            `Selected Style: ${selectedStyle || "-"}`,
            `Team / Group: ${teamName || "-"}`,
            `Quantity: ${quantity || "-"}`,
            `Need By: ${timeline || "-"}`,
          ].join("\n"),
        });
      } catch (error) {
        console.error("Customer auto-reply failed:", error);
      }
    }

    try {
      if (sheetsWebhookUrl) {
        await fetch(sheetsWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            styleId,
            source,
            selectedStyle,
            sport,
            clubName,
            teamName,
            quantity,
            timeline,
            contactName,
            email,
            phone,
            notes,
          }),
        });
      }
    } catch (error) {
      console.error("Google Sheets webhook failed:", error);
    }

    return NextResponse.json({
      ok: true,
      message: "Brief submitted successfully.",
    });
  } catch (error) {
    console.error("Teamwear brief email error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to send teamwear brief.",
      },
      { status: 500 }
    );
  }
}

function row(label: string, value?: string) {
  if (!value) return "";

  return `
    <div style="display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
      <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.5);">
        ${label}
      </div>
      <div style="font-size:13px;color:#f5f5f0;text-align:right;">
        ${escapeHtml(value)}
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}