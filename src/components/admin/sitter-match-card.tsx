import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck } from "lucide-react";
import type { Profile } from "@/types";

interface SitterMatchCardProps {
  sitters: Profile[];
}

export function SitterMatchCard({ sitters }: SitterMatchCardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif font-semibold">
        Collaborative Matching
      </h3>
      <p className="text-sm text-muted-foreground">
        Select a booking to see our personality matches for your trusted
        sitters.
      </p>

      <div className="space-y-3">
        {sitters.slice(0, 3).map((sitter, i) => (
          <Card key={sitter.id} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={sitter.avatar_url}
                alt={sitter.full_name}
                fallback={sitter.full_name.charAt(0)}
                size="lg"
              />
              <div>
                <p className="font-semibold text-sm">{sitter.full_name}</p>
                <Badge variant="outline" className="text-[10px] mt-0.5">
                  {i === 0 ? "ELITE SITTER" : "MEMBER"}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button className="w-full" size="sm">
        <Sparkles className="h-4 w-4 mr-2" />
        Suggest Best Match
      </Button>

      {/* Trust Report */}
      <Card className="p-4 bg-accent/30 border-none">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-sm">Trust Report</h4>
        </div>
        <p className="text-xs text-muted-foreground">
          All background checks are current. Emergency veterinary contacts
          verified for all active sitters.
        </p>
      </Card>
    </div>
  );
}
