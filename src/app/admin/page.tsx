import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { listBookings } from '@/lib/bookings-repo';
import { AdminDashboard } from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const bookings = await listBookings();

  return <AdminDashboard initialBookings={bookings} />;
}
