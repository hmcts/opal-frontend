import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import { getIgnoredDateBounds } from './fines-api-ignored-dates.utils';

describe('getIgnoredDateBounds', () => {
  it.each([
    ['2026-10-16T22:54:12', '2026-10-02T22:54:12'],
    ['2026-04-01T12:30:00', '2026-03-18T12:30:00'],
    ['2026-10-28T12:30:00', '2026-10-14T12:30:00'],
    ['2028-03-05T12:30:00', '2028-02-20T12:30:00'],
  ])('preserves UK wall time fourteen calendar days before %s', (now, from) => {
    expect(getIgnoredDateBounds(DateTime.fromISO(now, { zone: 'Europe/London' }))).toEqual({
      completed_date_from: from,
      completed_date_to: now,
    });
  });
  it('uses UK time rather than the host zone and drops fractional seconds', () => {
    expect(getIgnoredDateBounds(DateTime.fromISO('2026-10-16T21:54:12.999Z', { zone: 'UTC' }))).toEqual({
      completed_date_from: '2026-10-02T22:54:12',
      completed_date_to: '2026-10-16T22:54:12',
    });
  });
});
