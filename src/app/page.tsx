import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Utensils,
  Trash2,
  Heart,
  Camera,
  Sparkles,
  MapPin,
  Cat,
  PawPrint,
  HeartHandshake,
  Mail,
} from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    icon: Utensils,
    title: "Feeding & fresh water",
    description: "Meals served on schedule with a clean bowl of fresh water every visit.",
  },
  {
    icon: Trash2,
    title: "Litter cleaning",
    description: "A tidy, scooped litter box so your cat always has a fresh spot.",
  },
  {
    icon: Heart,
    title: "Snuggles & playtime",
    description: "One-on-one cuddles and play, tailored to your cat's personality.",
  },
  {
    icon: Camera,
    title: "Daily photos & video updates",
    description: "Adorable proof-of-life sent straight to you, every single visit.",
  },
  {
    icon: Sparkles,
    title: "Tidy up mess made by pet",
    description: "Spills, toys, and stray fur cleaned up before we head out.",
  },
];

const PRICING = [
  { label: "Single visit / day", price: "$20" },
  { label: "Two visits / day", price: "$35" },
  { label: "Additional 30 mins / visit", price: "$10" },
];

const WHY_US = [
  "Personal, one-on-one attention every visit",
  "Daily photo & video updates while you're away",
  "Customized packages built around your cat's routine",
  "A local Perth sitter you can trust with a spare key",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <PawPrint className="h-6 w-6 text-secondary rotate-[-15deg]" />
              <h1 className="text-5xl sm:text-6xl font-display font-bold leading-[1.1] text-primary">
                Snuggle Cat Sitter
              </h1>
              <PawPrint className="h-6 w-6 text-secondary rotate-[15deg]" />
            </div>
            <p className="font-serif italic text-xl sm:text-2xl text-foreground/80">
              Snuggles delivered daily. Perth, WA.
            </p>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              In-home cat sitting with feeding, litter cleaning, snuggles &amp;
              playtime, and daily photo &amp; video updates &mdash; so your
              cat feels right at home while you&apos;re away.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg">Book a Visit</Button>
              </Link>
              <Link href="#pricing">
                <Button variant="outline" size="lg">
                  See Pricing
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -top-3 -left-3 h-4 w-4 rotate-45 bg-primary/40 rounded-sm" />
            <div className="pointer-events-none absolute -top-3 -right-3 h-4 w-4 rotate-45 bg-primary/40 rounded-sm" />
            <div className="pointer-events-none absolute -bottom-3 -left-3 h-4 w-4 rotate-45 bg-primary/40 rounded-sm" />
            <div className="pointer-events-none absolute -bottom-3 -right-3 h-4 w-4 rotate-45 bg-primary/40 rounded-sm" />
            <div className="aspect-[4/3] rounded-[2rem] border-2 border-primary/20 bg-watercolor overflow-hidden flex items-center justify-center gap-2">
              <Cat className="h-28 w-28 sm:h-36 sm:w-36 text-primary/70" strokeWidth={1.25} />
              <Cat className="h-20 w-20 sm:h-24 sm:w-24 text-secondary/80 -ml-6 mt-8 scale-x-[-1]" strokeWidth={1.25} />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <p className="text-xs font-medium uppercase tracking-widest text-secondary mb-2">
          What&apos;s Included
        </p>
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-10 text-foreground">
          30-Minute Snuggle Visit Includes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-primary mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-serif font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <p className="text-xs font-medium uppercase tracking-widest text-secondary mb-2">
          Simple &amp; Transparent
        </p>
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-10 text-foreground">
          Pricing
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 divide-y divide-border overflow-hidden">
            {PRICING.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-6 py-5"
              >
                <span className="font-medium text-foreground">{row.label}</span>
                <span className="font-display text-xl text-primary">
                  {row.price}
                </span>
              </div>
            ))}
          </Card>

          <Card className="p-6 bg-highlight border-none flex flex-col items-start gap-3 justify-center">
            <HeartHandshake className="h-8 w-8 text-secondary" />
            <p className="font-serif font-semibold text-lg text-foreground">
              Customized package available
            </p>
            <p className="text-sm text-muted-foreground">
              Need something different? Get in touch and we&apos;ll build a
              visit schedule around your cat.
            </p>
          </Card>
        </div>
      </section>

      {/* Service Area */}
      <section id="area" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-secondary mb-2">
              Where We Snuggle
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-foreground">
              Service Area
            </h2>
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <p className="text-lg text-foreground">
                Southern River and surrounding suburbs, within 10km.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Additional travel fee applies outside the service area.
            </p>
          </div>

          <div className="relative aspect-square max-w-sm mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/25" />
            <div className="absolute inset-8 rounded-full border-2 border-dashed border-primary/35" />
            <div className="absolute inset-16 rounded-full bg-accent/60" />
            <div className="relative flex flex-col items-center gap-1 text-primary">
              <MapPin className="h-9 w-9" />
              <span className="text-xs font-medium text-foreground bg-card/80 rounded-full px-2 py-0.5">
                Southern River
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-watercolor border-none p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight text-foreground">
                Because they aren&apos;t just pets. They&apos;re family.
              </h2>
              <p className="mt-4 text-muted-foreground max-w-md">
                Snuggle Cat Sitter was founded on the idea that your cat
                deserves calm, familiar, one-on-one care in their own home
                &mdash; not a cage or a stranger&apos;s house.
              </p>
            </div>
            <div className="space-y-3">
              {WHY_US.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <PawPrint className="h-5 w-5 text-secondary shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
          Ready to book snuggles for your cat?
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Reach out and let&apos;s find the perfect visit schedule for your
          feline family.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Book a Visit</Button>
          </Link>
          <a href="mailto:iamfarah19@outlook.com">
            <Button variant="outline" size="lg">
              <Mail className="h-4 w-4 mr-2" />
              Email Us
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
