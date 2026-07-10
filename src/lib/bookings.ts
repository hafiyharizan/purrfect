export type VisitFrequency = 'single' | 'twice';

export const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Completed'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const VISIT_PLANS: Record<
  VisitFrequency,
  { label: string; visitsPerDay: 1 | 2; dailyRate: number }
> = {
  single: { label: 'Single visit/day', visitsPerDay: 1, dailyRate: 20 },
  twice: { label: 'Two visits/day', visitsPerDay: 2, dailyRate: 35 },
};

export const EXTRA_MINUTES_RATE_PER_VISIT = 10;

export const SERVICE_AREA = {
  center: 'Southern River',
  radiusKm: 10,
  suburbs: ['southern river', 'harrisdale', 'piara waters', 'canning vale', 'huntingdale', 'gosnells'],
  postcodes: ['6110'],
};

export type BookingEstimateInput = {
  startDate: string;
  endDate: string;
  visitFrequency: VisitFrequency;
  extraMinutes: boolean;
};

export type BookingEstimate = {
  days: number;
  visitsPerDay: 1 | 2;
  total: number;
};

export type BookingRequestInput = BookingEstimateInput & {
  ownerName: string;
  email: string;
  phone: string;
  addressSuburb: string;
  numberOfCats: number;
  catNames: string;
  feedingInstructions: string;
  litterInstructions: string;
  specialCareNotes: string;
  emergencyContact: string;
  vetDetails: string;
  catPhotoName?: string;
  confirmationConsent: boolean;
};

export type BookingRequest = BookingRequestInput & {
  id: string;
  status: BookingStatus;
  estimate: BookingEstimate;
  submittedAt: string;
  updatedAt: string;
};

const BOOKING_STORAGE_KEY = 'snuggle-cat-sitter-bookings';
const DAY_IN_MS = 86_400_000;

export function calculateBookingEstimate(input: BookingEstimateInput): BookingEstimate {
  const plan = VISIT_PLANS[input.visitFrequency];
  const start = parseLocalDate(input.startDate);
  const end = parseLocalDate(input.endDate);

  if (!start || !end || end.getTime() < start.getTime()) {
    return { days: 0, visitsPerDay: plan.visitsPerDay, total: 0 };
  }

  const days = Math.floor((end.getTime() - start.getTime()) / DAY_IN_MS) + 1;
  const extraRate = input.extraMinutes ? EXTRA_MINUTES_RATE_PER_VISIT * plan.visitsPerDay : 0;

  return {
    days,
    visitsPerDay: plan.visitsPerDay,
    total: days * (plan.dailyRate + extraRate),
  };
}

export function isLikelyInServiceArea(query: string): boolean {
  const normalized = query.trim().toLowerCase();
  return (
    SERVICE_AREA.suburbs.some((suburb) => normalized.includes(suburb)) ||
    SERVICE_AREA.postcodes.some((postcode) => normalized.includes(postcode))
  );
}

const REQUIRED_FIELDS = [
  'ownerName',
  'email',
  'phone',
  'addressSuburb',
  'catNames',
  'startDate',
  'endDate',
  'feedingInstructions',
  'litterInstructions',
  'emergencyContact',
  'vetDetails',
] as const;

export function validateBooking(form: BookingRequestInput): Record<string, string> {
  const errors: Record<string, string> = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!form[field].trim()) {
      errors[field] = 'This field is required.';
    }
  });

  if (!form.email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!form.numberOfCats || form.numberOfCats < 1) {
    errors.numberOfCats = 'Please enter at least one cat.';
  }

  const start = parseLocalDate(form.startDate);
  const end = parseLocalDate(form.endDate);
  if (start && end && end.getTime() < start.getTime()) {
    errors.endDate = 'End date must be the same as or after the start date.';
  }

  if (!form.confirmationConsent) {
    errors.confirmationConsent = 'Please confirm that booking is subject to approval.';
  }

  return errors;
}

export function createBookingRequest(
  input: BookingRequestInput,
  storage: Storage = window.localStorage,
): BookingRequest {
  const now = new Date().toISOString();
  const booking: BookingRequest = {
    ...input,
    id: createId(),
    status: 'Pending',
    estimate: calculateBookingEstimate(input),
    submittedAt: now,
    updatedAt: now,
  };

  saveBookings([booking, ...listBookingRequests(storage)], storage);
  return booking;
}

export function listBookingRequests(storage: Storage = window.localStorage): BookingRequest[] {
  const rawBookings = storage.getItem(BOOKING_STORAGE_KEY);

  if (!rawBookings) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawBookings);
    return Array.isArray(parsed) ? parsed.filter(isBookingRequest) : [];
  } catch {
    return [];
  }
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  storage: Storage = window.localStorage,
): BookingRequest | null {
  let updatedBooking: BookingRequest | null = null;
  const bookings = listBookingRequests(storage).map((booking) => {
    if (booking.id !== id) {
      return booking;
    }

    updatedBooking = {
      ...booking,
      status,
      updatedAt: new Date().toISOString(),
    };
    return updatedBooking;
  });

  if (!updatedBooking) {
    return null;
  }

  saveBookings(bookings, storage);
  return updatedBooking;
}

function saveBookings(bookings: BookingRequest[], storage: Storage) {
  storage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
}

export function parseLocalDate(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `booking-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isBookingRequest(value: unknown): value is BookingRequest {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const booking = value as Partial<BookingRequest>;
  return (
    typeof booking.id === 'string' &&
    typeof booking.ownerName === 'string' &&
    typeof booking.email === 'string' &&
    typeof booking.catNames === 'string' &&
    isBookingStatus(booking.status) &&
    typeof booking.estimate?.total === 'number'
  );
}

function isBookingStatus(status: unknown): status is BookingStatus {
  return typeof status === 'string' && (BOOKING_STATUSES as readonly string[]).includes(status);
}
