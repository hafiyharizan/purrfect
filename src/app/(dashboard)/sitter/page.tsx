"use client";

import { useEffect, useState } from "react";
import { getTodayBookings, getAssignedBookings } from "@/actions/sitter";
import { ScheduleCard } from "@/components/sitter/schedule-card";
import { VisitUpdateForm } from "@/components/sitter/visit-update-form";
import { EmergencyProtocol } from "@/components/sitter/emergency-protocol";
import { SitterWisdom } from "@/components/sitter/sitter-wisdom";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarDays } from "lucide-react";
import type { Booking } from "@/types";

export default function SitterPage() {
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const data = await getTodayBookings();
    setTodayBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const currentBooking = todayBookings.find(
    (b) => b.status === "in_progress"
  );
  const currentCatNames =
    currentBooking?.booking_cats
      ?.map((bc) => bc.cat?.name)
      .filter(Boolean)
      .join(" & ") || "your cats";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold">
          Hello, Sitter
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your feline companions are waiting for your warmth today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-semibold">
                Today&apos;s Schedule
              </h2>
              <span className="text-sm text-muted-foreground">{today}</span>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-28 bg-border/60 rounded-2xl" />
                <div className="h-28 bg-border/60 rounded-2xl" />
              </div>
            ) : todayBookings.length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="h-8 w-8" />}
                title="No visits today"
                description="Check back later for assigned bookings."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {todayBookings.map((booking) => (
                  <ScheduleCard
                    key={booking.id}
                    booking={booking}
                    onCheckIn={loadData}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Visit Update Form */}
          {currentBooking && (
            <VisitUpdateForm
              bookingId={currentBooking.id}
              catNames={currentCatNames}
              onComplete={loadData}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <EmergencyProtocol />
          <SitterWisdom />
        </div>
      </div>
    </div>
  );
}
