'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  BOOKING_STATUSES,
  VISIT_PLANS,
  parseLocalDate,
  type BookingRequest,
  type BookingStatus,
} from '@/lib/bookings';
import { formatCurrency, formatDateShort, formatDateTime, pluralize } from '@/lib/format';
import { changeBookingStatus, signOut } from '@/app/actions';
import { LineCat } from '@/app/_components/icons';

const ADMIN_PAGE_SIZE = 6;

type DateFilter = 'all' | 'upcoming' | 'past';

const adminFeatures = [
  { icon: ShieldCheck, title: 'Insured & reliable', text: 'Your cat is in safe and caring hands.' },
  { icon: Heart, title: 'Personalised care', text: 'Every visit tailored to your cat’s needs.' },
  { icon: Camera, title: 'Daily updates', text: 'Photos & videos so you never miss a moment.' },
  { icon: MapPin, title: 'Local & trusted', text: 'Proudly caring for cats in Perth.' },
];

export function AdminDashboard({ initialBookings }: { initialBookings: BookingRequest[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayNumbers = new Map(
    bookings.map((booking, index) => [booking.id, 1000 + bookings.length - index]),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== 'All' && booking.status !== statusFilter) {
      return false;
    }

    if (dateFilter !== 'all') {
      const end = parseLocalDate(booking.endDate);
      const isPast = !!end && end.getTime() < today.getTime();
      if (dateFilter === 'past' ? !isPast : isPast) {
        return false;
      }
    }

    if (normalizedQuery) {
      const haystack = `${booking.ownerName} ${booking.email} ${booking.addressSuburb} ${booking.catNames}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filteredBookings.length / ADMIN_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * ADMIN_PAGE_SIZE;
  const pageBookings = filteredBookings.slice(pageStart, pageStart + ADMIN_PAGE_SIZE);

  const applyFilter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  const setStatus = applyFilter(setStatusFilter);
  const setDates = applyFilter(setDateFilter);
  const setSearch = applyFilter(setQuery);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setBookings((current) =>
      current.map((booking) => (booking.id === id ? { ...booking, status } : booking)),
    );
    await changeBookingStatus(id, status);
  };

  const handleExport = () => {
    const header = [
      'ID', 'Owner', 'Email', 'Phone', 'Suburb', 'Cats', 'Cat names', 'Start', 'End',
      'Visits/day', 'Extra 30 mins', 'Estimated total', 'Status', 'Submitted',
    ];
    const rows = filteredBookings.map((booking) => [
      `#${displayNumbers.get(booking.id)}`,
      booking.ownerName,
      booking.email,
      booking.phone,
      booking.addressSuburb,
      booking.numberOfCats,
      booking.catNames,
      booking.startDate,
      booking.endDate,
      VISIT_PLANS[booking.visitFrequency].visitsPerDay,
      booking.extraMinutes ? 'Yes' : 'No',
      booking.estimate.total,
      booking.status,
      booking.submittedAt,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'booking-requests.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand admin-brand" href="/" aria-label="Snuggle Cat Sitter home">
          <LineCat className="brand-cat" />
          <span>
            <strong>Snuggle</strong>
            <small>Cat Sitter</small>
          </span>
        </Link>
        <nav className="side-nav" aria-label="Admin navigation">
          <span className="side-link"><LayoutDashboard aria-hidden="true" size={18} />Dashboard</span>
          <span className="side-link active"><CalendarDays aria-hidden="true" size={18} />Bookings</span>
          <span className="side-link"><Calendar aria-hidden="true" size={18} />Calendar</span>
          <span className="side-link"><Users aria-hidden="true" size={18} />Clients</span>
          <span className="side-link"><MessageCircle aria-hidden="true" size={18} />Messages</span>
          <span className="side-link"><Settings aria-hidden="true" size={18} />Settings</span>
        </nav>
        <form action={signOut}>
          <button className="side-link logout" type="submit">
            <LogOut aria-hidden="true" size={18} />
            Log out
          </button>
        </form>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <h1>Booking Requests</h1>
          <button className="primary-button export-button" type="button" onClick={handleExport}>
            <Download aria-hidden="true" size={17} />
            Export
          </button>
        </header>

        <div className="admin-board">
          <div className="admin-filters">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatus(event.target.value as BookingStatus | 'All')}
            >
              <option value="All">All Status</option>
              {BOOKING_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              aria-label="Filter by dates"
              value={dateFilter}
              onChange={(event) => setDates(event.target.value as DateFilter)}
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
            <label className="admin-search">
              <Search aria-hidden="true" size={16} />
              <input
                value={query}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email or suburb..."
              />
            </label>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <LineCat className="empty-cat" />
              <h3>No booking requests {bookings.length > 0 ? 'match your filters' : 'yet'}</h3>
              <p>Customer requests submitted from the booking form will appear here with care notes and estimates.</p>
            </div>
          ) : (
            <>
              <div className="booking-table-wrap">
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Dates</th>
                      <th>Visits / Day</th>
                      <th>Est. Total</th>
                      <th>Status</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageBookings.map((booking) => (
                      <BookingRow
                        key={booking.id}
                        booking={booking}
                        displayNumber={displayNumbers.get(booking.id)!}
                        expanded={expandedId === booking.id}
                        onToggle={() => setExpandedId((current) => (current === booking.id ? null : booking.id))}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                <div className="page-buttons">
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    <ChevronLeft aria-hidden="true" size={16} />
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={pageNumber === currentPage ? 'active' : ''}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    <ChevronRight aria-hidden="true" size={16} />
                  </button>
                </div>
                <span>
                  Showing {pageStart + 1} to {pageStart + pageBookings.length} of {filteredBookings.length}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="admin-features" aria-label="Why cat parents trust us">
          {adminFeatures.map((feature) => (
            <article key={feature.title}>
              <span className="icon-bubble small">
                <feature.icon aria-hidden="true" size={20} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingRow({
  booking,
  displayNumber,
  expanded,
  onToggle,
  onStatusChange,
}: {
  booking: BookingRequest;
  displayNumber: number;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  const plan = VISIT_PLANS[booking.visitFrequency];

  return (
    <>
      <tr className={expanded ? 'expanded' : ''}>
        <td>
          <button className="row-toggle" type="button" onClick={onToggle} aria-expanded={expanded}>
            <ChevronDown aria-hidden="true" size={14} />
            #{displayNumber}
          </button>
        </td>
        <td>
          <strong>{booking.ownerName}</strong>
          <span>{booking.email}</span>
        </td>
        <td>
          <strong>{formatDateShort(booking.startDate)} – {formatDateShort(booking.endDate)}</strong>
          <span>({pluralize(booking.estimate.days, 'day')})</span>
        </td>
        <td>
          <strong>{pluralize(plan.visitsPerDay, 'visit')}</strong>
          {booking.extraMinutes && <span>+ 30 mins</span>}
        </td>
        <td>
          <strong>{formatCurrency(booking.estimate.total)}</strong>
        </td>
        <td>
          <select
            className={`status-pill ${booking.status.toLowerCase()}`}
            value={booking.status}
            onChange={(event) => onStatusChange(booking.id, event.target.value as BookingStatus)}
            aria-label={`Status for ${booking.ownerName}`}
          >
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </td>
        <td>
          <span>{formatDateTime(booking.updatedAt)}</span>
        </td>
      </tr>
      {expanded && (
        <tr className="detail-row">
          <td colSpan={7}>
            <dl>
              <div><dt>Phone</dt><dd>{booking.phone}</dd></div>
              <div><dt>Suburb / Address</dt><dd>{booking.addressSuburb}</dd></div>
              <div><dt>Cats</dt><dd>{booking.catNames} ({pluralize(booking.numberOfCats, 'cat')})</dd></div>
              <div><dt>Feeding</dt><dd>{booking.feedingInstructions}</dd></div>
              <div><dt>Litter</dt><dd>{booking.litterInstructions}</dd></div>
              <div><dt>Special care</dt><dd>{booking.specialCareNotes || 'No special care notes'}</dd></div>
              <div><dt>Emergency contact</dt><dd>{booking.emergencyContact}</dd></div>
              <div><dt>Vet details</dt><dd>{booking.vetDetails}</dd></div>
              {booking.catPhotoName && <div><dt>Photo</dt><dd>{booking.catPhotoName}</dd></div>}
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}
