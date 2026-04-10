export const USER_ROLES = {
  CUSTOMER: "customer",
  SITTER: "sitter",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const BOOKING_STATUSES = {
  PENDING_PAYMENT: "pending_payment",
  CONFIRMED: "confirmed",
  SITTER_ASSIGNED: "sitter_assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BookingStatus =
  (typeof BOOKING_STATUSES)[keyof typeof BOOKING_STATUSES];

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending_payment: "Pending Payment",
  confirmed: "Confirmed",
  sitter_assigned: "Sitter Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const CAT_MOODS = [
  "Sleeping",
  "Playful",
  "Relaxed",
  "Curious",
  "Hungry",
] as const;

export type CatMood = (typeof CAT_MOODS)[number];

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CATS: "/cats",
  CATS_NEW: "/cats/new",
  BOOKINGS: "/bookings",
  BOOKINGS_NEW: "/bookings/new",
  ADMIN: "/admin",
  ADMIN_SITTERS: "/admin/sitters",
  SITTER: "/sitter",
  SETTINGS: "/settings",
} as const;

export const PUBLIC_ROUTES = ["/", "/login", "/register", "/callback"];
export const ADMIN_ROUTES = ["/admin"];
export const SITTER_ROUTES = ["/sitter"];
