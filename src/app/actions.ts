'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { insertBooking, updateBookingStatus } from '@/lib/bookings-repo';
import {
  calculateBookingEstimate,
  validateBooking,
  type BookingRequestInput,
  type BookingStatus,
} from '@/lib/bookings';

export type SubmitResult =
  | { ok: true; ownerName: string; status: BookingStatus; total: number }
  | { ok: false; errors: Record<string, string> };

export async function submitBooking(input: BookingRequestInput): Promise<SubmitResult> {
  const errors = validateBooking(input);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  try {
    await insertBooking(input);
  } catch {
    return {
      ok: false,
      errors: { form: 'Something went wrong saving your request. Please try again.' },
    };
  }

  const estimate = calculateBookingEstimate(input);
  revalidatePath('/admin');
  return { ok: true, ownerName: input.ownerName, status: 'Pending', total: estimate.total };
}

export async function changeBookingStatus(id: string, status: BookingStatus): Promise<void> {
  await updateBookingStatus(id, status);
  revalidatePath('/admin');
}

export async function signIn(
  _prevState: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Please enter your email and password.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Incorrect email or password.' };
  }

  redirect('/admin');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
