import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCats } from "@/actions/cats";
import { CatCard } from "@/components/cats/cat-card";
import { NextSessionCard } from "@/components/dashboard/next-session-card";
import { WellnessSection } from "@/components/dashboard/wellness-section";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Profile, Booking } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/login");

  const typedProfile = profile as Profile;

  // Role-based redirect
  if (typedProfile.role === "admin") redirect("/admin");
  if (typedProfile.role === "sitter") redirect("/sitter");

  // Customer dashboard
  const cats = await getCats();

  // Get next upcoming booking
  const { data: nextBooking } = await supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(*),
      sitter:customer_profiles!bookings_sitter_id_fkey(*),
      booking_cats(*, cat:cats(*))
    `
    )
    .eq("customer_id", typedProfile.id)
    .in("status", ["confirmed", "sitter_assigned"])
    .gte("scheduled_date", new Date().toISOString().split("T")[0])
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true })
    .limit(1)
    .maybeSingle();

  const firstName = typedProfile.full_name.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 text-muted-foreground">
            The sun is shining and your feline family is waiting for you.
          </p>
        </div>
        {/* Cat avatar stack */}
        {cats.length > 0 && (
          <div className="hidden sm:flex -space-x-3">
            {cats.slice(0, 3).map((cat) => (
              <div
                key={cat.id}
                className="h-12 w-12 rounded-full border-2 border-background bg-accent overflow-hidden"
              >
                {cat.photo_url ? (
                  <img
                    src={cat.photo_url}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-lg">
                    🐱
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Next Session */}
        <div>
          <NextSessionCard booking={nextBooking as Booking | null} />
        </div>

        {/* Right: My Kitties */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-semibold">My Kitties</h2>
            <Link
              href="/cats/new"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Add a Feline <Plus className="h-4 w-4" />
            </Link>
          </div>
          {cats.length === 0 ? (
            <div className="rounded-2xl bg-accent/30 p-12 text-center">
              <p className="text-4xl mb-2">🐱</p>
              <p className="text-muted-foreground">
                No felines yet.{" "}
                <Link
                  href="/cats/new"
                  className="text-primary font-medium hover:underline"
                >
                  Add your first cat
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cats.map((cat) => (
                <CatCard key={cat.id} cat={cat} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wellness Tracking */}
      <WellnessSection />
    </div>
  );
}
