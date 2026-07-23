import { describe, expect, it } from 'vitest';
import { finesAccDateToRfc3339UtcTimestamp } from './fines-acc-date-to-rfc3339-utc-timestamp.utils';

describe('finesAccDateToRfc3339UtcTimestamp', () => {
  it('should convert a DD/MM/YYYY date into an RFC3339 UTC timestamp', () => {
    const result = finesAccDateToRfc3339UtcTimestamp('31/01/2024');

    expect(result).toBe('2024-01-31T00:00:00.000Z');
  });
});
