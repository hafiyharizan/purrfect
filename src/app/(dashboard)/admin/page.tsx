"use client";

import { useEffect, useState } from "react";
import { getAdminStats, getAllBookings, getSitters } from "@/actions/admin";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActiveBookings } from "@/components/admin/active-bookings";
import { AssignSitterDialog } from "@/components/admin/assign-sitter-dialog";
import { SitterMatchCard } from "@/components/admin/sitter-match-card";
import { Heart } from "lucide-react";
import type { Booking, Profile } from "@/types";

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    activeSitters: 0,
    pendingPurrs: 0,
    happyClients: 98,
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sitters, setSitters] = useState<Profile[]>([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");

  useEffect(() => {
    getAdminStats().then(setStats);
    getAllBookings().then(setBookings);
    getSitters().then(setSitters);
  }, []);

  const handleAssignSitter = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setAssignDialogOpen(true);
  };

  const handleDialogClose = () => {
    setAssignDialogOpen(false);
    // Refresh data
    getAllBookings().then(setBookings);
    getAdminStats().then(setStats);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold">Sanctuary Dashboard</h1>
        <p className="text-muted-foreground italic mt-1">
          Orchestrating radical trust for our feline family members. Today looks
          peaceful.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Visits"
          value={stats.totalVisits.toLocaleString()}
          subtitle="+12%"
        />
        <StatCard
          label="Active Sitters"
          value={stats.activeSitters}
          subtitle="On-duty"
        />
        <StatCard
          label="Pending Purrs"
          value={stats.pendingPurrs}
          icon={<Heart className="h-4 w-4 mb-1 text-red-400" />}
        />
        <StatCard
          label="Happy Clients"
          value={`${stats.happyClients}%`}
          subtitle="Rating"
          variant="highlight"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActiveBookings
            bookings={bookings}
            onAssignSitter={handleAssignSitter}
          />
        </div>
        <div>
          <SitterMatchCard sitters={sitters} />
        </div>
      </div>

      {/* Assign Dialog */}
      <AssignSitterDialog
        open={assignDialogOpen}
        onClose={handleDialogClose}
        bookingId={selectedBookingId}
        sitters={sitters}
      />
    </div>
  );
}
