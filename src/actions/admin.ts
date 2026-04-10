"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResult, Booking, Profile } from "@/types";

export async function getAdminStats() {
  const supabase = await createClient();

  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const { count: activeSitters } = await supabase
    .from("customer_profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "sitter");

  const { count: pendingBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .in("status", ["confirmed", "pending_payment"]);

  const { count: completedBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  const satisfaction =
    totalBookings && totalBookings > 0
      ? Math.round(((completedBookings || 0) / totalBookings) * 100)
      : 98;

  return {
    totalVisits: totalBookings || 0,
    activeSitters: activeSitters || 0,
    pendingPurrs: pendingBookings || 0,
    happyClients: satisfaction,
  };
}

export async function getAllBookings(
  status?: string
): Promise<Booking[]> {
  const supabase = await createClient();

  let query = supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(*),
      customer:customer_profiles!bookings_customer_id_fkey(*),
      sitter:customer_profiles!bookings_sitter_id_fkey(*),
      booking_cats(*, cat:cats(*)),
      payments(*)
    `
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return (data as Booking[]) || [];
}

export async function getSitters(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("customer_profiles")
    .select("*")
    .eq("role", "sitter")
    .order("full_name");

  return (data as Profile[]) || [];
}

export async function assignSitter(
  bookingId: string,
  sitterId: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ sitter_id: sitterId, status: "sitter_assigned" })
    .eq("id", bookingId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath(`/bookings/${bookingId}`);
  return { success: true };
}

export async function updateBookingStatus(
  bookingId: string,
  status: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath(`/bookings/${bookingId}`);
  return { success: true };
}
