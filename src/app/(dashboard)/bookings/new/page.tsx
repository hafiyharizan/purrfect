import { getServices } from "@/actions/bookings";
import { getCats } from "@/actions/cats";
import { BookingWizard } from "@/components/bookings/booking-wizard";
import { PageHeader } from "@/components/shared/page-header";

export default async function NewBookingPage() {
  const [services, cats] = await Promise.all([getServices(), getCats()]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Book a Session"
        subtitle="Schedule care for your feline family"
      />
      <BookingWizard services={services} cats={cats} />
    </div>
  );
}
