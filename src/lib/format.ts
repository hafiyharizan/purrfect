import { parseLocalDate } from './bookings';

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

const dateShortFormatter = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDateShort(value: string) {
  const date = parseLocalDate(value);
  return date ? dateShortFormatter.format(date) : 'Not set';
}

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}
