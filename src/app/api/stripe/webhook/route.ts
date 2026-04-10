import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    const paymentId = session.metadata?.paymentId;

    if (bookingId) {
      // Update payment record
      if (paymentId) {
        await supabase
          .from("payments")
          .update({
            status: "succeeded",
            stripe_payment_intent:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id || null,
            paid_at: new Date().toISOString(),
          })
          .eq("id", paymentId);
      }

      // Update booking status
      await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);

      // Send confirmation email (async, don't block response)
      try {
        const { sendBookingConfirmation } = await import("@/actions/emails");
        await sendBookingConfirmation(bookingId);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    const paymentId = session.metadata?.paymentId;

    if (paymentId) {
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("id", paymentId);
    }

    if (bookingId) {
      await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
    }
  }

  return NextResponse.json({ received: true });
}
