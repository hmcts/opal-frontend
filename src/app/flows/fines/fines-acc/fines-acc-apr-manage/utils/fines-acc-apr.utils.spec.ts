import { describe, expect, it } from 'vitest';
import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { canAddApr, canChangeApr, canRemoveApr } from './fines-acc-apr.utils';

const reference: IOpalFinesApr = {
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
    ['CONSOLIDATED', 'APR', true, true],
    ['AMALGAMATED', 'APR', true, true],
    ['APR', 'ACC', false, false],
    ['CONSOLIDATED', 'ACC', false, false],
    ['AMALGAMATED', 'ACC', false, false],
  ] as const)(
    'permits the expected change and remove actions for relationship %s and category %s',
    (relationship, category, canChange, canRemove) => {
      const record = { ...reference, relationship, category };

      expect(canChangeApr(record)).toBe(canChange);
      expect(canRemoveApr(record)).toBe(canRemove);
    },
  );

  it('allows an addition when there are no references or only inherited references', () => {
    expect(canAddApr([])).toBe(true);
    expect(canAddApr([{ ...reference, relationship: 'CONSOLIDATED' }])).toBe(true);
    expect(canAddApr([{ ...reference, relationship: 'AMALGAMATED', category: 'ACC' }])).toBe(true);
  });

  it('prevents an addition whenever a direct APR relationship is already present', () => {
    expect(canAddApr([reference])).toBe(false);
    expect(canAddApr([{ ...reference, category: 'ACC' }])).toBe(false);
    expect(canAddApr([{ ...reference, relationship: 'CONSOLIDATED' }, reference])).toBe(false);
  });
});
