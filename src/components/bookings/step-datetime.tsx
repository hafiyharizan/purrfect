"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepDateTimeProps {
  date: string | null;
  time: string | null;
  endDate: string | null;
  showEndDate?: boolean;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onEndDateChange: (date: string) => void;
}

export function StepDateTime({
  date,
  time,
  endDate,
  showEndDate,
  onDateChange,
  onTimeChange,
  onEndDateChange,
}: StepDateTimeProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif font-bold">Pick a Date &amp; Time</h2>
      <p className="text-muted-foreground">
        When would you like your sitter to visit?
      </p>

      <div className="max-w-md space-y-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="date" required>
            Start Date
          </Label>
          <Input
            id="date"
            type="date"
            min={today}
            value={date || ""}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" required>
            Start Time
          </Label>
          <Input
            id="time"
            type="time"
            value={time || ""}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>

        {showEndDate && (
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              min={date || today}
              value={endDate || ""}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
