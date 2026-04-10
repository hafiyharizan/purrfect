import { getBookingById } from "@/actions/bookings";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { VisitUpdateForm } from "@/components/sitter/visit-update-form";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarDays, Clock, FileText, User } from "lucide-react";
import type { BookingStatus } from "@/lib/constants";
import Link from "next/link";

export default async function SitterBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBookingById(bookingId);

  if (!booking) notFound();

  const catNames =
    booking.booking_cats
      ?.map((bc) => bc.cat?.name)
      .filter(Boolean)
      .join(" & ") || "No cats";

  const canComplete = ["sitter_assigned", "in_progress"].includes(
    booking.status
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">{catNames}</h1>
          <p className="text-muted-foreground mt-1">
            {booking.service?.name}
          </p>
        </div>
        <BookingStatusBadge status={booking.status as BookingStatus} />
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-sm">{formatDate(booking.scheduled_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm">
              {formatTime(booking.scheduled_time)}
            </span>
          </div>
        </div>

        {/* Owner info */}
        {booking.customer && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Owner</h3>
            </div>
            <div className="flex items-center gap-3">
              <Avatar
                src={booking.customer.avatar_url}
                alt={booking.customer.full_name}
                fallback={booking.customer.full_name.charAt(0)}
              />
              <div>
                <p className="font-medium">{booking.customer.full_name}</p>
                {booking.customer.phone && (
                  <p className="text-xs text-muted-foreground">
                    {booking.customer.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cats */}
        <div>
          <h3 className="text-sm font-medium mb-2">Cats</h3>
          <div className="space-y-2">
            {booking.booking_cats?.map((bc) => (
              <div key={bc.id} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent overflow-hidden">
                  {bc.cat?.photo_url ? (
                    <img
                      src={bc.cat.photo_url}
                      alt={bc.cat.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      🐱
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{bc.cat?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {bc.cat?.breed}
                    {bc.cat?.medical_notes && (
                      <span className="text-amber-600 ml-2">
                        Medical: {bc.cat.medical_notes}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Owner Instructions</h3>
            </div>
            <p className="text-sm text-muted-foreground bg-accent/50 rounded-xl p-3">
              {booking.notes}
            </p>
          </div>
        )}
      </Card>

      {/* Complete Visit Form */}
      {canComplete && (
        <VisitUpdateForm bookingId={booking.id} catNames={catNames} />
      )}

      {/* Visit Updates */}
      {booking.visit_updates && booking.visit_updates.length > 0 && (
        <div>
          <h2 className="text-xl font-serif font-semibold mb-3">
            Past Updates
          </h2>
          <div className="space-y-3">
            {booking.visit_updates.map((update) => (
              <Card key={update.id} className="p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  {formatDate(update.created_at)}
                </p>
                <p className="text-sm">{update.notes}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/sitter"
        className="text-sm text-primary hover:underline inline-block"
      >
        &larr; Back to Schedule
      </Link>
    </div>
  );
}
