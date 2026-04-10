"use server";

import { resend } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

const FROM_EMAIL = "Purrfect Sitters <noreply@purrfectsitters.com>";

export async function sendBookingConfirmation(bookingId: string) {
  const supabase = createAdminClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(*),
      customer:customer_profiles!bookings_customer_id_fkey(*),
      booking_cats(*, cat:cats(*))
    `
    )
    .eq("id", bookingId)
    .single();

  if (!booking || !booking.customer) return;

  // Get customer email from auth
  const { data: authUser } = await supabase.auth.admin.getUserById(
    booking.customer.user_id
  );

  if (!authUser?.user?.email) return;

  const catNames =
    booking.booking_cats
      ?.map((bc: { cat: { name: string } }) => bc.cat?.name)
      .filter(Boolean)
      .join(" & ") || "your cats";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: authUser.user.email,
      subject: `Booking Confirmed - ${booking.service?.name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #8B3A2F; font-size: 24px;">Booking Confirmed!</h1>
          <p>Hello ${booking.customer.full_name},</p>
          <p>Your booking has been confirmed. Here are the details:</p>
          <div style="background: #FDE8E0; padding: 16px; border-radius: 12px; margin: 16px 0;">
            <p><strong>Service:</strong> ${booking.service?.name}</p>
            <p><strong>Date:</strong> ${formatDate(booking.scheduled_date)}</p>
            <p><strong>Time:</strong> ${formatTime(booking.scheduled_time)}</p>
            <p><strong>Cats:</strong> ${catNames}</p>
            <p><strong>Total:</strong> ${formatCurrency(booking.total_amount)}</p>
          </div>
          <p>We'll assign a sitter shortly and notify you.</p>
          <p style="color: #7A6860; font-size: 14px;">— The Purrfect Sitters Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send booking confirmation:", error);
  }
}

export async function sendPaymentReceipt(bookingId: string) {
  const supabase = createAdminClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(*),
      customer:customer_profiles!bookings_customer_id_fkey(*),
      payments(*)
    `
    )
    .eq("id", bookingId)
    .single();

  if (!booking || !booking.customer) return;

  const { data: authUser } = await supabase.auth.admin.getUserById(
    booking.customer.user_id
  );

  if (!authUser?.user?.email) return;

  const payment = booking.payments?.[0];
  if (!payment) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: authUser.user.email,
      subject: "Payment Receipt - Purrfect Sitters",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #8B3A2F; font-size: 24px;">Payment Receipt</h1>
          <p>Hello ${booking.customer.full_name},</p>
          <p>Your payment has been processed successfully.</p>
          <div style="background: #FDE8E0; padding: 16px; border-radius: 12px; margin: 16px 0;">
            <p><strong>Amount:</strong> ${formatCurrency(payment.amount)}</p>
            <p><strong>Service:</strong> ${booking.service?.name}</p>
            <p><strong>Date:</strong> ${formatDate(booking.scheduled_date)}</p>
            <p><strong>Status:</strong> Paid</p>
          </div>
          <p style="color: #7A6860; font-size: 14px;">— The Purrfect Sitters Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send payment receipt:", error);
  }
}

export async function sendBookingCompleted(bookingId: string) {
  const supabase = createAdminClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(*),
      customer:customer_profiles!bookings_customer_id_fkey(*),
      sitter:customer_profiles!bookings_sitter_id_fkey(*),
      booking_cats(*, cat:cats(*))
    `
    )
    .eq("id", bookingId)
    .single();

  if (!booking || !booking.customer) return;

  const { data: authUser } = await supabase.auth.admin.getUserById(
    booking.customer.user_id
  );

  if (!authUser?.user?.email) return;

  const catNames =
    booking.booking_cats
      ?.map((bc: { cat: { name: string } }) => bc.cat?.name)
      .filter(Boolean)
      .join(" & ") || "your cats";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: authUser.user.email,
      subject: `Visit Completed - ${catNames}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #8B3A2F; font-size: 24px;">Visit Completed!</h1>
          <p>Hello ${booking.customer.full_name},</p>
          <p>${booking.sitter?.full_name || "Your sitter"} has completed the visit with ${catNames}.</p>
          <p>Check your dashboard for visit notes and photos.</p>
          <p style="color: #7A6860; font-size: 14px;">— The Purrfect Sitters Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send booking completed email:", error);
  }
}
