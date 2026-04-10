"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { completeVisit } from "@/actions/sitter";

interface VisitUpdateFormProps {
  bookingId: string;
  catNames: string;
  onComplete?: () => void;
}

export function VisitUpdateForm({
  bookingId,
  catNames,
  onComplete,
}: VisitUpdateFormProps) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    setSubmitting(true);
    setError(null);

    const result = await completeVisit(bookingId, notes);
    setSubmitting(false);

    if (result.success) {
      setNotes("");
      onComplete?.();
    } else {
      setError(result.error || "Failed to complete visit");
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-serif font-semibold mb-1">
        Visit Update for {catNames}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Write a note for the owners
      </p>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="How was the visit? Any purrs or playfulness to report?"
        className="min-h-[150px]"
      />

      <div className="flex items-center justify-between mt-4">
        <Button variant="outline" size="sm">
          <Camera className="h-4 w-4 mr-2" />
          Add Photo
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitting || !notes.trim()}
          >
            {submitting ? "Sending..." : "Send a Meow"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
