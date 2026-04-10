"use client";

import { useBookingWizard } from "@/hooks/use-booking-wizard";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { StepService } from "./step-service";
import { StepDateTime } from "./step-datetime";
import { StepCats } from "./step-cats";
import { StepNotes } from "./step-notes";
import { StepReview } from "./step-review";
import { createBooking, getServiceAddons } from "@/actions/bookings";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Service, ServiceAddon, Cat } from "@/types";

interface BookingWizardProps {
  services: Service[];
  cats: Cat[];
}

const STEPS = ["Service", "Date & Time", "Cats", "Details", "Review"];

export function BookingWizard({ services, cats }: BookingWizardProps) {
  const { state, dispatch } = useBookingWizard();
  const router = useRouter();
  const [addons, setAddons] = useState<ServiceAddon[]>([]);
  const [error, setError] = useState<string | null>(null);

  const selectedService = services.find((s) => s.id === state.serviceId);
  const selectedCats = cats.filter((c) => state.selectedCatIds.includes(c.id));
  const selectedAddons = addons.filter((a) =>
    state.selectedAddonIds.includes(a.id)
  );

  // Fetch addons when service changes
  useEffect(() => {
    if (state.serviceId) {
      getServiceAddons(state.serviceId).then(setAddons);
    }
  }, [state.serviceId]);

  const canGoNext = () => {
    switch (state.step) {
      case 1:
        return !!state.serviceId;
      case 2:
        return !!state.scheduledDate && !!state.scheduledTime;
      case 3:
        return state.selectedCatIds.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setError(null);
    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });

    const result = await createBooking({
      serviceId: state.serviceId!,
      scheduledDate: state.scheduledDate!,
      scheduledTime: state.scheduledTime!,
      endDate: state.endDate,
      catIds: state.selectedCatIds,
      addonIds: state.selectedAddonIds,
      notes: state.notes || undefined,
    });

    if (result.success && result.data) {
      window.location.href = result.data.checkoutUrl;
    } else {
      setError(result.error || "Something went wrong");
      dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
    }
  };

  // Determine if service needs end date (overnight, boarding)
  const showEndDate =
    selectedService?.slug === "overnight" ||
    selectedService?.slug === "boarding";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Stepper steps={STEPS} currentStep={state.step} />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[300px]">
        {state.step === 1 && (
          <StepService
            services={services}
            selectedId={state.serviceId}
            onSelect={(id) => dispatch({ type: "SET_SERVICE", serviceId: id })}
          />
        )}

        {state.step === 2 && (
          <StepDateTime
            date={state.scheduledDate}
            time={state.scheduledTime}
            endDate={state.endDate}
            showEndDate={showEndDate}
            onDateChange={(date) =>
              dispatch({
                type: "SET_DATETIME",
                date,
                time: state.scheduledTime || "",
                endDate: state.endDate || undefined,
              })
            }
            onTimeChange={(time) =>
              dispatch({
                type: "SET_DATETIME",
                date: state.scheduledDate || "",
                time,
                endDate: state.endDate || undefined,
              })
            }
            onEndDateChange={(endDate) =>
              dispatch({
                type: "SET_DATETIME",
                date: state.scheduledDate || "",
                time: state.scheduledTime || "",
                endDate,
              })
            }
          />
        )}

        {state.step === 3 && (
          <StepCats
            cats={cats}
            selectedIds={state.selectedCatIds}
            onToggle={(catId) => dispatch({ type: "TOGGLE_CAT", catId })}
          />
        )}

        {state.step === 4 && (
          <StepNotes
            notes={state.notes}
            onNotesChange={(notes) => dispatch({ type: "SET_NOTES", notes })}
            addons={addons}
            selectedAddonIds={state.selectedAddonIds}
            onToggleAddon={(addonId) =>
              dispatch({ type: "TOGGLE_ADDON", addonId })
            }
          />
        )}

        {state.step === 5 && selectedService && (
          <StepReview
            service={selectedService}
            date={state.scheduledDate!}
            time={state.scheduledTime!}
            endDate={state.endDate}
            cats={selectedCats}
            addons={selectedAddons}
            notes={state.notes}
            isSubmitting={state.isSubmitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Navigation */}
      {state.step < 5 && (
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "PREV_STEP" })}
            disabled={state.step === 1}
          >
            Back
          </Button>
          <Button
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            disabled={!canGoNext()}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
