import { getBookingById } from "@/actions/bookings";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { Avatar } from "@/components/ui/avatar";
import {
  formatDate,
  formatTime,
  formatCurrency,
} from "@/lib/utils";
import { CalendarDays, Clock, FileText, CreditCard, User } from "lucide-react";
import type { BookingStatus } from "@/lib/constants";
import Link from "next/link";

export default async function BookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { bookingId } = await params;
  const { payment } = await searchParams;
  const booking = await getBookingById(bookingId);

  if (!booking) notFound();

  const catNames =
    booking.booking_cats
      ?.map((bc) => bc.cat?.name)
      .filter(Boolean)
      .join(" & ") || "No cats";

  const latestPayment = booking.payments?.[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {payment === "success" && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          Payment successful! Your booking has been confirmed.
        </div>
      )}

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
        {/* Date & Time */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-sm">
              {formatDate(booking.scheduled_date)}
              {booking.end_date &&
                ` — ${formatDate(booking.end_date)}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm">
              {formatTime(booking.scheduled_time)}
            </span>
          </div>
        </div>

        {/* Cats */}
        <div>
          <h3 className="text-sm font-medium mb-2">Cats</h3>
          <div className="flex flex-wrap gap-2">
            {booking.booking_cats?.map((bc) => (
              <Badge key={bc.id} variant="secondary">
                {bc.cat?.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        {booking.booking_addons && booking.booking_addons.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Add-ons</h3>
            <div className="space-y-1">
              {booking.booking_addons.map((ba) => (
                <div key={ba.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {ba.service_addon?.name}
                  </span>
                  <span>{formatCurrency(ba.unit_price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Notes</h3>
            </div>
            <p className="text-sm text-muted-foreground bg-accent/50 rounded-xl p-3">
              {booking.notes}
            </p>
          </div>
        )}

        {/* Sitter */}
        {booking.sitter && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Assigned Sitter</h3>
            </div>
            <div className="flex items-center gap-3">
              <Avatar
                src={booking.sitter.avatar_url}
                alt={booking.sitter.full_name}
                fallback={booking.sitter.full_name.charAt(0)}
              />
              <span className="font-medium">{booking.sitter.full_name}</span>
            </div>
          </div>
        )}

        {/* Payment */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(booking.total_amount)}
              </p>
              {latestPayment && (
                <Badge
                  variant={
                    latestPayment.status === "succeeded"
                      ? "success"
                      : latestPayment.status === "failed"
                        ? "destructive"
                        : "warning"
                  }
                >
                  {latestPayment.status}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Visit Updates */}
      {booking.visit_updates && booking.visit_updates.length > 0 && (
        <div>
          <h2 className="text-xl font-serif font-semibold mb-4">
            Visit Updates
          </h2>
          <div className="space-y-3">
            {booking.visit_updates.map((update) => (
              <Card key={update.id} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar
                    src={update.sitter?.avatar_url}
                    alt={update.sitter?.full_name || "Sitter"}
                    fallback={update.sitter?.full_name?.charAt(0) || "S"}
                    size="sm"
                  />
                  <span className="text-sm font-medium">
                    {update.sitter?.full_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(update.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{update.notes}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <Link
          href="/bookings"
          className="text-sm text-primary hover:underline"
        >
          &larr; Back to Bookings
        </Link>
      </div>
    </div>
  );
}
