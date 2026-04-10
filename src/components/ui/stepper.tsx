import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isActive || isCompleted
                    ? "bg-primary text-white"
                    : "bg-accent text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={cn("text-xs whitespace-nowrap", {
                  "text-primary font-medium": isActive || isCompleted,
                  "text-muted-foreground": !isActive && !isCompleted,
                })}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("h-0.5 flex-1 mx-2 mt-[-16px]", {
                  "bg-primary": isCompleted,
                  "bg-border": !isCompleted,
                })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
