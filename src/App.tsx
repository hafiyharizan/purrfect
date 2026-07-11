import {
  Calculator,
  Calendar,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Heart,
  Instagram,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  PawPrint,
  Search,
  Settings,
  ShieldCheck,
  Timer,
  UploadCloud,
  Users,
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

const landingLinks = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Services', '#services'],
  ['Pricing', '#pricing'],
  ['Booking', '#booking'],
  ['Area', '#area'],
  ['Reviews', '#reviews'],
  ['FAQ', '#faq'],
  ['Contact', '#contact'],
];

const trustChips = [
  '30-minute snuggle visits',
  'Daily photo & video updates',
  'Trusted, gentle and reliable',
];

const serviceItems = [
  { icon: FoodBowlIcon, title: 'Feeding and fresh water' },
  { icon: LitterScoopIcon, title: 'Litter cleaning' },
  { icon: YarnIcon, title: 'Snuggles and playtime' },
  { icon: PhotoIcon, title: 'Daily photo & video updates' },
  { icon: BroomIcon, title: 'Tidy up mess made by pet' },
];

const pricingCards = [
  {
    title: VISIT_PLANS.single.label,
    price: `$${VISIT_PLANS.single.dailyRate}`,
    unit: 'per day',
    detail: '1 x 30-minute visit',
    icon: Clock3,
  },
  {
    title: VISIT_PLANS.twice.label,
    price: `$${VISIT_PLANS.twice.dailyRate}`,
    unit: 'per day',
    detail: '2 x 30-minute visits',
    icon: PawPrint,
    featured: true,
  },
  {
    title: 'Additional 30 minutes',
    price: `$${EXTRA_MINUTES_RATE_PER_VISIT}`,
    unit: 'per visit',
    detail: 'Add extra snuggles',
    icon: Timer,
  },
];

