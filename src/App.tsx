import {
  Brush,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Heart,
  Home,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  Utensils,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import heroCat from './assets/hero-watercolor-cat.png';
import {
  BOOKING_STATUSES,
  EXTRA_MINUTES_RATE_PER_VISIT,
  SERVICE_AREA,
  VISIT_PLANS,
  calculateBookingEstimate,
  createBookingRequest,
  isLikelyInServiceArea,
  listBookingRequests,
  parseLocalDate,
  updateBookingStatus,
  validateBooking,
  type BookingRequest,
  type BookingRequestInput,
  type BookingStatus,
  type VisitFrequency,
} from './lib/bookings';

const email = 'iamfarah19@outlook.com';
const instagramHandle = '@snuggle.cat.sitter';
const instagramUrl = 'https://www.instagram.com/snuggle.cat.sitter';

const initialForm: BookingRequestInput = {
  ownerName: '',
  email: '',
  phone: '',
  addressSuburb: '',
  numberOfCats: 1,
  catNames: '',
  startDate: '',
  endDate: '',
  visitFrequency: 'single',
  extraMinutes: false,
  feedingInstructions: '',
  litterInstructions: '',
  specialCareNotes: '',
  emergencyContact: '',
  vetDetails: '',
  catPhotoName: '',
  confirmationConsent: false,
};

const serviceItems = [
  { icon: Utensils, title: 'Feeding & fresh water', text: 'Meals served exactly the way your cat likes them.' },
  { icon: Trash2, title: 'Litter cleaning', text: 'Clean trays, tidy surrounds, and a fresher home.' },
  { icon: Sparkles, title: 'Snuggles & playtime', text: 'Gentle company for shy cats and playful sessions for confident cats.' },
  { icon: Camera, title: 'Daily photo & video updates', text: 'Sweet check-ins so you can relax while away.' },
  { icon: Brush, title: 'Tidy pet mess', text: 'Quick tidy-ups for mess made by your cat during the visit.' },
];

const pricingCards = [
  {
    title: VISIT_PLANS.single.label,
    price: `$${VISIT_PLANS.single.dailyRate}`,
    detail: '1 x 30-minute visit',
    icon: Clock3,
  },
  {
    title: VISIT_PLANS.twice.label,
    price: `$${VISIT_PLANS.twice.dailyRate}`,
    detail: '2 x 30-minute visits',
    icon: PawPrint,
    featured: true,
  },
  {
    title: 'Additional 30 minutes',
    price: `$${EXTRA_MINUTES_RATE_PER_VISIT}`,
    detail: 'Per visit, extra snuggles',
    icon: CircleDollarSign,
  },
];

const testimonials = [
  {
    name: 'Emma, Southern River',
    quote:
      'Farah sent the sweetest updates every day. Our cat was calm, fed, and clearly loved while we were away.',
  },
  {
    name: 'Amanda, Harrisdale',
    quote:
      'So gentle and thoughtful. My shy cat warmed up quickly and the litter area was spotless when we got home.',
  },
  {
    name: 'Daniel, Piara Waters',
    quote:
      'The photo and video updates were the highlight of our trip. Everything felt easy and trustworthy.',
  },
];

const faqItems = [
  {
    question: 'Do you send updates?',
    answer: 'Yes. You will receive daily photo and video updates after each visit so you know your cat is safe and settled.',
  },
  {
    question: 'Do you clean litter?',
    answer: 'Yes. Litter cleaning is included in every 30-minute snuggle visit.',
  },
  {
    question: 'Can I book two visits per day?',
    answer: `Yes. Two visits per day are available for $${VISIT_PLANS.twice.dailyRate} per day, and extra 30-minute time can be added per visit.`,
  },
  {
    question: 'Do you care for cats needing medication?',
    answer:
      'Simple medication or special care can be discussed during booking. Please include clear notes and vet details.',
  },
  {
    question: 'What suburbs do you cover?',
    answer: `The main service area is ${SERVICE_AREA.center} and surrounding suburbs within ${SERVICE_AREA.radiusKm}km. A travel fee may apply outside the area.`,
  },
  {
    question: 'Is the booking confirmed immediately?',
    answer:
      'No. Your request is subject to confirmation so dates, location, care needs, and travel can be checked first.',
  },
];

type Route = 'home' | 'admin';

export default function App() {
  const [route, setRoute] = useState<Route>(getRouteFromHash);
  const [bookings, setBookings] = useState<BookingRequest[]>(() => listBookingRequests());

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (route === 'admin') {
      setBookings(listBookingRequests());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [route]);

  const handleBookingCreated = (booking: BookingRequest) => {
    setBookings((current) => [booking, ...current]);
  };

  const handleStatusChange = (id: string, status: BookingStatus) => {
    const updated = updateBookingStatus(id, status);
    if (!updated) {
      return;
    }

    setBookings((current) =>
      current.map((booking) => (booking.id === id ? updated : booking)),
    );
  };

  return (
    <div className="app-shell">
      <Header route={route} />
      {route === 'admin' ? (
        <AdminDashboard bookings={bookings} onStatusChange={handleStatusChange} />
      ) : (
        <LandingPage onBookingCreated={handleBookingCreated} />
      )}
    </div>
  );
}

const landingLinks = [
  ['About', '#about'],
  ['Services', '#services'],
  ['Pricing', '#pricing'],
  ['Booking', '#booking'],
  ['Area', '#area'],
  ['FAQ', '#faq'],
];

function Header({ route }: { route: Route }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Snuggle Cat Sitter home">
        <LineCat className="brand-cat" />
        <span>
          <strong>Snuggle</strong>
          <small>Cat Sitter</small>
        </span>
      </a>

      <nav className="site-nav" aria-label="Primary navigation">
        {route === 'home' ? (
          landingLinks.map(([label, href]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))
        ) : (
          <a href="#booking">Back to site</a>
        )}
        <a className="nav-admin" href="#admin">
          Admin
        </a>
      </nav>

      <a className="header-cta" href={route === 'home' ? '#booking' : '#home'}>
        <PawPrint aria-hidden="true" size={18} />
        {route === 'home' ? 'Book a Visit' : 'View Website'}
      </a>
    </header>
  );
}

