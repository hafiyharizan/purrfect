import Link from 'next/link';
import {
  Camera,
  ChevronDown,
  Clock3,
  Heart,
  Instagram,
  Mail,
  MapPin,
  PawPrint,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import { EXTRA_MINUTES_RATE_PER_VISIT, SERVICE_AREA, VISIT_PLANS } from '@/lib/bookings';
import { BookingSection } from './_components/BookingSection';
import { SuburbChecker } from './_components/SuburbChecker';
import { MiniCard } from './_components/ui';
import {
  BroomIcon,
  FloralCluster,
  FoodBowlIcon,
  LineCat,
  LitterScoopIcon,
  PhotoIcon,
  SleepingCat,
  YarnIcon,
} from './_components/icons';

const email = 'iamfarah19@outlook.com';
const instagramHandle = '@snuggle.cat.sitter';
const instagramUrl = 'https://www.instagram.com/snuggle.cat.sitter';

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

export default function HomePage() {
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero-watercolor-cat.png" alt="Watercolor illustration of a fluffy cat with lavender flowers" />
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero-watercolor-cat.png" alt="A happy, well-cared-for cat" />
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

        <BookingSection />

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
        <Link className="footer-admin" href="/admin">Admin</Link>
      </footer>
    </div>
  );
}
