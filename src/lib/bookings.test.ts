import { describe, expect, it } from 'vitest';
import {
  calculateBookingEstimate,
  createBookingRequest,
  listBookingRequests,
  updateBookingStatus,
  type BookingRequestInput,
  type BookingStatus,
} from './bookings';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const baseRequest: BookingRequestInput = {
  ownerName: 'Aisha Rahman',
  email: 'aisha@example.com',
  phone: '0400 000 000',
  addressSuburb: 'Southern River',
  numberOfCats: 2,
  catNames: 'Luna, Mochi',
  startDate: '2026-08-01',
  endDate: '2026-08-03',
  visitFrequency: 'single',
  extraMinutes: false,
  feedingInstructions: 'Dry food in the morning, wet food in the evening.',
  litterInstructions: 'Scoop daily and top up litter if low.',
  specialCareNotes: 'Mochi hides under the sofa at first.',
  emergencyContact: 'Sam 0400 111 111',
  vetDetails: 'Southern River Vet Clinic',
  catPhotoName: 'luna-mochi.jpg',
  confirmationConsent: true,
};

describe('calculateBookingEstimate', () => {
  it('calculates inclusive booking days for a single visit package', () => {
    expect(
      calculateBookingEstimate({
        startDate: '2026-08-01',
        endDate: '2026-08-03',
        visitFrequency: 'single',
        extraMinutes: false,
      }),
    ).toEqual({ days: 3, visitsPerDay: 1, total: 60 });
  });

  it('adds extra 30-minute charges per visit', () => {
    expect(
      calculateBookingEstimate({
        startDate: '2026-08-01',
        endDate: '2026-08-03',
        visitFrequency: 'twice',
        extraMinutes: true,
      }),
    ).toEqual({ days: 3, visitsPerDay: 2, total: 165 });
  });

  it('returns zero for missing or reversed dates', () => {
    expect(
      calculateBookingEstimate({
        startDate: '',
        endDate: '2026-08-03',
        visitFrequency: 'single',
        extraMinutes: false,
      }).total,
    ).toBe(0);

    expect(
      calculateBookingEstimate({
        startDate: '2026-08-04',
        endDate: '2026-08-03',
        visitFrequency: 'single',
        extraMinutes: false,
      }).total,
    ).toBe(0);
  });
});

describe('booking request storage', () => {
  it('creates requests with pending status and stores newest first', () => {
    const storage = new MemoryStorage();

    const first = createBookingRequest(baseRequest, storage);
    const second = createBookingRequest(
      { ...baseRequest, ownerName: 'Nadia Lim', catNames: 'Pumpkin' },
      storage,
    );

    expect(first.status).toBe<BookingStatus>('Pending');
    expect(second.estimate.total).toBe(60);
    expect(listBookingRequests(storage).map((booking) => booking.ownerName)).toEqual([
      'Nadia Lim',
      'Aisha Rahman',
    ]);
  });

  it('updates a booking status without changing customer details', () => {
    const storage = new MemoryStorage();
    const booking = createBookingRequest(baseRequest, storage);

    updateBookingStatus(booking.id, 'Confirmed', storage);

    expect(listBookingRequests(storage)[0]).toMatchObject({
      id: booking.id,
      ownerName: 'Aisha Rahman',
      status: 'Confirmed',
      catNames: 'Luna, Mochi',
    });
  });
});