function LandingPage({ onBookingCreated }: { onBookingCreated: (booking: BookingRequest) => void }) {
  return (
    <main>
      <section className="hero-section" id="home">
        <div className="hero-copy">
          <h1>Loving Cat Sitting in Perth</h1>
          <p>
            Daily snuggles, feeding, litter care, and photo updates while you’re away.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#booking">
              <PawPrint aria-hidden="true" size={19} />
              Book a Visit
            </a>
            <a className="secondary-button" href="#pricing">
              View Pricing
            </a>
          </div>
          <div className="trust-strip" aria-label="Visit highlights">
            <span>
              <Clock3 aria-hidden="true" size={18} />
              30-minute snuggle visits
            </span>
            <span>
              <Camera aria-hidden="true" size={18} />
              Daily photo updates
            </span>
            <span>
              <ShieldCheck aria-hidden="true" size={18} />
              Gentle and reliable
            </span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Watercolor cat with lavender flowers">
          <img src={heroCat} alt="Watercolor illustration of a fluffy cat with lavender flowers" />
          <LineCat className="hero-line-cat" />
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="section-heading">
          <PawPrint aria-hidden="true" size={22} />
          <h2>About Snuggle Cat Sitter</h2>
        </div>
        <div className="about-grid">
          <p>
            Snuggle Cat Sitter offers reliable, gentle in-home care for busy cat owners,
            holidays, work trips, and short getaways. Every visit is calm, caring, and
            tailored to your cat’s routine, so they can stay comfortable in their own home.
          </p>
          <div className="about-cards" aria-label="Care qualities">
            <MiniCard icon={Heart} title="Personalised care" text="Every cat is different, so each visit follows your notes." />
            <MiniCard icon={ShieldCheck} title="Safe and trustworthy" text="Care details, emergency contact, and vet notes stay easy to access." />
            <MiniCard icon={Home} title="Local and convenient" text={`${SERVICE_AREA.center} and nearby suburbs are the main service area.`} />
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-heading centered">
          <Sparkles aria-hidden="true" size={22} />
          <h2>30-Minute Snuggle Visit Includes</h2>
        </div>
        <div className="service-grid">
          {serviceItems.map((item) => (
            <article className="service-card" key={item.title}>
              <span className="icon-bubble">
                <item.icon aria-hidden="true" size={28} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="section-heading centered">
          <CircleDollarSign aria-hidden="true" size={22} />
          <h2>Simple & Fair Pricing</h2>
        </div>
        <div className="pricing-grid">
          {pricingCards.map((card) => (
            <article className={`pricing-card ${card.featured ? 'featured' : ''}`} key={card.title}>
              <card.icon aria-hidden="true" size={26} />
              <h3>{card.title}</h3>
              {card.featured && <span className="popular-label">Most popular</span>}
              <strong>{card.price}</strong>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
        <p className="pricing-note">Customized packages available. Additional travel fee applies outside service area.</p>
      </section>

      <BookingSection onBookingCreated={onBookingCreated} />

      <section className="section area-section" id="area">
        <div className="area-copy">
          <div className="section-heading">
            <MapPin aria-hidden="true" size={22} />
            <h2>{SERVICE_AREA.center} Service Area</h2>
          </div>
          <p>
            Serving {SERVICE_AREA.center} and surrounding suburbs within {SERVICE_AREA.radiusKm}km.
            Outside the service area? You can still request a visit and an additional travel fee
            will be confirmed before booking.
          </p>
          <SuburbChecker />
        </div>
        <div className="map-card" aria-label={`Map placeholder showing ${SERVICE_AREA.center} ${SERVICE_AREA.radiusKm}km service area`}>
          <div className="map-grid" />
          <div className="service-ring">
            <span>{SERVICE_AREA.radiusKm}km</span>
          </div>
          <div className="map-pin">
            <MapPin aria-hidden="true" size={30} />
            <strong>{SERVICE_AREA.center}</strong>
          </div>
        </div>
      </section>

      <section className="section testimonials-section" id="reviews">
        <div className="section-heading centered">
          <Heart aria-hidden="true" size={22} />
          <h2>What Cat Parents Say</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <div className="stars" aria-label="5 stars">★★★★★</div>
              <p>“{testimonial.quote}”</p>
              <strong>{testimonial.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-heading centered">
          <MessageCircle aria-hidden="true" size={22} />
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-grid">
          {faqItems.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                {item.question}
                <ChevronDown aria-hidden="true" size={18} />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div>
          <div className="section-heading">
            <Mail aria-hidden="true" size={22} />
            <h2>Get in Touch</h2>
          </div>
          <p>Ready to plan gentle care for your cat? Send a message with your dates and suburb.</p>
        </div>
        <div className="contact-actions">
          <a className="contact-card" href={`mailto:${email}`}>
            <Mail aria-hidden="true" size={24} />
            <span>
              <small>Email</small>
              {email}
            </span>
          </a>
          <a className="contact-card" href={instagramUrl} target="_blank" rel="noreferrer">
            <Instagram aria-hidden="true" size={24} />
            <span>
              <small>Instagram</small>
              {instagramHandle}
            </span>
          </a>
          <a className="primary-button" href={instagramUrl} target="_blank" rel="noreferrer">
            <Instagram aria-hidden="true" size={19} />
            Message on Instagram
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <PawPrint aria-hidden="true" size={18} />
        <span>Snuggles delivered daily. Perth, WA</span>
        <PawPrint aria-hidden="true" size={18} />
      </footer>
    </main>
  );
}

function BookingSection({ onBookingCreated }: { onBookingCreated: (booking: BookingRequest) => void }) {
  const [form, setForm] = useState<BookingRequestInput>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<BookingRequest | null>(null);

  const estimate = calculateBookingEstimate(form);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, type, value } = event.target;
    const field = name as keyof BookingRequestInput;

    setErrors((current) => ({ ...current, [field]: '' }));
    setConfirmation(null);

    if (type === 'checkbox') {
      const target = event.target as HTMLInputElement;
      setForm((current) => ({ ...current, [field]: target.checked }));
      return;
    }

    setForm((current) => ({ ...current, [field]: type === 'number' ? Number(value) : value }));
  };

  const handlePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setForm((current) => ({ ...current, catPhotoName: file?.name ?? '' }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateBooking(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const booking = createBookingRequest(form);
    onBookingCreated(booking);
    setConfirmation(booking);
    setForm(initialForm);
  };

  return (
    <section className="section booking-section" id="booking">
      <div className="booking-heading">
        <div className="section-heading">
          <CalendarDays aria-hidden="true" size={22} />
          <h2>Book a Visit</h2>
        </div>
        <p>Tell us about your cat’s routine. Your request will be checked and confirmed before the booking is locked in.</p>
      </div>

      <div className="booking-layout">
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid two-columns">
            <Field label="Owner name" name="ownerName" error={errors.ownerName} required>
              <input id="ownerName" name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Your full name" required />
            </Field>
            <Field label="Email" name="email" error={errors.email} required>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </Field>
            <Field label="Phone number" name="phone" error={errors.phone} required>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="04XX XXX XXX" required />
            </Field>
            <Field label="Address/suburb" name="addressSuburb" error={errors.addressSuburb} required>
              <input id="addressSuburb" name="addressSuburb" value={form.addressSuburb} onChange={handleChange} placeholder="Southern River or full address" required />
            </Field>
            <Field label="Number of cats" name="numberOfCats" error={errors.numberOfCats} required>
              <input id="numberOfCats" name="numberOfCats" type="number" min="1" value={form.numberOfCats} onChange={handleChange} required />
            </Field>
            <Field label="Cat names" name="catNames" error={errors.catNames} required>
              <input id="catNames" name="catNames" value={form.catNames} onChange={handleChange} placeholder="Milo, Luna" required />
            </Field>
            <Field label="Start date" name="startDate" error={errors.startDate} required>
              <input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            </Field>
            <Field label="End date" name="endDate" error={errors.endDate} required>
              <input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
            </Field>
          </div>

          <div className="form-grid two-columns">
            <Field label="Preferred visit frequency" name="visitFrequency" error={errors.visitFrequency} required>
              <select id="visitFrequency" name="visitFrequency" value={form.visitFrequency} onChange={handleChange}>
                {(Object.keys(VISIT_PLANS) as VisitFrequency[]).map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {VISIT_PLANS[frequency].label} (${VISIT_PLANS[frequency].dailyRate})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Add extra 30 minutes?" name="extraMinutes">
              <div className="radio-row">
                <label>
                  <input
                    checked={form.extraMinutes}
                    id="extraMinutesYes"
                    name="extraMinutes"
                    onChange={() => setForm((current) => ({ ...current, extraMinutes: true }))}
                    type="radio"
                  />
                  Yes
                </label>
                <label>
                  <input
                    checked={!form.extraMinutes}
                    id="extraMinutesNo"
                    name="extraMinutes"
                    onChange={() => setForm((current) => ({ ...current, extraMinutes: false }))}
                    type="radio"
                  />
                  No
                </label>
              </div>
            </Field>
          </div>

          <Field label="Feeding instructions" name="feedingInstructions" error={errors.feedingInstructions} required>
            <textarea
              id="feedingInstructions"
              name="feedingInstructions"
              value={form.feedingInstructions}
              onChange={handleChange}
              placeholder="Food type, portions, schedule, treats..."
              required
            />
          </Field>
          <Field label="Litter instructions" name="litterInstructions" error={errors.litterInstructions} required>
            <textarea
              id="litterInstructions"
              name="litterInstructions"
              value={form.litterInstructions}
              onChange={handleChange}
              placeholder="Litter type, tray location, cleaning preferences..."
              required
            />
          </Field>
          <Field label="Medication/special care notes" name="specialCareNotes">
            <textarea
              id="specialCareNotes"
              name="specialCareNotes"
              value={form.specialCareNotes}
              onChange={handleChange}
              placeholder="Medication, hiding spots, anxiety, door rules, or anything helpful."
            />
          </Field>

          <div className="form-grid two-columns">
            <Field label="Emergency contact" name="emergencyContact" error={errors.emergencyContact} required>
              <input
                id="emergencyContact"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                placeholder="Name and phone number"
                required
              />
            </Field>
            <Field label="Vet details" name="vetDetails" error={errors.vetDetails} required>
              <input
                id="vetDetails"
                name="vetDetails"
                value={form.vetDetails}
                onChange={handleChange}
                placeholder="Clinic name and phone number"
                required
              />
            </Field>
          </div>

          <label className="upload-box">
            <UploadCloud aria-hidden="true" size={26} />
            <span>
              <strong>Upload a cat photo</strong>
              <small>{form.catPhotoName || 'Optional. JPG, PNG, or HEIC name will be saved with the request.'}</small>
            </span>
            <input accept="image/*" onChange={handlePhoto} type="file" />
          </label>

          <label className={`consent-row ${errors.confirmationConsent ? 'has-error' : ''}`}>
            <input
              checked={form.confirmationConsent}
              id="confirmationConsent"
              name="confirmationConsent"
              onChange={handleChange}
              type="checkbox"
            />
            <span>I understand booking is subject to confirmation.</span>
          </label>
          {errors.confirmationConsent && <p className="field-error">{errors.confirmationConsent}</p>}

          <button className="primary-button form-submit" type="submit">
            <PawPrint aria-hidden="true" size={19} />
            Request Booking
          </button>

          {confirmation && (
            <div className="success-message" role="status">
              <CheckCircle2 aria-hidden="true" size={22} />
              <span>
                Thank you, {confirmation.ownerName}. Your request was saved as {confirmation.status.toLowerCase()} with an estimated total of {formatCurrency(confirmation.estimate.total)}.
              </span>
            </div>
          )}
        </form>

        <aside className="estimate-panel" aria-live="polite">
          <div className="estimate-title">
            <span>Estimated total</span>
            <CircleDollarSign aria-hidden="true" size={24} />
          </div>
          <dl>
            <div>
              <dt>Duration</dt>
              <dd>{pluralize(estimate.days, 'day')}</dd>
            </div>
            <div>
              <dt>Visits per day</dt>
              <dd>{estimate.visitsPerDay}</dd>
            </div>
            <div>
              <dt>Extra 30 mins</dt>
              <dd>{form.extraMinutes ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
          <strong>{formatCurrency(estimate.total)}</strong>
          <p>Final price may vary if outside service area or for customized packages.</p>
        </aside>
      </div>
    </section>
  );
}

function Field({
  children,
  error,
  label,
  name,
  required,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className={`form-field ${error ? 'has-error' : ''}`} htmlFor={name}>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

function SuburbChecker() {
  const [value, setValue] = useState('');
  const result = !value.trim()
    ? 'Enter a suburb or postcode for a quick guide.'
    : isLikelyInServiceArea(value)
      ? 'Looks likely within the usual service area. Final travel will be confirmed.'
      : 'Please request a booking and travel fee will be confirmed if needed.';

  return (
    <div className="suburb-checker">
      <label htmlFor="suburb-check">Check your suburb</label>
      <input
        id="suburb-check"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Suburb or postcode"
      />
      <p>{result}</p>
    </div>
  );
}

function AdminDashboard({
  bookings,
  onStatusChange,
}: {
  bookings: BookingRequest[];
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  const [filter, setFilter] = useState<BookingStatus | 'All'>('All');
  const filteredBookings = filter === 'All' ? bookings : bookings.filter((booking) => booking.status === filter);
  const statusCounts = bookings.reduce(
    (counts, booking) => {
      counts[booking.status] += 1;
      return counts;
    },
    { Pending: 0, Confirmed: 0, Completed: 0 } as Record<BookingStatus, number>,
  );

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <h1>Booking Requests</h1>
          <p>View customer details, dates, estimates, care notes, and keep each request moving.</p>
        </div>
        <a className="secondary-button" href="#booking">
          <PawPrint aria-hidden="true" size={18} />
          New request
        </a>
      </section>

      <section className="admin-stats" aria-label="Booking summary">
        <StatCard label="Total requests" value={bookings.length} />
        {BOOKING_STATUSES.map((status) => (
          <StatCard key={status} label={status} value={statusCounts[status]} />
        ))}
      </section>

      <section className="admin-board">
        <div className="admin-toolbar">
          <div>
            <h2>Customer Requests</h2>
            <p>Saved locally in this browser for easy owner review.</p>
          </div>
          <label>
            Status
            <select value={filter} onChange={(event) => setFilter(event.target.value as BookingStatus | 'All')}>
              <option value="All">All</option>
              {BOOKING_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <LineCat className="empty-cat" />
            <h3>No booking requests yet</h3>
            <p>Customer requests submitted from the booking form will appear here with care notes and estimates.</p>
          </div>
        ) : (
          <div className="booking-table-wrap">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Dates</th>
                  <th>Cats</th>
                  <th>Visit plan</th>
                  <th>Estimate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>{booking.ownerName}</strong>
                      <span>{booking.email}</span>
                      <span>{booking.phone}</span>
                      <span>{booking.addressSuburb}</span>
                    </td>
                    <td>
                      <strong>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</strong>
                      <span>{pluralize(booking.estimate.days, 'day')}</span>
                      <span>Submitted {formatDateTime(booking.submittedAt)}</span>
                    </td>
                    <td>
                      <strong>{booking.catNames}</strong>
                      <span>{pluralize(booking.numberOfCats, 'cat')}</span>
                      {booking.catPhotoName && <span>Photo: {booking.catPhotoName}</span>}
                    </td>
                    <td>
                      <strong>{VISIT_PLANS[booking.visitFrequency].label}</strong>
                      <span>{booking.extraMinutes ? 'Extra 30 mins added' : 'Standard 30 mins'}</span>
                      <span>{booking.specialCareNotes || 'No special care notes'}</span>
                    </td>
                    <td>
                      <strong>{formatCurrency(booking.estimate.total)}</strong>
                      <span>{booking.feedingInstructions}</span>
                      <span>{booking.litterInstructions}</span>
                    </td>
                    <td>
                      <select
                        className={`status-select ${booking.status.toLowerCase()}`}
                        value={booking.status}
                        onChange={(event) => onStatusChange(booking.id, event.target.value as BookingStatus)}
                        aria-label={`Status for ${booking.ownerName}`}
                      >
                        {BOOKING_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <span>{booking.emergencyContact}</span>
                      <span>{booking.vetDetails}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function MiniCard({
  icon: Icon,
  text,
  title,
}: {
  icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>;
  text: string;
  title: string;
}) {
  return (
    <article className="mini-card">
      <Icon aria-hidden={true} size={23} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function LineCat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 116" fill="none" aria-hidden="true">
      <path
        d="M32 94c-14-9-20-23-18-41 2-19 10-33 24-42l11 15 16-12c17 10 27 27 29 50 10-8 20-9 29-3 8 7 8 19 1 27-7 8-20 10-35 4-14 18-39 20-57 2Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 48c0 4-3 7-7 7s-7-3-7-7m42 0c0 4-3 7-7 7s-7-3-7-7M49 69c8 6 17 6 26 0M92 80c10 7 20 8 28 1M22 79c-9 8-15 18-18 29"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getRouteFromHash(): Route {
  return window.location.hash === '#admin' ? 'admin' : 'home';
}

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatDate(value: string) {
  const date = parseLocalDate(value);
  return date ? dateFormatter.format(date) : 'Not set';
}

function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}
