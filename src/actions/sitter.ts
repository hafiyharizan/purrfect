"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResult, Booking, Profile } from "@/types";

export async function getAssignedBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) return [];

  const { data } = await supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(*),
      customer:customer_profiles!bookings_customer_id_fkey(*),
      booking_cats(*, cat:cats(*)),
      visit_updates(*)
    `
    )
    .eq("sitter_id", profile.id)
    .in("status", ["sitter_assigned", "in_progress", "confirmed"])
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  return (data as Booking[]) || [];
}

export async function getTodayBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) return [];

  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(*),
      customer:customer_profiles!bookings_customer_id_fkey(*),
      booking_cats(*, cat:cats(*))
    `
    )
    .eq("sitter_id", profile.id)
    .eq("scheduled_date", today)
    .in("status", ["sitter_assigned", "in_progress"])
    .order("scheduled_time", { ascending: true });

  return (data as Booking[]) || [];
}

export async function completeVisit(
  bookingId: string,
  notes: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Create visit update
  const { error: updateError } = await supabase
    .from("visit_updates")
    .insert({
      booking_id: bookingId,
      sitter_id: profile.id,
      notes,
    });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Update booking status
  const { error: bookingError } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId);

  if (bookingError) {
    return { success: false, error: bookingError.message };
  }

  // Send completion email
  try {
    const { sendBookingCompleted } = await import("@/actions/emails");
    await sendBookingCompleted(bookingId);
  } catch (err) {
    console.error("Failed to send completion email:", err);
  }

  revalidatePath("/sitter");
  return { success: true };
}

export async function checkInBooking(
  bookingId: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "in_progress" })
    .eq("id", bookingId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/sitter");
  return { success: true };
}
