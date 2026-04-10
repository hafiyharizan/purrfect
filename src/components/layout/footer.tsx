import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-lg font-serif font-bold text-foreground">
              Purrfect Sitters
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              &copy; {new Date().getFullYear()} Purrfect Sitters. Radical trust
              for your feline family.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Trust &amp; Safety
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Sitter Resources
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Contact Support
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
