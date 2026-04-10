import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Cat } from "@/types";

interface CatCardProps {
  cat: Cat;
  className?: string;
}

const moodColors: Record<string, string> = {
  Sleeping: "bg-orange-400",
  Playful: "bg-orange-400",
  Relaxed: "bg-green-400",
  Curious: "bg-blue-400",
  Hungry: "bg-amber-400",
};

export function CatCard({ cat, className }: CatCardProps) {
  return (
    <Card className={cn("overflow-hidden group", className)}>
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-accent">
        {cat.photo_url ? (
          <Image
            src={cat.photo_url}
            alt={cat.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            🐱
          </div>
        )}
        {/* Mood Badge */}
        {cat.mood && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-xs">
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full mr-1.5",
                  moodColors[cat.mood] || "bg-gray-400"
                )}
              />
              {cat.mood}
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-serif font-semibold">{cat.name}</h3>
          <p className="text-sm text-muted-foreground">
            {[cat.breed, cat.age_years ? `${cat.age_years} years` : null]
              .filter(Boolean)
              .join(" · ") || "No details yet"}
          </p>
        </div>
        <Link
          href={`/cats/${cat.id}/edit`}
          className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-primary"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
