"use client";

import { Dialog, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { assignSitter } from "@/actions/admin";
import { useState } from "react";
import type { Profile } from "@/types";

interface AssignSitterDialogProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  sitters: Profile[];
}

export function AssignSitterDialog({
  open,
  onClose,
  bookingId,
  sitters,
}: AssignSitterDialogProps) {
  const [assigning, setAssigning] = useState<string | null>(null);

  const handleAssign = async (sitterId: string) => {
    setAssigning(sitterId);
    const result = await assignSitter(bookingId, sitterId);
    setAssigning(null);
    if (result.success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assign a Sitter</DialogTitle>
      <DialogDescription>
        Choose a sitter for this booking.
      </DialogDescription>

      <div className="space-y-3 mt-4 max-h-80 overflow-y-auto">
        {sitters.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No sitters available
          </p>
        ) : (
          sitters.map((sitter) => (
            <div
              key={sitter.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={sitter.avatar_url}
                  alt={sitter.full_name}
                  fallback={sitter.full_name.charAt(0)}
                />
                <div>
                  <p className="font-medium text-sm">{sitter.full_name}</p>
                  <p className="text-xs text-muted-foreground">Sitter</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAssign(sitter.id)}
                disabled={assigning === sitter.id}
              >
                {assigning === sitter.id ? "Assigning..." : "Assign"}
              </Button>
            </div>
          ))
        )}
      </div>
    </Dialog>
  );
}
