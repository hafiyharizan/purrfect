import { getBookings } from "@/actions/bookings";
import { BookingCard } from "@/components/bookings/booking-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";

export default async function BookingsPage() {
  const bookings = await getBookings();

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(
    (b) =>
      b.scheduled_date >= today &&
      !["completed", "cancelled"].includes(b.status)
  );
  const past = bookings.filter(
    (b) =>
      b.scheduled_date < today ||
      ["completed", "cancelled"].includes(b.status)
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bookings"
        subtitle="View and manage your cat sitting sessions"
        action={
          <Link href="/bookings/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Booking
            </Button>
          </Link>
        }
      />

      {bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-8 w-8" />}
          title="No bookings yet"
          description="Book your first cat sitting session to get started."
          action={
            <Link href="/bookings/new">
              <Button>Book a Session</Button>
            </Link>
          }
        />
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">
                No upcoming bookings
              </p>
            ) : (
              upcoming.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4 space-y-3">
            {past.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">
                No past bookings
              </p>
            ) : (
              past.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
