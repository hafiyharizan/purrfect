"use client";

import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { Home, Moon, Building } from "lucide-react";
import type { Service } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-6 w-6" />,
  Moon: <Moon className="h-6 w-6" />,
  Building: <Building className="h-6 w-6" />,
};

interface StepServiceProps {
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StepService({
  services,
  selectedId,
  onSelect,
}: StepServiceProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-bold">Choose a Service</h2>
      <p className="text-muted-foreground">
        Select the type of care your feline family needs.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {services.map((service) => (
          <Card
            key={service.id}
            className={cn(
              "p-6 cursor-pointer transition-all hover:shadow-md",
              selectedId === service.id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/30"
            )}
            onClick={() => onSelect(service.id)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30 text-primary mb-4">
              {iconMap[service.icon || "Home"] || <Home className="h-6 w-6" />}
            </div>
            <h3 className="text-lg font-serif font-semibold">{service.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              {service.description}
            </p>
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(service.base_price)}
              <span className="text-xs text-muted-foreground font-normal">
                {" "}
                / visit
              </span>
            </p>
            {service.per_cat_price > 0 && (
              <p className="text-xs text-muted-foreground">
                +{formatCurrency(service.per_cat_price)} per additional cat
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
