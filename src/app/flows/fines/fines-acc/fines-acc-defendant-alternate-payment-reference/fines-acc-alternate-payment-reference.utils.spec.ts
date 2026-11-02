import { Settings } from 'luxon';
import { afterEach, describe, expect, it } from 'vitest';
import { IOpalFinesAlternatePaymentReference } from '@services/fines/opal-fines-service/interfaces/opal-fines-alternate-payment-reference.interface';
import {
  canAddAlternatePaymentReference,
  canChangeAlternatePaymentReference,
  canRemoveAlternatePaymentReference,
  formatAlternatePaymentReferenceDate,
} from './fines-acc-alternate-payment-reference.utils';

const reference: IOpalFinesAlternatePaymentReference = {
  alternate_payment_reference_id: 11,
  defendant_account_id: 141,
  business_unit_id: 77,
  relationship: 'APR',
  category: 'APR',
  apr_text: 'TEST-REFERENCE',
  created_at: '2026-06-01T12:00:00Z',
  updated_at: null,
};

describe('alternate payment reference actions', () => {
  it.each([
    ['APR', 'APR', true, true],
    ['CONSOLIDATED', 'APR', false, true],
    ['AMALGAMATED', 'APR', false, true],
    ['APR', 'ACC', false, false],
    ['CONSOLIDATED', 'ACC', false, false],
    ['AMALGAMATED', 'ACC', false, false],
  ] as const)(
    'permits the expected change and remove actions for relationship %s and category %s',
    (relationship, category, canChange, canRemove) => {
      const record = { ...reference, relationship, category };

      expect(canChangeAlternatePaymentReference(record)).toBe(canChange);
      expect(canRemoveAlternatePaymentReference(record)).toBe(canRemove);
    },
  );

  it('allows an addition when there are no references or only inherited references', () => {
    expect(canAddAlternatePaymentReference([])).toBe(true);
    expect(canAddAlternatePaymentReference([{ ...reference, relationship: 'CONSOLIDATED' }])).toBe(true);
    expect(canAddAlternatePaymentReference([{ ...reference, relationship: 'AMALGAMATED', category: 'ACC' }])).toBe(
      true,
    );
  });

  it('prevents an addition whenever a direct APR relationship is already present', () => {
    expect(canAddAlternatePaymentReference([reference])).toBe(false);
    expect(canAddAlternatePaymentReference([{ ...reference, category: 'ACC' }])).toBe(false);
    expect(canAddAlternatePaymentReference([{ ...reference, relationship: 'CONSOLIDATED' }, reference])).toBe(false);
  });
});

describe('formatAlternatePaymentReferenceDate', () => {
  const originalZone = Settings.defaultZone;

  afterEach(() => {
    Settings.defaultZone = originalZone;
  });

  it('converts a UTC timestamp to the user local date during daylight saving time', () => {
    Settings.defaultZone = 'Europe/London';

    expect(formatAlternatePaymentReferenceDate('2026-06-01T23:30:00Z')).toBe('02 June 2026');
  });

  it('interprets timestamps without an offset as UTC before converting to local time', () => {
    Settings.defaultZone = 'Europe/London';

    expect(formatAlternatePaymentReferenceDate('2026-06-01T23:30:00')).toBe('02 June 2026');
  });

  it('uses the local calendar date in a timezone behind UTC', () => {
    Settings.defaultZone = 'America/New_York';

    expect(formatAlternatePaymentReferenceDate('2026-01-02T01:30:00Z')).toBe('01 January 2026');
  });

  it.each([null, '', 'invalid-date'])('uses an em dash for an unavailable date: %s', (value) => {
    expect(formatAlternatePaymentReferenceDate(value)).toBe('—');
  });
});
