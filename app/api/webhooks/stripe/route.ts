import { NextResponse } from "next/server";

// Retired: this was the Te Atatū Netball order webhook. That store is closed,
// and because it didn't filter by store it was emailing "Te Atatū — Order
// Confirmed" to Mates in Motors buyers. Still acknowledge events with 200 so
// Stripe doesn't retry or flag the endpoint until it's removed in the dashboard.
// MIM orders are handled by /api/webhooks/mates-in-motors/stripe.
export async function POST() {
  return NextResponse.json({ received: true });
}
