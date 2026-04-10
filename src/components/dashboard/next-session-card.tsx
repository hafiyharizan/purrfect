import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { CalendarCheck } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import type { Booking } from "@/types";

interface NextSessionCardProps {
  booking: Booking | null;
}

export function NextSessionCard({ booking }: NextSessionCardProps) {
  if (!booking) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-serif font-semibold mb-4">Next Session</h2>
        <div className="text-center py-8 text-muted-foreground">
          <CalendarCheck className="h-10 w-10 mx-auto mb-2 text-secondary" />
          <p className="text-sm">No upcoming sessions</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-serif font-semibold mb-4">Next Session</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30 text-primary">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary">
              Upcoming Visit
            </p>
            <p className="font-semibold">
              {formatDate(booking.scheduled_date)},{" "}
              {formatTime(booking.scheduled_time)}
            </p>
          </div>
        </div>

        {booking.sitter && (
          <div className="flex items-center gap-3">
            <Avatar
              src={booking.sitter.avatar_url}
              alt={booking.sitter.full_name}
              fallback={booking.sitter.full_name.charAt(0)}
              size="md"
            />
            <div>
              <p className="text-xs text-muted-foreground">Your Sitter</p>
              <p className="font-semibold">{booking.sitter.full_name}</p>
            </div>
          </div>
        )}

        {booking.notes && (
          <div className="rounded-xl bg-accent/50 p-3">
            <p className="text-sm text-muted-foreground italic">
              &ldquo;{booking.notes}&rdquo;
            </p>
          </div>
        )}

        {booking.sitter && (
          <Button variant="primary" className="w-full">
            Message {booking.sitter.full_name.split(" ")[0]}
          </Button>
        )}
      </div>
    </Card>
  );
}
