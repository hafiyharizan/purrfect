export type UserRole = "customer" | "sitter" | "admin";
export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "sitter_assigned"
  | "in_progress"
  | "completed"
  | "cancelled";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
export type CatMood = "Sleeping" | "Playful" | "Relaxed" | "Curious" | "Hungry";

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cat {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  age_years: number | null;
  weight_kg: number | null;
  medical_notes: string | null;
  special_needs: string | null;
  photo_url: string | null;
  mood: CatMood | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration_hours: number | null;
  base_price: number;
  per_cat_price: number;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ServiceAddon {
  id: string;
  service_id: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  service_id: string;
  sitter_id: string | null;
  status: BookingStatus;
  scheduled_date: string;
  scheduled_time: string;
  end_date: string | null;
  location: string | null;
  notes: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
  // Joined relations
  service?: Service;
  customer?: Profile;
  sitter?: Profile;
  booking_cats?: (BookingCat & { cat: Cat })[];
  booking_addons?: (BookingAddon & { service_addon: ServiceAddon })[];
  payments?: Payment[];
  visit_updates?: VisitUpdate[];
}

export interface BookingCat {
  id: string;
  booking_id: string;
  cat_id: string;
  cat?: Cat;
}

export interface BookingAddon {
  id: string;
  booking_id: string;
  service_addon_id: string;
  quantity: number;
  unit_price: number;
  service_addon?: ServiceAddon;
}

export interface Payment {
  id: string;
  booking_id: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisitUpdate {
  id: string;
  booking_id: string;
  sitter_id: string;
  notes: string;
  photo_urls: string[];
  created_at: string;
  sitter?: Profile;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}
