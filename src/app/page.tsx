import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Heart, Camera, Home, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] text-foreground">
              Radical Trust for your Feline Family.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Premium, editorial-style care for cats who deserve more than just
              a visit. We bring the comfort of home to every stay.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg">Start the Connection</Button>
              </Link>
              <Link href="#philosophy">
                <Button variant="outline" size="lg">
                  Our Philosophy
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden flex items-center justify-center">
              <div className="text-[120px]">🐱</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
          Curated Excellence
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-10">
          Designed for Domestic Peace
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30 text-primary mb-4">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">
              Hand-picked Sitters
            </h3>
            <p className="text-sm text-muted-foreground">
              Not just cat lovers, but certified professionals vetted through a
              rigorous 12-step harmony check.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30 text-primary mb-4">
              <Camera className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">
              Daily Photo Updates
            </h3>
            <p className="text-sm text-muted-foreground">
              Receive high-resolution, candid captures of your feline&apos;s
              daily adventures and quiet moments.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30 text-primary mb-4">
              <Home className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">
              Stress-free Boarding
            </h3>
            <p className="text-sm text-muted-foreground">
              No cages, no cold floors. We maintain your cat&apos;s specific
              rituals and sensory environment perfectly.
            </p>
          </Card>
        </div>
      </section>

      {/* About / Philosophy */}
      <section
        id="philosophy"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[3/4] rounded-[2rem] bg-gradient-to-br from-teal-800 to-teal-900 flex items-center justify-center overflow-hidden">
            <div className="text-[100px]">👩‍🦰🐈</div>
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">
              Because they aren&apos;t just pets. They&apos;re family.
            </h2>
            <p className="mt-4 text-muted-foreground">
              We understand that leaving your feline friend is a heavy decision.
              Purrfect Sitters was founded on the principle that your cat&apos;s
              emotional well-being is as important as their physical needs. Our
              approach is bespoke, quiet, and deeply respectful of the cat&apos;s
              territory.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "1-on-1 Personalized Attention",
                "Emergency Vet Coordination",
                "Medication Management",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-[2rem] bg-highlight p-8 sm:p-12 text-center">
          <div className="text-4xl text-secondary mb-4">&ldquo;&rdquo;</div>
          <blockquote className="text-xl sm:text-2xl font-serif italic text-foreground max-w-2xl mx-auto">
            &ldquo;Finding Purrfect Sitters was a revelation. For the first
            time in years, I traveled without guilt, knowing Luna was being
            cherished just as I would cherish her.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Avatar src={null} alt="Eleanor Vance" fallback="EV" size="md" />
            <div className="text-left">
              <p className="font-semibold text-sm">Eleanor Vance</p>
              <p className="text-xs text-muted-foreground">
                Mother to Luna &amp; Jasper
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
