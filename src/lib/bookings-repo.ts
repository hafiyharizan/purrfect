import 'server-only';
import { createClient } from '@/lib/supabase/server';
import {
  calculateBookingEstimate,
  type BookingRequest,
  type BookingRequestInput,
  type BookingStatus,
  type VisitFrequency,
} from '@/lib/bookings';

type BookingRow = {
  id: string;
  owner_name: string;
  email: string;
  phone: string;
  address_suburb: string;
  number_of_cats: number;
  cat_names: string;
  start_date: string;
  end_date: string;
  visit_frequency: VisitFrequency;
  extra_minutes: boolean;
  feeding_instructions: string;
  litter_instructions: string;
  special_care_notes: string;
  emergency_contact: string;
  vet_details: string;
  cat_photo_name: string;
  confirmation_consent: boolean;
  estimate_days: number;
  estimate_visits_per_day: 1 | 2;
  estimate_total: number;
  status: BookingStatus;
  submitted_at: string;
  updated_at: string;
};

function rowToBooking(row: BookingRow): BookingRequest {
  return {
    id: row.id,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    addressSuburb: row.address_suburb,
    numberOfCats: row.number_of_cats,
    catNames: row.cat_names,
    startDate: row.start_date,
    endDate: row.end_date,
    visitFrequency: row.visit_frequency,
    extraMinutes: row.extra_minutes,
    feedingInstructions: row.feeding_instructions,
    litterInstructions: row.litter_instructions,
    specialCareNotes: row.special_care_notes,
    emergencyContact: row.emergency_contact,
    vetDetails: row.vet_details,
    catPhotoName: row.cat_photo_name,
    confirmationConsent: row.confirmation_consent,
    estimate: {
      days: row.estimate_days,
      visitsPerDay: row.estimate_visits_per_day,
      total: row.estimate_total,
    },
    status: row.status,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
  };
}

// Public path: anon may INSERT but not SELECT (RLS protects PII), so we insert
// without reading the row back.
export async function insertBooking(input: BookingRequestInput): Promise<void> {
  const supabase = await createClient();
  const estimate = calculateBookingEstimate(input);

  const { error } = await supabase.from('bookings').insert({
    owner_name: input.ownerName,
    email: input.email,
    phone: input.phone,
    address_suburb: input.addressSuburb,
    number_of_cats: input.numberOfCats,
    cat_names: input.catNames,
    start_date: input.startDate,
    end_date: input.endDate,
    visit_frequency: input.visitFrequency,
    extra_minutes: input.extraMinutes,
    feeding_instructions: input.feedingInstructions,
    litter_instructions: input.litterInstructions,
    special_care_notes: input.specialCareNotes,
    emergency_contact: input.emergencyContact,
    vet_details: input.vetDetails,
    cat_photo_name: input.catPhotoName ?? '',
    confirmation_consent: input.confirmationConsent,
    estimate_days: estimate.days,
    estimate_visits_per_day: estimate.visitsPerDay,
    estimate_total: estimate.total,
    status: 'Pending',
  });

  if (error) {
    throw new Error(error.message);
  }
}

// Admin path: requires an authenticated session (enforced by RLS + middleware).
export async function listBookings(): Promise<BookingRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data as BookingRow[]) ?? []).map(rowToBooking);
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
