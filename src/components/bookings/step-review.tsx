"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { CalendarDays, Clock, Cat as CatIcon, FileText } from "lucide-react";
import type { Service, ServiceAddon, Cat } from "@/types";

interface StepReviewProps {
  service: Service;
  date: string;
  time: string;
  endDate: string | null;
  cats: Cat[];
  addons: ServiceAddon[];
  notes: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function StepReview({
  service,
  date,
  time,
  endDate,
  cats,
  addons,
  notes,
  isSubmitting,
  onSubmit,
}: StepReviewProps) {
  const catCost = service.per_cat_price * cats.length;
  const addonCost = addons.reduce((sum, a) => sum + a.price, 0);
  const total = service.base_price + catCost + addonCost;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold">Review Your Booking</h2>
        <p className="text-muted-foreground">
          Everything look good? Proceed to payment when ready.
        </p>
      </div>

      <Card className="p-6 space-y-5">
        {/* Service */}
        <div>
          <h3 className="text-lg font-serif font-semibold">{service.name}</h3>
          <p className="text-sm text-muted-foreground">{service.description}</p>
        </div>

        {/* Date/Time */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>{formatDate(date)}</span>
            {endDate && (
              <span className="text-muted-foreground">
                {" "}
                &mdash; {formatDate(endDate)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>{formatTime(time)}</span>
          </div>
        </div>

        {/* Cats */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CatIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {cats.length} cat{cats.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map((cat) => (
              <Badge key={cat.id} variant="secondary">
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        {addons.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Add-ons</p>
            <div className="space-y-1">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{addon.name}</span>
                  <span>
                    {addon.price === 0
                      ? "Free"
                      : formatCurrency(addon.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Notes</span>
            </div>
            <p className="text-sm text-muted-foreground bg-accent/50 rounded-xl p-3">
              {notes}
            </p>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service base price</span>
            <span>{formatCurrency(service.base_price)}</span>
          </div>
          {catCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Additional cats ({cats.length} &times;{" "}
                {formatCurrency(service.per_cat_price)})
              </span>
              <span>{formatCurrency(catCost)}</span>
            </div>
          )}
          {addonCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Add-ons</span>
              <span>{formatCurrency(addonCost)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </Card>

      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? "Processing..." : `Pay ${formatCurrency(total)}`}
      </Button>
    </div>
  );
}
