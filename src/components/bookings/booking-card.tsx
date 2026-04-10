import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "./booking-status-badge";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import type { Booking } from "@/types";
import type { BookingStatus } from "@/lib/constants";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const catNames =
    booking.booking_cats
      ?.map((bc) => bc.cat?.name)
      .filter(Boolean)
      .join(" & ") || "No cats";

  return (
    <Link href={`/bookings/${booking.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          {/* Cat Photo */}
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
              <BookingStatusBadge status={booking.status as BookingStatus} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>
                {formatDate(booking.scheduled_date)} at{" "}
                {formatTime(booking.scheduled_time)}
              </span>
            </div>
            {booking.service && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {booking.service.name}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className="font-semibold text-primary">
              {formatCurrency(booking.total_amount)}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
