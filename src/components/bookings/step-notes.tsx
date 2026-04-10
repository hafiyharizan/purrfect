"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ServiceAddon } from "@/types";

interface StepNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  addons: ServiceAddon[];
  selectedAddonIds: string[];
  onToggleAddon: (addonId: string) => void;
}

export function StepNotes({
  notes,
  onNotesChange,
  addons,
  selectedAddonIds,
  onToggleAddon,
}: StepNotesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold">
          Special Instructions
        </h2>
        <p className="text-muted-foreground">
          Any notes for your sitter? Feeding schedule, play preferences, etc.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Instructions for the Sitter</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="E.g., Feed twice daily at 8am and 6pm. Oliver loves chin scratches..."
          className="min-h-[120px]"
        />
      </div>

      {addons.length > 0 && (
        <div className="space-y-3">
          <Label>Optional Add-ons</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addons.map((addon) => {
              const isSelected = selectedAddonIds.includes(addon.id);
              return (
                <Card
                  key={addon.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all flex items-start gap-3",
                    isSelected
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/30"
                  )}
                  onClick={() => onToggleAddon(addon.id)}
                >
                  <div
                    className={cn(
                      "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5",
                      isSelected
                        ? "bg-primary border-primary text-white"
                        : "border-border"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{addon.name}</span>
                      <span className="text-sm font-semibold text-primary">
                        {addon.price === 0
                          ? "Free"
                          : `+${formatCurrency(addon.price)}`}
                      </span>
                    </div>
                    {addon.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {addon.description}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
