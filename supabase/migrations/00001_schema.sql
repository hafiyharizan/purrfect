-- Enums
CREATE TYPE public.user_role AS ENUM ('customer', 'sitter', 'admin');
CREATE TYPE public.booking_status AS ENUM (
  'pending_payment',
  'confirmed',
  'sitter_assigned',
  'in_progress',
  'completed',
  'cancelled'
);
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'succeeded',
  'failed',
  'refunded'
);

-- Customer Profiles
CREATE TABLE public.customer_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role        public.user_role NOT NULL DEFAULT 'customer',
  full_name   TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_customer_profiles_user_id ON public.customer_profiles(user_id);
CREATE INDEX idx_customer_profiles_role ON public.customer_profiles(role);

-- Cats
CREATE TABLE public.cats (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id       UUID NOT NULL REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  breed          TEXT,
  age_years      INTEGER,
  weight_kg      DECIMAL(4,1),
  medical_notes  TEXT,
  special_needs  TEXT,
  photo_url      TEXT,
  mood           TEXT DEFAULT 'Relaxed',
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cats_owner_id ON public.cats(owner_id);

-- Services
CREATE TABLE public.services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT NOT NULL,
  duration_hours  INTEGER,
  base_price      INTEGER NOT NULL,
  per_cat_price   INTEGER NOT NULL DEFAULT 0,
  icon            TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Service Addons
CREATE TABLE public.service_addons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  price       INTEGER NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_addons_service_id ON public.service_addons(service_id);

-- Bookings
CREATE TABLE public.bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       UUID NOT NULL REFERENCES public.customer_profiles(id),
  service_id        UUID NOT NULL REFERENCES public.services(id),
  sitter_id         UUID REFERENCES public.customer_profiles(id),
  status            public.booking_status NOT NULL DEFAULT 'pending_payment',
  scheduled_date    DATE NOT NULL,
  scheduled_time    TIME NOT NULL,
  end_date          DATE,
  location          TEXT,
  notes             TEXT,
  total_amount      INTEGER NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_sitter_id ON public.bookings(sitter_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON public.bookings(scheduled_date);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);

-- Booking Cats (many-to-many)
CREATE TABLE public.booking_cats (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  cat_id      UUID NOT NULL REFERENCES public.cats(id),
  UNIQUE(booking_id, cat_id)
);

CREATE INDEX idx_booking_cats_booking_id ON public.booking_cats(booking_id);

-- Booking Addons (many-to-many)
CREATE TABLE public.booking_addons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id       UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_addon_id UUID NOT NULL REFERENCES public.service_addons(id),
  quantity         INTEGER NOT NULL DEFAULT 1,
  unit_price       INTEGER NOT NULL,
  UNIQUE(booking_id, service_addon_id)
);

CREATE INDEX idx_booking_addons_booking_id ON public.booking_addons(booking_id);

-- Payments
CREATE TABLE public.payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id            UUID NOT NULL REFERENCES public.bookings(id),
  stripe_session_id     TEXT UNIQUE,
  stripe_payment_intent TEXT UNIQUE,
  amount                INTEGER NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'usd',
  status                public.payment_status NOT NULL DEFAULT 'pending',
  paid_at               TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_stripe_session_id ON public.payments(stripe_session_id);

-- Visit Updates
CREATE TABLE public.visit_updates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sitter_id   UUID NOT NULL REFERENCES public.customer_profiles(id),
  notes       TEXT NOT NULL,
  photo_urls  TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_visit_updates_booking_id ON public.visit_updates(booking_id);

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.customer_profiles WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_customer_profiles_updated_at
  BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_cats_updated_at
  BEFORE UPDATE ON public.cats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Sync role to auth.users metadata for middleware
CREATE OR REPLACE FUNCTION public.sync_role_to_auth_meta()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role::text)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role ON public.customer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_role_to_auth_meta();

-- RLS Policies
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_updates ENABLE ROW LEVEL SECURITY;

-- customer_profiles policies
CREATE POLICY "Users can view own profile or admin views all"
  ON public.customer_profiles FOR SELECT
  USING (user_id = auth.uid() OR current_user_role() = 'admin');

CREATE POLICY "Users can update own profile"
  ON public.customer_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.customer_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- cats policies
CREATE POLICY "Owners see own cats"
  ON public.cats FOR SELECT
  USING (
    owner_id = current_profile_id()
    OR current_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.booking_cats bc
      JOIN public.bookings b ON b.id = bc.booking_id
      WHERE bc.cat_id = cats.id AND b.sitter_id = current_profile_id()
    )
  );

CREATE POLICY "Owners manage own cats"
  ON public.cats FOR INSERT WITH CHECK (owner_id = current_profile_id());

CREATE POLICY "Owners update own cats"
  ON public.cats FOR UPDATE USING (owner_id = current_profile_id());

CREATE POLICY "Owners delete own cats"
  ON public.cats FOR DELETE USING (owner_id = current_profile_id());

-- services policies
CREATE POLICY "Anyone authenticated can view active services"
  ON public.services FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage services"
  ON public.services FOR ALL USING (current_user_role() = 'admin');

-- service_addons policies
CREATE POLICY "Anyone authenticated can view service addons"
  ON public.service_addons FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage service addons"
  ON public.service_addons FOR ALL USING (current_user_role() = 'admin');

-- bookings policies
CREATE POLICY "Booking read access"
  ON public.bookings FOR SELECT
  USING (
    customer_id = current_profile_id()
    OR sitter_id = current_profile_id()
    OR current_user_role() = 'admin'
  );

CREATE POLICY "Customers create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (customer_id = current_profile_id());

CREATE POLICY "Admin or sitter updates bookings"
  ON public.bookings FOR UPDATE
  USING (current_user_role() = 'admin' OR sitter_id = current_profile_id());

-- booking_cats policies
CREATE POLICY "Booking cats read access"
  ON public.booking_cats FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id
    AND (b.customer_id = current_profile_id()
      OR b.sitter_id = current_profile_id()
      OR current_user_role() = 'admin')
  ));

CREATE POLICY "Customer inserts booking cats"
  ON public.booking_cats FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id
    AND b.customer_id = current_profile_id()
  ));

-- booking_addons policies
CREATE POLICY "Booking addons read access"
  ON public.booking_addons FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id
    AND (b.customer_id = current_profile_id()
      OR b.sitter_id = current_profile_id()
      OR current_user_role() = 'admin')
  ));

CREATE POLICY "Customer inserts booking addons"
  ON public.booking_addons FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id
    AND b.customer_id = current_profile_id()
  ));

-- payments policies
CREATE POLICY "Payment read access"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b WHERE b.id = booking_id
      AND (b.customer_id = current_profile_id() OR current_user_role() = 'admin')
    )
  );

-- visit_updates policies
CREATE POLICY "Visit update read access"
  ON public.visit_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b WHERE b.id = booking_id
      AND (b.customer_id = current_profile_id()
        OR b.sitter_id = current_profile_id()
        OR current_user_role() = 'admin')
    )
  );

CREATE POLICY "Sitter creates visit updates"
  ON public.visit_updates FOR INSERT
  WITH CHECK (sitter_id = current_profile_id());
