-- Migration 004: Seed default email templates (global, null tenant)
-- These serve as fallback templates for all tenants.

INSERT INTO merch_email_templates (tenant_id, type, subject, body_html, body_text, variables, enabled)
VALUES

-- ── Order confirmation (sent when customer places a reservation) ──
(
  NULL,
  'order_confirmation',
  'Your order is confirmed – {{campaign_name}}',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order Confirmed</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#111;">
  <h1 style="font-size:22px;margin-bottom:4px;">Order received!</h1>
  <p style="color:#555;margin-top:0;">Hi {{customer_first_name}}, thanks for your order.</p>

  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;font-size:13px;">Campaign</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">{{campaign_name}}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;font-size:13px;">Product</td><td style="padding:8px 0;border-bottom:1px solid #eee;">{{product_name}}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;font-size:13px;">Size</td><td style="padding:8px 0;border-bottom:1px solid #eee;">{{variant_size}}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;font-size:13px;">Qty</td><td style="padding:8px 0;border-bottom:1px solid #eee;">{{qty}}</td></tr>
    <tr><td style="padding:8px 0;color:#555;font-size:13px;">Status</td><td style="padding:8px 0;font-weight:600;">Reserved</td></tr>
  </table>

  <p style="color:#555;font-size:14px;">We''ll send you a payment link once the campaign closes and your order is confirmed.</p>
  <p style="margin-top:32px;color:#888;font-size:12px;">Tendencies &middot; tendencies.co.nz</p>
</body>
</html>',
  'Hi {{customer_first_name}}, your order for {{product_name}} ({{variant_size}}) in the {{campaign_name}} campaign has been received. We will contact you with a payment link once the campaign closes.',
  '{"customer_first_name":"string","campaign_name":"string","product_name":"string","variant_size":"string","qty":"number"}',
  true
),

-- ── Payment request (sent when admin generates a Stripe checkout link) ──
(
  NULL,
  'payment_request',
  'Payment required – {{campaign_name}}',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Payment Required</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#111;">
  <h1 style="font-size:22px;margin-bottom:4px;">Your order is ready for payment</h1>
  <p style="color:#555;margin-top:0;">Hi {{customer_first_name}},</p>
  <p style="color:#555;">Your order in the <strong>{{campaign_name}}</strong> campaign has been confirmed and is ready to pay.</p>

  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;font-size:13px;">Product</td><td style="padding:8px 0;border-bottom:1px solid #eee;">{{product_name}}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;font-size:13px;">Amount due</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">{{amount}}</td></tr>
  </table>

  <a href="{{payment_link}}" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;text-decoration:none;border-radius:4px;font-weight:600;margin:16px 0;">Pay now</a>

  <p style="color:#888;font-size:13px;margin-top:16px;">This payment link expires in 24 hours. If you have any questions reply to this email.</p>
  <p style="margin-top:32px;color:#888;font-size:12px;">Tendencies &middot; tendencies.co.nz</p>
</body>
</html>',
  'Hi {{customer_first_name}}, your order in the {{campaign_name}} campaign is ready for payment. Amount due: {{amount}}. Pay here: {{payment_link}}',
  '{"customer_first_name":"string","campaign_name":"string","product_name":"string","amount":"string","payment_link":"string"}',
  true
),

-- ── Payment received (sent by Stripe webhook on checkout.session.completed) ──
(
  NULL,
  'payment_received',
  'Payment received – thank you!',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Payment Received</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#111;">
  <h1 style="font-size:22px;margin-bottom:4px;">Payment received!</h1>
  <p style="color:#555;margin-top:0;">Hi {{customer_first_name}}, we''ve received your payment of <strong>{{amount}}</strong>. Thank you!</p>
  <p style="color:#555;font-size:14px;">We''ll be in touch when your order is ready. If you have any questions, reply to this email.</p>
  <p style="margin-top:32px;color:#888;font-size:12px;">Tendencies &middot; tendencies.co.nz</p>
</body>
</html>',
  'Hi {{customer_first_name}}, we have received your payment of {{amount}}. Thank you! We will be in touch when your order is ready.',
  '{"customer_first_name":"string","amount":"string","order_id":"string"}',
  true
),

-- ── Order completed (sent when order reaches completed state) ──
(
  NULL,
  'order_completed',
  'Your order is complete – {{campaign_name}}',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order Complete</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#111;">
  <h1 style="font-size:22px;margin-bottom:4px;">Your order is complete!</h1>
  <p style="color:#555;margin-top:0;">Hi {{customer_first_name}},</p>
  <p style="color:#555;">Great news — your order in the <strong>{{campaign_name}}</strong> campaign is complete and ready for collection or delivery.</p>
  <p style="color:#555;font-size:14px;">{{delivery_notes}}</p>
  <p style="margin-top:32px;color:#888;font-size:12px;">Tendencies &middot; tendencies.co.nz</p>
</body>
</html>',
  'Hi {{customer_first_name}}, your order in the {{campaign_name}} campaign is complete. {{delivery_notes}}',
  '{"customer_first_name":"string","campaign_name":"string","delivery_notes":"string"}',
  true
)

ON CONFLICT (tenant_id, type) DO NOTHING;
