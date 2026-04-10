"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";
import type { Cat } from "@/types";

interface StepCatsProps {
  cats: Cat[];
  selectedIds: string[];
  onToggle: (catId: string) => void;
}

export function StepCats({ cats, selectedIds, onToggle }: StepCatsProps) {
  if (cats.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold">Select Your Cats</h2>
        <div className="rounded-2xl bg-accent/30 p-12 text-center">
          <p className="text-4xl mb-2">🐱</p>
          <p className="text-muted-foreground mb-4">
            You need to add your cats before booking.
          </p>
          <Link
            href="/cats/new"
            className="text-primary font-medium hover:underline"
          >
            Add a cat first
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-bold">Select Your Cats</h2>
      <p className="text-muted-foreground">
        Choose which felines need care during this visit.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {cats.map((cat) => {
          const isSelected = selectedIds.includes(cat.id);
          return (
            <Card
              key={cat.id}
              className={cn(
                "p-4 cursor-pointer transition-all flex items-center gap-4",
                isSelected
                  ? "ring-2 ring-primary border-primary"
                  : "hover:border-primary/30"
              )}
              onClick={() => onToggle(cat.id)}
            >
              <div className="h-14 w-14 rounded-xl bg-accent overflow-hidden shrink-0">
                {cat.photo_url ? (
                  <img
                    src={cat.photo_url}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl">
                    🐱
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-semibold">{cat.name}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {[cat.breed, cat.age_years ? `${cat.age_years}y` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <div
                className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected
                    ? "bg-primary border-primary text-white"
                    : "border-border"
                )}
              >
                {isSelected && <Check className="h-3 w-3" />}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
