"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { checkInBooking } from "@/actions/sitter";
import { useState } from "react";
import type { Booking } from "@/types";

interface ScheduleCardProps {
  booking: Booking;
  onCheckIn?: () => void;
}

export function ScheduleCard({ booking, onCheckIn }: ScheduleCardProps) {
  const [checking, setChecking] = useState(false);

  const catNames =
    booking.booking_cats
      ?.map((bc) => bc.cat?.name)
      .filter(Boolean)
      .join(" & ") || "No cats";

  const isInProgress = booking.status === "in_progress";

  const handleCheckIn = async () => {
    setChecking(true);
    await checkInBooking(booking.id);
    setChecking(false);
    onCheckIn?.();
  };

  // Estimate end time based on service duration
  const startTime = booking.scheduled_time;
  const duration = booking.service?.duration_hours || 1;
  const [h, m] = startTime.split(":").map(Number);
  const endH = h + duration;
  const endTime = `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        {/* Cat photo */}
        <div className="h-14 w-14 rounded-full bg-accent overflow-hidden shrink-0">
          {booking.booking_cats?.[0]?.cat?.photo_url ? (
            <img
              src={booking.booking_cats[0].cat.photo_url}
              alt={catNames}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl">
              🐱
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-serif font-semibold">{catNames}</h3>
            {isInProgress && (
              <Badge variant="success" className="text-[10px]">
                CURRENT
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatTime(startTime)} — {formatTime(endTime)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {booking.notes || booking.service?.description}
          </p>
        </div>
      </div>

      <div className="mt-3">
        {isInProgress ? (
          <Button variant="primary" className="w-full" disabled>
            In Progress
          </Button>
        ) : (
          <Button
            variant={booking.status === "sitter_assigned" ? "primary" : "outline"}
            className="w-full"
            onClick={handleCheckIn}
            disabled={checking}
          >
            {checking ? "Checking in..." : "Check In"}
          </Button>
        )}
      </div>
    </Card>
  );
}
