import Link from "next/link";
import { Mail, MapPin, PawPrint } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <PawPrint className="h-4 w-4" />
              </span>
              <p className="text-lg font-display font-bold text-foreground">
                Snuggle Cat Sitter
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              &copy; {new Date().getFullYear()} Snuggle Cat Sitter. Snuggles
              delivered daily, Perth WA.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href="mailto:iamfarah19@outlook.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              iamfarah19@outlook.com
            </a>
            <a
              href="https://instagram.com/snuggle.cat.sitter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <InstagramIcon className="h-4 w-4" />
              @snuggle.cat.sitter
            </a>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Southern River &amp; surrounding suburbs, within 10km
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href="/#services" className="hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/#pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/#area" className="hover:text-primary transition-colors">
              Service Area
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
