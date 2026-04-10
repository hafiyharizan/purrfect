"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDateShort } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import type { Booking } from "@/types";

interface ActiveBookingsProps {
  bookings: Booking[];
  onAssignSitter: (bookingId: string) => void;
}

const serviceTypeLabels: Record<string, string> = {
  "drop-in": "DROP-IN",
  overnight: "OVERNIGHT",
  boarding: "BOARDING",
};

export function ActiveBookings({
  bookings,
  onAssignSitter,
}: ActiveBookingsProps) {
  const upcoming = bookings.filter(
    (b) =>
      !["completed", "cancelled", "pending_payment"].includes(b.status)
  );
  const pending = bookings.filter((b) => b.status === "pending_payment");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-serif font-bold">Active Bookings</h2>
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {upcoming.length === 0 && pending.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No active bookings
          </p>
        ) : (
          [...upcoming, ...pending].map((booking) => {
            const catNames =
              booking.booking_cats
                ?.map((bc) => bc.cat?.name)
                .filter(Boolean)
                .join(" & ") || "No cats";

            const hasMedicalNotes = booking.booking_cats?.some(
              (bc) => bc.cat?.medical_notes
            );

            return (
              <Card key={booking.id} className="p-4">
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
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif font-semibold">{catNames}</h3>
                      <Badge variant="outline" className="text-xs">
                        {serviceTypeLabels[booking.service?.slug || ""] ||
                          booking.service?.name?.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.location || "Location TBD"} &bull;{" "}
                      {formatDateShort(booking.scheduled_date)}
                      {booking.end_date &&
                        ` – ${formatDateShort(booking.end_date)}`}
                    </p>
                    {hasMedicalNotes && (
                      <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        Needs specialized medical care
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {!booking.sitter_id ? (
                      <Button
                        size="sm"
                        onClick={() => onAssignSitter(booking.id)}
                      >
                        Assign Sitter
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
