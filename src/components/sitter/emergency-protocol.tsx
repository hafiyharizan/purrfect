import { Card } from "@/components/ui/card";
import { Asterisk } from "lucide-react";

export function EmergencyProtocol() {
  const steps = [
    "Contact the Primary Owner via the 'Call' button in their profile.",
    "If unreachable, call the listed Emergency Vet: Cat Care Clinic (555-0123).",
    "Notify Purrfect Sitters Support via the Emergency Line.",
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <Asterisk className="h-4 w-4 text-primary" />
        <h3 className="font-serif font-semibold text-primary">
          Emergency Protocol
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        In case of urgent medical needs or safety concerns, follow these steps
        immediately:
      </p>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary text-xs font-bold text-primary shrink-0">
              {i + 1}
            </div>
            <p className="text-sm">{step}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
