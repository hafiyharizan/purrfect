"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { PawPrint, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import type { Profile } from "@/types";

interface NavbarProps {
  user?: { email: string } | null;
  profile?: Profile | null;
}

const NAV_LINKS = [
  { href: "/bookings", label: "Find a Sitter" },
  { href: "/cats", label: "My Kitties" },
  { href: "/bookings", label: "Bookings" },
];

const MARKETING_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#area", label: "Service Area" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar({ user, profile }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PawPrint className="h-4 w-4" />
            </span>
            <span className="text-xl font-display font-bold text-primary">
              Snuggle Cat Sitter
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {!user && (
            <div className="hidden md:flex items-center gap-8">
              {MARKETING_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          {user && (
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.startsWith(link.href)
                      ? "text-primary underline underline-offset-4"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.startsWith("/admin")
                      ? "text-primary underline underline-offset-4"
                      : "text-muted-foreground"
                  )}
                >
                  Dashboard
                </Link>
              )}
              {profile?.role === "sitter" && (
                <Link
                  href="/sitter"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.startsWith("/sitter")
                      ? "text-primary underline underline-offset-4"
                      : "text-muted-foreground"
                  )}
                >
                  My Schedule
                </Link>
              )}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/bookings/new">
                  <Button size="sm">Send a Meow</Button>
                </Link>
                <Link href="/settings">
                  <Avatar
                    src={profile?.avatar_url}
                    alt={profile?.full_name || "User"}
                    fallback={profile?.full_name?.charAt(0) || "U"}
                    size="sm"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Book Now</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && !user && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-2">
            {MARKETING_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
        {mobileOpen && user && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium",
                  pathname.startsWith(link.href)
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            {profile?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent/50"
              >
                Admin Dashboard
              </Link>
            )}
            {profile?.role === "sitter" && (
              <Link
                href="/sitter"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent/50"
              >
                My Schedule
              </Link>
            )}
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent/50"
            >
              Settings
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        )}
      </nav>
    </header>
  );
}
