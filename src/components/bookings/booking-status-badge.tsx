import { Badge, type BadgeProps } from "@/components/ui/badge";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/constants";

const statusVariants: Record<BookingStatus, BadgeProps["variant"]> = {
  pending_payment: "warning",
  confirmed: "default",
  sitter_assigned: "default",
  in_progress: "success",
  completed: "success",
  cancelled: "destructive",
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({
  status,
  className,
}: BookingStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]} className={className}>
      {BOOKING_STATUS_LABELS[status]}
    </Badge>
  );
}
