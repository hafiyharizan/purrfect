import { describe, expect, it } from 'vitest';
import {
  calculateBookingEstimate,
  isLikelyInServiceArea,
  parseLocalDate,
  validateBooking,
  type BookingRequestInput,
} from './bookings';

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

describe('validateBooking', () => {
  it('accepts a complete, valid request', () => {
    expect(validateBooking(baseRequest)).toEqual({});
  });

  it('flags missing required fields, invalid email, and missing consent', () => {
    const errors = validateBooking({
      ...baseRequest,
      ownerName: '  ',
      email: 'not-an-email',
      confirmationConsent: false,
    });

    expect(errors.ownerName).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.confirmationConsent).toBeDefined();
  });

  it('flags an end date before the start date', () => {
    const errors = validateBooking({ ...baseRequest, startDate: '2026-08-05', endDate: '2026-08-03' });
    expect(errors.endDate).toBeDefined();
  });
});

describe('isLikelyInServiceArea', () => {
  it('matches known suburbs and postcodes', () => {
    expect(isLikelyInServiceArea('Southern River')).toBe(true);
    expect(isLikelyInServiceArea('6110')).toBe(true);
    expect(isLikelyInServiceArea('Fremantle')).toBe(false);
  });
});

describe('parseLocalDate', () => {
  it('parses valid dates and rejects blanks', () => {
    expect(parseLocalDate('2026-08-01')?.getFullYear()).toBe(2026);
    expect(parseLocalDate('')).toBeNull();
  });
});
