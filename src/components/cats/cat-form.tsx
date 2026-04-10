"use client";

import { useActionState } from "react";
import { createCat, updateCat } from "@/actions/cats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CAT_MOODS } from "@/lib/constants";
import type { ActionResult, Cat } from "@/types";

interface CatFormProps {
  cat?: Cat;
}

const initialState: ActionResult = { success: false };

export function CatForm({ cat }: CatFormProps) {
  const action = cat
    ? updateCat.bind(null, cat.id)
    : createCat;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{cat ? `Edit ${cat.name}` : "Add a New Feline"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.error && !state.fieldErrors && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" required>
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Oliver"
              defaultValue={cat?.name}
              required
              error={state.fieldErrors?.name?.[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                name="breed"
                placeholder="Scottish Fold"
                defaultValue={cat?.breed || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood">Current Mood</Label>
              <Select id="mood" name="mood" defaultValue={cat?.mood || "Relaxed"}>
                {CAT_MOODS.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age_years">Age (years)</Label>
              <Input
                id="age_years"
                name="age_years"
                type="number"
                min={0}
                max={30}
                placeholder="4"
                defaultValue={cat?.age_years || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input
                id="weight_kg"
                name="weight_kg"
                type="number"
                min={0}
                max={50}
                step={0.1}
                placeholder="4.5"
                defaultValue={cat?.weight_kg || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_notes">Medical Notes</Label>
            <Textarea
              id="medical_notes"
              name="medical_notes"
              placeholder="Any medications, allergies, or health conditions..."
              defaultValue={cat?.medical_notes || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_needs">Special Needs</Label>
            <Textarea
              id="special_needs"
              name="special_needs"
              placeholder="Dietary requirements, behavioral notes..."
              defaultValue={cat?.special_needs || ""}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={pending}>
              {pending
                ? cat
                  ? "Saving..."
                  : "Adding..."
                : cat
                  ? "Save Changes"
                  : "Add Feline"}
            </Button>
            <Button type="button" variant="outline" onClick={() => history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
