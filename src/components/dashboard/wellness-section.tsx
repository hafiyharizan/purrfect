import { Badge } from "@/components/ui/badge";
import { Shield, Utensils } from "lucide-react";

export function WellnessSection() {
  return (
    <div className="rounded-2xl bg-highlight p-6 sm:p-8">
      <h2 className="text-2xl font-serif font-bold mb-2">Wellness Tracking</h2>
      <p className="text-muted-foreground mb-4">
        Keep track of nutrition, playtime, and vet visits in one curated space.
      </p>
      <div className="flex flex-wrap gap-3">
        <Badge
          variant="outline"
          className="bg-white/80 px-4 py-2 text-sm font-medium gap-2"
        >
          <Shield className="h-4 w-4 text-primary" />
          Vaccines Up-to-date
        </Badge>
        <Badge
          variant="outline"
          className="bg-white/80 px-4 py-2 text-sm font-medium gap-2"
        >
          <Utensils className="h-4 w-4 text-primary" />
          Meal Plans Set
        </Badge>
      </div>
    </div>
  );
}