const testimonials = [
  {
    name: 'Jess, Southern River',
    quote:
      'Snuggle Cat Sitter looked after my two furbabies while we were overseas. Daily updates made me feel so at ease!',
  },
  {
    name: 'Amanda, Harrisdale',
    quote:
      'So gentle, reliable and thoughtful. My shy boy was warmed up straight away and the litter area was spotless.',
  },
  {
    name: 'Daniel, Piara Waters',
    quote:
      'Our go-to cat sitter! The photos and videos are the highlight of our trips. Everything felt easy and trustworthy.',
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

const adminFeatures = [
  { icon: ShieldCheck, title: 'Insured & reliable', text: 'Your cat is in safe and caring hands.' },
  { icon: Heart, title: 'Personalised care', text: 'Every visit tailored to your cat’s needs.' },
  { icon: Camera, title: 'Daily updates', text: 'Photos & videos so you never miss a moment.' },
  { icon: MapPin, title: 'Local & trusted', text: 'Proudly caring for cats in Perth.' },
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

  if (route === 'admin') {
    return <AdminDashboard bookings={bookings} onStatusChange={handleStatusChange} />;
  }

  return <LandingPage onBookingCreated={handleBookingCreated} />;
}

function LandingPage({ onBookingCreated }: { onBookingCreated: (booking: BookingRequest) => void }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Snuggle Cat Sitter home">
          <LineCat className="brand-cat" />
          <span>
            <strong>Snuggle</strong>
            <small>Cat Sitter</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          {landingLinks.map(([label, href]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#booking">
          <PawPrint aria-hidden="true" size={17} />
          Book a Visit
        </a>
      </header>

      <main>
        <section className="hero-section" id="home">
          <FloralCluster className="floral hero-floral-bl" />
          <FloralCluster className="floral hero-floral-tr" />
          <div className="hero-copy">
            <h1>
              Loving Cat
              <br />
              Sitting in Perth
            </h1>
            <p>Daily snuggles, feeding, litter care, and photo updates while you’re away.</p>
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
              {trustChips.map((text) => (
                <span key={text}>
                  <i className="chip-icon">
                    <PawPrint aria-hidden="true" size={15} />
                  </i>
                  {text}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <img src={heroCat} alt="Watercolor illustration of a fluffy cat with lavender flowers" />
            <LineCat className="hero-line-cat" />
            <Heart className="hero-heart" aria-hidden="true" size={22} />
          </div>
        </section>

        <section className="section about-section" id="about">
          <FloralCluster className="floral about-floral" />
          <div className="about-grid">
            <div className="about-copy">
              <div className="section-heading">
                <h2>About Snuggle Cat Sitter</h2>
                <Heart aria-hidden="true" size={20} />
              </div>
              <p>
                Snuggle Cat Sitter offers loving, reliable in-home care for your cat while
                you’re away. Whether it’s a holiday, work trip or a short getaway, your cat
                will get gentle care, playtime, snuggles and daily updates so you can relax
                with peace of mind.
              </p>
              <div className="about-cards" aria-label="Care qualities">
                <MiniCard icon={Heart} title="Personalised care" text="Every cat is unique." />
                <MiniCard icon={ShieldCheck} title="Safe & trustworthy" text="Insured and experienced." />
                <MiniCard icon={MapPin} title="Local & convenient" text={`${SERVICE_AREA.center} & surrounding suburbs.`} />
              </div>
            </div>
            <div className="about-photo">
              <img src={heroCat} alt="A happy, well-cared-for cat" />
              <PawPrint className="about-paw" aria-hidden="true" size={22} />
            </div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-heading centered">
            <h2>30-Minute Snuggle Visit Includes</h2>
          </div>
          <div className="service-grid">
            {serviceItems.map((item) => (
              <article className="service-card" key={item.title}>
                <span className="icon-bubble">
                  <item.icon />
                </span>
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section pricing-section" id="pricing">
          <FloralCluster className="floral pricing-floral-left" />
          <FloralCluster className="floral pricing-floral-right" />
          <div className="section-heading centered">
            <h2>Simple & Fair Pricing</h2>
            <PawPrint aria-hidden="true" size={20} />
          </div>
          <div className="pricing-grid">
            {pricingCards.map((card) => (
              <article className={`pricing-card ${card.featured ? 'featured' : ''}`} key={card.title}>
                {card.featured && <span className="popular-label">Most Popular</span>}
                <h3>{card.title}</h3>
                <strong>{card.price}</strong>
                <span className="price-unit">{card.unit}</span>
                <p>
                  <card.icon aria-hidden="true" size={15} />
                  {card.detail}
                </p>
              </article>
            ))}
          </div>
          <p className="pricing-note">
            Customized packages available — just ask! <Heart aria-hidden="true" size={14} />
          </p>
        </section>

        <BookingSection onBookingCreated={onBookingCreated} />

        <section className="section area-section" id="area">
          <div className="area-copy">
            <div className="section-heading">
              <MapPin aria-hidden="true" size={20} />
              <h2>Our Service Area</h2>
            </div>
            <p>
              {SERVICE_AREA.center} and surrounding suburbs within {SERVICE_AREA.radiusKm}km.
            </p>
            <p className="area-note">Outside this area? Additional travel fee applies.</p>
          </div>
          <div className="map-card" aria-label={`Map placeholder showing ${SERVICE_AREA.center} ${SERVICE_AREA.radiusKm}km service area`}>
            <div className="map-grid" />
            <div className="service-ring">
              <span>{SERVICE_AREA.radiusKm}km</span>
            </div>
            <div className="map-pin">
              <MapPin aria-hidden="true" size={28} />
              <strong>{SERVICE_AREA.center}</strong>
            </div>
          </div>
          <SuburbChecker />
        </section>

        <section className="section testimonials-section" id="reviews">
          <div className="section-heading centered">
            <h2>What Cat Parents Say</h2>
            <Heart aria-hidden="true" size={20} />
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" key={testimonial.name}>
                <div className="stars" aria-label="5 stars">★★★★★</div>
                <p>“{testimonial.quote}”</p>
                <strong>— {testimonial.name}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading centered">
            <h2>Frequently Asked Questions</h2>
            <PawPrint aria-hidden="true" size={20} />
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
          <div className="contact-inner">
            <div className="section-heading">
              <PawPrint aria-hidden="true" size={20} />
              <h2>Get in Touch</h2>
            </div>
            <div className="contact-actions">
              <a className="contact-card" href={`mailto:${email}`}>
                <Mail aria-hidden="true" size={22} />
                <span>
                  <small>Email</small>
                  {email}
                </span>
              </a>
              <a className="contact-card" href={instagramUrl} target="_blank" rel="noreferrer">
                <Instagram aria-hidden="true" size={22} />
                <span>
                  <small>Instagram</small>
                  {instagramHandle}
                </span>
              </a>
              <a className="primary-button contact-cta" href={instagramUrl} target="_blank" rel="noreferrer">
                <Instagram aria-hidden="true" size={19} />
                <span>
                  Message on Instagram
                  <small>Let’s chat!</small>
                </span>
              </a>
            </div>
          </div>
          <div className="contact-art">
            <FloralCluster className="floral contact-floral" />
            <SleepingCat className="sleeping-cat" />
            <p className="script-text">
              Where cats are loved like family <Heart aria-hidden="true" size={16} />
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <PawPrint aria-hidden="true" size={17} />
        <span>Snuggles delivered daily. Perth, WA</span>
        <Heart aria-hidden="true" size={16} />
        <a className="footer-admin" href="#admin">Admin</a>
      </footer>
    </div>
  );
}

function BookingSection({ onBookingCreated }: { onBookingCreated: (booking: BookingRequest) => void }) {
  const [form, setForm] = useState<BookingRequestInput>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<BookingRequest | null>(null);

  const estimate = calculateBookingEstimate(form);
  const plan = VISIT_PLANS[form.visitFrequency];
  const ratePerDay = plan.dailyRate + (form.extraMinutes ? EXTRA_MINUTES_RATE_PER_VISIT * plan.visitsPerDay : 0);

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

    setForm((current) => ({
      ...current,
      [field]: type === 'number' || field === 'numberOfCats' ? Number(value) : value,
    }));
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
        <h2>
          Book a Visit <Heart aria-hidden="true" size={22} />
        </h2>
        <p>We can’t wait to meet your kitty!</p>
        <SittingCat className="booking-cat" />
      </div>

      <div className="booking-layout">
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid two-columns">
            <Field label="Owner Name" name="ownerName" error={errors.ownerName} required>
              <input id="ownerName" name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Enter your name" required />
            </Field>
            <Field label="Email Address" name="email" error={errors.email} required>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </Field>
            <Field label="Phone Number" name="phone" error={errors.phone} required>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="04XX XXX XXX" required />
            </Field>
            <Field label="Suburb / Address" name="addressSuburb" error={errors.addressSuburb} required>
              <input id="addressSuburb" name="addressSuburb" value={form.addressSuburb} onChange={handleChange} placeholder="Enter suburb or full address" required />
            </Field>
            <Field label="Number of Cats" name="numberOfCats" error={errors.numberOfCats} required>
              <select id="numberOfCats" name="numberOfCats" value={form.numberOfCats} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6].map((count) => (
                  <option key={count} value={count}>
                    {count === 6 ? '6+' : count}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cat Names" name="catNames" error={errors.catNames} required>
              <input id="catNames" name="catNames" value={form.catNames} onChange={handleChange} placeholder="e.g. Milo, Luna" required />
            </Field>
            <Field label="Start Date" name="startDate" error={errors.startDate} required>
              <input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            </Field>
            <Field label="End Date" name="endDate" error={errors.endDate} required>
              <input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
            </Field>
            <Field label="Preferred Visit Frequency" name="visitFrequency" error={errors.visitFrequency} required>
              <select id="visitFrequency" name="visitFrequency" value={form.visitFrequency} onChange={handleChange}>
                {(Object.keys(VISIT_PLANS) as VisitFrequency[]).map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {VISIT_PLANS[frequency].label} (${VISIT_PLANS[frequency].dailyRate})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Add Extra 30 Minutes?" name="extraMinutes">
              <div className="radio-row">
                <label>
                  <input
                    checked={form.extraMinutes}
                    id="extraMinutesYes"
                    name="extraMinutes"
                    onChange={() => setForm((current) => ({ ...current, extraMinutes: true }))}
                    type="radio"
                  />
                  Yes <small>(+${EXTRA_MINUTES_RATE_PER_VISIT} per visit)</small>
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

          <Field label="Feeding Instructions" name="feedingInstructions" error={errors.feedingInstructions} required>
            <textarea
              id="feedingInstructions"
              name="feedingInstructions"
              value={form.feedingInstructions}
              onChange={handleChange}
              placeholder="Tell us about food type, portion, schedule..."
              required
            />
          </Field>
          <Field label="Litter Instructions" name="litterInstructions" error={errors.litterInstructions} required>
            <textarea
              id="litterInstructions"
              name="litterInstructions"
              value={form.litterInstructions}
              onChange={handleChange}
              placeholder="Litter type, location, preferences..."
              required
            />
          </Field>
          <Field label="Medication / Special Care Notes" name="specialCareNotes">
            <textarea
              id="specialCareNotes"
              name="specialCareNotes"
              value={form.specialCareNotes}
              onChange={handleChange}
              placeholder="Any medication, health or special care we should know..."
            />
          </Field>

          <div className="form-grid two-columns">
            <Field label="Emergency Contact" name="emergencyContact" error={errors.emergencyContact} required>
              <input
                id="emergencyContact"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                placeholder="Name and phone number"
                required
              />
            </Field>
            <Field label="Vet Details" name="vetDetails" error={errors.vetDetails} required>
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

          <span className="upload-label">Upload a Photo of Your Cat (optional)</span>
          <label className="upload-box">
            <UploadCloud aria-hidden="true" size={26} />
            <span>
              <strong>{form.catPhotoName || 'Click to upload or drag and drop'}</strong>
              <small>JPG, PNG up to 5MB</small>
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
            <span>I understand booking is subject to confirmation. <em>*</em></span>
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

        <div className="booking-side">
          <aside className="estimate-panel" aria-live="polite">
            <div className="estimate-title">
              <span>Estimated Total</span>
              <Calculator aria-hidden="true" size={22} />
            </div>
            <dl>
              <div>
                <dt>Duration</dt>
                <dd>{pluralize(estimate.days, 'day')}</dd>
              </div>
              <div>
                <dt>Visits per day</dt>
                <dd>{pluralize(estimate.visitsPerDay, 'visit')}</dd>
              </div>
              <div>
                <dt>Extra 30 mins</dt>
                <dd>{form.extraMinutes ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt>Rate per day</dt>
                <dd>${ratePerDay}</dd>
              </div>
            </dl>
            <span className="estimate-label">Estimated total</span>
            <strong>{formatCurrency(estimate.total)}</strong>
            <p>Final price may vary if outside service area or for customized packages.</p>
          </aside>
          <SittingCat className="side-cat" />
          <FlowerSprig className="flower side-flower" />
        </div>
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
  const [result, setResult] = useState<string | null>(null);

  const handleCheck = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(
      !value.trim()
        ? 'Please enter a suburb or postcode first.'
        : isLikelyInServiceArea(value)
          ? 'Looks likely within the usual service area. Final travel will be confirmed.'
          : 'Please request a booking and travel fee will be confirmed if needed.',
    );
  };

  return (
    <form className="suburb-checker" onSubmit={handleCheck}>
      <h3>Check Your Suburb</h3>
      <input
        aria-label="Suburb or postcode"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setResult(null);
        }}
        placeholder="Enter suburb or postcode"
      />
      <button className="primary-button" type="submit">Check</button>
      {result && <p>{result}</p>}
    </form>
  );
}

const ADMIN_PAGE_SIZE = 6;

type DateFilter = 'all' | 'upcoming' | 'past';

function AdminDashboard({
  bookings,
  onStatusChange,
}: {
  bookings: BookingRequest[];
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayNumbers = new Map(
    bookings.map((booking, index) => [booking.id, 1000 + bookings.length - index]),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== 'All' && booking.status !== statusFilter) {
      return false;
    }

    if (dateFilter !== 'all') {
      const end = parseLocalDate(booking.endDate);
      const isPast = !!end && end.getTime() < today.getTime();
      if (dateFilter === 'past' ? !isPast : isPast) {
        return false;
      }
    }

    if (normalizedQuery) {
      const haystack = `${booking.ownerName} ${booking.email} ${booking.addressSuburb} ${booking.catNames}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filteredBookings.length / ADMIN_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * ADMIN_PAGE_SIZE;
  const pageBookings = filteredBookings.slice(pageStart, pageStart + ADMIN_PAGE_SIZE);

  const applyFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const setStatus = applyFilter(setStatusFilter);
  const setDates = applyFilter(setDateFilter);
  const setSearch = applyFilter(setQuery);

  const handleExport = () => {
    const header = [
      'ID', 'Owner', 'Email', 'Phone', 'Suburb', 'Cats', 'Cat names', 'Start', 'End',
      'Visits/day', 'Extra 30 mins', 'Estimated total', 'Status', 'Submitted',
    ];
    const rows = filteredBookings.map((booking) => [
      `#${displayNumbers.get(booking.id)}`,
      booking.ownerName,
      booking.email,
      booking.phone,
      booking.addressSuburb,
      booking.numberOfCats,
      booking.catNames,
      booking.startDate,
      booking.endDate,
      VISIT_PLANS[booking.visitFrequency].visitsPerDay,
      booking.extraMinutes ? 'Yes' : 'No',
      booking.estimate.total,
      booking.status,
      booking.submittedAt,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'booking-requests.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="brand admin-brand" href="#home" aria-label="Snuggle Cat Sitter home">
          <LineCat className="brand-cat" />
          <span>
            <strong>Snuggle</strong>
            <small>Cat Sitter</small>
          </span>
        </a>
        <nav className="side-nav" aria-label="Admin navigation">
          <span className="side-link"><LayoutDashboard aria-hidden="true" size={18} />Dashboard</span>
          <span className="side-link active"><CalendarDays aria-hidden="true" size={18} />Bookings</span>
          <span className="side-link"><Calendar aria-hidden="true" size={18} />Calendar</span>
          <span className="side-link"><Users aria-hidden="true" size={18} />Clients</span>
          <span className="side-link"><MessageCircle aria-hidden="true" size={18} />Messages</span>
          <span className="side-link"><Settings aria-hidden="true" size={18} />Settings</span>
        </nav>
        <a className="side-link logout" href="#home">
          <LogOut aria-hidden="true" size={18} />
          Log out
        </a>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <h1>Booking Requests</h1>
          <button className="primary-button export-button" type="button" onClick={handleExport}>
            <Download aria-hidden="true" size={17} />
            Export
          </button>
        </header>

        <div className="admin-board">
          <div className="admin-filters">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatus(event.target.value as BookingStatus | 'All')}
            >
              <option value="All">All Status</option>
              {BOOKING_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              aria-label="Filter by dates"
              value={dateFilter}
              onChange={(event) => setDates(event.target.value as DateFilter)}
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
            <label className="admin-search">
              <Search aria-hidden="true" size={16} />
              <input
                value={query}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email or suburb..."
              />
            </label>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <LineCat className="empty-cat" />
              <h3>No booking requests {bookings.length > 0 ? 'match your filters' : 'yet'}</h3>
              <p>Customer requests submitted from the booking form will appear here with care notes and estimates.</p>
            </div>
          ) : (
            <>
              <div className="booking-table-wrap">
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Dates</th>
                      <th>Visits / Day</th>
                      <th>Est. Total</th>
                      <th>Status</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageBookings.map((booking) => (
                      <BookingRow
                        key={booking.id}
                        booking={booking}
                        displayNumber={displayNumbers.get(booking.id)!}
                        expanded={expandedId === booking.id}
                        onToggle={() => setExpandedId((current) => (current === booking.id ? null : booking.id))}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                <div className="page-buttons">
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    <ChevronLeft aria-hidden="true" size={16} />
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={pageNumber === currentPage ? 'active' : ''}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    <ChevronRight aria-hidden="true" size={16} />
                  </button>
                </div>
                <span>
                  Showing {pageStart + 1} to {pageStart + pageBookings.length} of {filteredBookings.length}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="admin-features" aria-label="Why cat parents trust us">
          {adminFeatures.map((feature) => (
            <article key={feature.title}>
              <span className="icon-bubble small">
                <feature.icon aria-hidden="true" size={20} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingRow({
  booking,
  displayNumber,
  expanded,
  onToggle,
  onStatusChange,
}: {
  booking: BookingRequest;
  displayNumber: number;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  const plan = VISIT_PLANS[booking.visitFrequency];

  return (
    <>
      <tr className={expanded ? 'expanded' : ''}>
        <td>
          <button className="row-toggle" type="button" onClick={onToggle} aria-expanded={expanded}>
            <ChevronDown aria-hidden="true" size={14} />
            #{displayNumber}
          </button>
        </td>
        <td>
          <strong>{booking.ownerName}</strong>
          <span>{booking.email}</span>
        </td>
        <td>
          <strong>{formatDateShort(booking.startDate)} – {formatDateShort(booking.endDate)}</strong>
          <span>({pluralize(booking.estimate.days, 'day')})</span>
        </td>
        <td>
          <strong>{pluralize(plan.visitsPerDay, 'visit')}</strong>
          {booking.extraMinutes && <span>+ 30 mins</span>}
        </td>
        <td>
          <strong>{formatCurrency(booking.estimate.total)}</strong>
        </td>
        <td>
          <select
            className={`status-pill ${booking.status.toLowerCase()}`}
            value={booking.status}
            onChange={(event) => onStatusChange(booking.id, event.target.value as BookingStatus)}
            aria-label={`Status for ${booking.ownerName}`}
          >
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </td>
        <td>
          <span>{formatDateTime(booking.updatedAt)}</span>
        </td>
      </tr>
      {expanded && (
        <tr className="detail-row">
          <td colSpan={7}>
            <dl>
              <div><dt>Phone</dt><dd>{booking.phone}</dd></div>
              <div><dt>Suburb / Address</dt><dd>{booking.addressSuburb}</dd></div>
              <div><dt>Cats</dt><dd>{booking.catNames} ({pluralize(booking.numberOfCats, 'cat')})</dd></div>
              <div><dt>Feeding</dt><dd>{booking.feedingInstructions}</dd></div>
              <div><dt>Litter</dt><dd>{booking.litterInstructions}</dd></div>
              <div><dt>Special care</dt><dd>{booking.specialCareNotes || 'No special care notes'}</dd></div>
              <div><dt>Emergency contact</dt><dd>{booking.emergencyContact}</dd></div>
              <div><dt>Vet details</dt><dd>{booking.vetDetails}</dd></div>
              {booking.catPhotoName && <div><dt>Photo</dt><dd>{booking.catPhotoName}</dd></div>}
            </dl>
          </td>
        </tr>
      )}
    </>
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
      <span className="icon-bubble small">
        <Icon aria-hidden={true} size={20} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
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

function SittingCat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" aria-hidden="true">
      <path
        d="M36 32c-2-10 1-18 6-24l12 12c4-1 8-1 12 0l12-12c5 6 8 14 6 24 6 10 8 22 8 36 0 28-14 44-32 44S28 96 28 68c0-14 2-26 8-36Z"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M47 44c2 2 5 2 7 0m12 0c2 2 5 2 7 0M55 55h10M52 62c5 4 11 4 16 0"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M92 108c14 2 22-6 19-19M46 112v12m28-12v12"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SleepingCat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 100" fill="none" aria-hidden="true">
      <path
        d="M24 68c0-24 22-42 54-42 30 0 56 16 56 40 0 16-12 26-30 26H52c-17 0-28-10-28-24Z"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M96 28l7-13 9 11m8 2 9-10 5 13"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M103 52c3 3 7 3 10 0m14 0c3 3 7 3 10 0M26 76c9 10 26 13 39 7"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FlowerSprig({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 90 110" fill="none" aria-hidden="true">
      <path d="M45 108c-4-26-2-48 8-70M45 108c2-20-2-38-14-52" stroke="#b7d3b0" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M38 74c-8-1-13-6-15-13 8-1 14 2 17 9M56 60c8-2 12-8 13-15-8 0-14 4-16 11" fill="#cfe3c8" />
      <g fill="#f3b7d3">
        <ellipse cx="53" cy="26" rx="7" ry="11" />
        <ellipse cx="53" cy="26" rx="7" ry="11" transform="rotate(72 53 26)" />
        <ellipse cx="53" cy="26" rx="7" ry="11" transform="rotate(144 53 26)" />
        <ellipse cx="53" cy="26" rx="7" ry="11" transform="rotate(216 53 26)" />
        <ellipse cx="53" cy="26" rx="7" ry="11" transform="rotate(288 53 26)" />
      </g>
      <circle cx="53" cy="26" r="5" fill="#e8a0c4" />
      <g fill="#d9c4ec">
        <ellipse cx="28" cy="46" rx="5" ry="8" />
        <ellipse cx="28" cy="46" rx="5" ry="8" transform="rotate(72 28 46)" />
        <ellipse cx="28" cy="46" rx="5" ry="8" transform="rotate(144 28 46)" />
        <ellipse cx="28" cy="46" rx="5" ry="8" transform="rotate(216 28 46)" />
        <ellipse cx="28" cy="46" rx="5" ry="8" transform="rotate(288 28 46)" />
      </g>
      <circle cx="28" cy="46" r="3.6" fill="#b493d8" />
    </svg>
  );
}

function Flower({
  x,
  y,
  scale = 1,
  petal,
  center,
}: {
  x: number;
  y: number;
  scale?: number;
  petal: string;
  center: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g fill={petal}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="0" cy="-13" rx="7.5" ry="12" transform={`rotate(${angle})`} />
        ))}
      </g>
      <circle r="5.4" fill={center} />
    </g>
  );
}

function FloralCluster({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 210 220" fill="none" aria-hidden="true">
      <g opacity="0.85" stroke="#bcd7b4" strokeWidth="3" strokeLinecap="round">
        <path d="M104 214c-6-42 0-78 18-108" />
        <path d="M104 214c2-30-8-58-28-80" />
      </g>
      <g opacity="0.9">
        <path d="M92 150c-16-2-26-12-30-27 16-1 29 7 33 23Z" fill="#cfe3c8" />
        <path d="M120 120c15-7 22-19 21-34-14 3-25 13-27 29Z" fill="#d7e8d0" />
        <path d="M82 182c-13-3-20-11-22-24 12 0 22 7 25 19Z" fill="#c7dfbf" />
      </g>
      <circle cx="158" cy="104" r="7" fill="#f2bcd6" />
      <circle cx="52" cy="150" r="6" fill="#dcc6ee" />
      <circle cx="150" cy="150" r="5" fill="#f7cfe0" />
      <Flower x={128} y={62} scale={1.5} petal="#f4b4d2" center="#e785ba" />
      <Flower x={70} y={96} scale={1.15} petal="#dcc6ee" center="#b493d8" />
      <Flower x={116} y={126} scale={0.95} petal="#f8d2e2" center="#ec9fc6" />
    </svg>
  );
}

function FoodBowlIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 34h30l-4 14c-1 3-3 5-6 5h-10c-3 0-5-2-6-5l-4-14Z" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 34h36" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M20 26c0-3 3-5 7-5s7 2 7 5M46 42h10l-2 8c-1 2-2 3-4 3h-1" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46 20c3-4 8-4 10 0-2 4-7 4-10 0Zm10 0 4-3m-4 3 4 3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LitterScoopIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="32" width="32" height="18" rx="5" stroke="currentColor" strokeWidth="3.2" />
      <path d="M16 41h.1m8 4h.1m6-5h.1" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 34 56 16m-14 8 8 6c3 2 7-1 6-5l-2-7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function YarnIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="27" cy="36" r="15" stroke="currentColor" strokeWidth="3.2" />
      <path d="M14 30c8-4 18-4 26 0M13 41c9 4 19 4 27 0M27 21c-5 9-5 21 0 30" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M42 36c8 0 12 4 12 9s-5 8-9 6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="20" width="48" height="32" rx="7" stroke="currentColor" strokeWidth="3.2" />
      <path d="M22 20l4-7h12l4 7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="36" r="9" stroke="currentColor" strokeWidth="3.2" />
      <path d="M47 28h.1" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" />
    </svg>
  );
}

function BroomIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M40 8 26 30" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M17 44c2-8 5-12 9-14l10 7c-1 5-4 9-10 13l-11 6c-2 1-3-1-2-3l4-9Z" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 46l-4 7m10-4-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M48 34h.1m4 10h.1m-8 8h.1" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
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

const dateShortFormatter = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatDateShort(value: string) {
  const date = parseLocalDate(value);
  return date ? dateShortFormatter.format(date) : 'Not set';
}

function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}
