"use server";

import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult, Booking, Service, ServiceAddon } from "@/types";

const CreateBookingSchema = z.object({
  serviceId: z.string().uuid(),
  scheduledDate: z.string().min(1),
  scheduledTime: z.string().min(1),
  endDate: z.string().nullable().optional(),
  catIds: z.array(z.string().uuid()).min(1, "Select at least one cat"),
  addonIds: z.array(z.string().uuid()).optional(),
  notes: z.string().optional(),
});

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (data as Service[]) || [];
}

export async function getServiceAddons(
  serviceId: string
): Promise<ServiceAddon[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_addons")
    .select("*")
    .eq("service_id", serviceId)
    .eq("is_active", true);

  return (data as ServiceAddon[]) || [];
}

export async function createBooking(input: {
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  endDate?: string | null;
  catIds: string[];
  addonIds?: string[];
  notes?: string;
}): Promise<ActionResult<{ checkoutUrl: string }>> {
  const parsed = CreateBookingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

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

  // Fetch service
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", parsed.data.serviceId)
    .single();

  if (!service) {
    return { success: false, error: "Service not found" };
  }

  const typedService = service as Service;

  // Calculate total
  let total = typedService.base_price;
  total += typedService.per_cat_price * parsed.data.catIds.length;

  // Fetch selected addons
  let addons: ServiceAddon[] = [];
  if (parsed.data.addonIds && parsed.data.addonIds.length > 0) {
    const { data: addonData } = await supabase
      .from("service_addons")
      .select("*")
      .in("id", parsed.data.addonIds);

    addons = (addonData as ServiceAddon[]) || [];
    total += addons.reduce((sum, addon) => sum + addon.price, 0);
  }

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      customer_id: profile.id,
      service_id: parsed.data.serviceId,
      status: "pending_payment",
      scheduled_date: parsed.data.scheduledDate,
      scheduled_time: parsed.data.scheduledTime,
      end_date: parsed.data.endDate || null,
      notes: parsed.data.notes || null,
      total_amount: total,
    })
    .select()
    .single();

  if (bookingError || !booking) {
    return {
      success: false,
      error: bookingError?.message || "Failed to create booking",
    };
  }

  // Insert booking_cats
  const catRows = parsed.data.catIds.map((catId) => ({
    booking_id: booking.id,
    cat_id: catId,
  }));

  await supabase.from("booking_cats").insert(catRows);

  // Insert booking_addons
  if (addons.length > 0) {
    const addonRows = addons.map((addon) => ({
      booking_id: booking.id,
      service_addon_id: addon.id,
      quantity: 1,
      unit_price: addon.price,
    }));

    await supabase.from("booking_addons").insert(addonRows);
  }

  // Create payment record
  const { data: payment } = await supabase
    .from("payments")
    .insert({
      booking_id: booking.id,
      amount: total,
      status: "pending",
    })
    .select()
    .single();

  // Create Stripe checkout session
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: typedService.name,
              description: `Cat sitting service - ${parsed.data.catIds.length} cat(s)`,
            },
            unit_amount: total,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/bookings/${booking.id}?payment=success`,
      cancel_url: `${appUrl}/bookings/new?cancelled=true`,
      metadata: {
        bookingId: booking.id,
        paymentId: payment?.id || "",
      },
    });

    // Update payment with stripe session id
    if (payment) {
      await supabase
        .from("payments")
        .update({ stripe_session_id: session.id })
        .eq("id", payment.id);
    }

    return {
      success: true,
      data: { checkoutUrl: session.url! },
    };
  } catch (err) {
    return {
      success: false,
      error: "Failed to create checkout session",
    };
  }
}

export async function getBookings(
  status?: string
): Promise<Booking[]> {
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

  let query = supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(*),
      sitter:customer_profiles!bookings_sitter_id_fkey(*),
      booking_cats(*, cat:cats(*)),
      payments(*)
    `
    )
    .eq("customer_id", profile.id)
    .order("scheduled_date", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return (data as Booking[]) || [];
}

export async function getBookingById(
  bookingId: string
): Promise<Booking | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(*),
      customer:customer_profiles!bookings_customer_id_fkey(*),
      sitter:customer_profiles!bookings_sitter_id_fkey(*),
      booking_cats(*, cat:cats(*)),
      booking_addons(*, service_addon:service_addons(*)),
      payments(*),
      visit_updates(*, sitter:customer_profiles(*))
    `
    )
    .eq("id", bookingId)
    .single();

  return data as Booking | null;
}
