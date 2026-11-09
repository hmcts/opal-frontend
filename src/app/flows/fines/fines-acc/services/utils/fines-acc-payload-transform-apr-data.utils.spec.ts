import { Settings } from 'luxon';
import { afterEach, describe, expect, it } from 'vitest';
import {
  IOpalFinesApr,
  IOpalFinesAprsResponse,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { transformAprsPayload } from './fines-acc-payload-transform-apr-data.utils';

const reference: IOpalFinesApr = {
  alternate_payment_reference_id: 11,
  defendant_account_id: 141,
  relationship: 'APR',
  category: 'APR',
  business_unit_id: 77,
  apr_text: ' MiXeD-123 ',
  created_at: '2026-06-01T12:00:00Z',
  updated_at: null,
};

describe('transformAprsPayload', () => {
  const originalZone = Settings.defaultZone;

  afterEach(() => {
    Settings.defaultZone = originalZone;
  });

  it('represents an empty account while retaining its quoted account version', () => {
    expect(transformAprsPayload({ references: [], version: '"7"' })).toEqual({
      references: [],
      version: '"7"',
      currentReferences: [],
      consolidatedReferences: [],
      canAdd: true,
    });
  });

  it('groups user-entered references in response order, hides ACC records and derives eligibility without changing the source', () => {
    const response: IOpalFinesAprsResponse = {
      references: [
        { ...reference, alternate_payment_reference_id: 15, relationship: 'AMALGAMATED' },
        { ...reference, alternate_payment_reference_id: 13, category: 'ACC' },
        { ...reference, alternate_payment_reference_id: 14, relationship: 'CONSOLIDATED' },
        reference,
        { ...reference, alternate_payment_reference_id: 12, category: 'ACC', relationship: 'CONSOLIDATED' },
      ],
      version: '"7"',
    };
    const unchanged = structuredClone(response);

    const result = transformAprsPayload(response);

    expect(result.currentReferences.map((row) => row.alternate_payment_reference_id)).toEqual([11]);
    expect(result.consolidatedReferences.map((row) => row.alternate_payment_reference_id)).toEqual([15, 14]);
    expect(result.currentReferences[0]).toMatchObject({ ...reference, canChange: true, canRemove: true });
    expect(result.consolidatedReferences.map(({ canChange, canRemove }) => ({ canChange, canRemove }))).toEqual([
      { canChange: true, canRemove: true },
      { canChange: true, canRemove: true },
    ]);
    expect(result.canAdd).toBe(false);
    expect(result.version).toBe('"7"');
    expect(result.references).toEqual(unchanged.references);
    expect(response).toEqual(unchanged);
    expect(response.references[0]).not.toHaveProperty('createdDate');
  });

  it('allows another APR with inherited references and keeps both sections empty for inherited account-number references', () => {
    const inherited = { ...reference, relationship: 'AMALGAMATED' as const };
    const inheritedResult = transformAprsPayload({ references: [inherited], version: null });
    expect(inheritedResult.currentReferences).toEqual([]);
    expect(inheritedResult.consolidatedReferences).toHaveLength(1);
    expect(inheritedResult.canAdd).toBe(true);
    expect(inheritedResult.version).toBeNull();

    const accountNumberResult = transformAprsPayload({
      references: [{ ...inherited, category: 'ACC' }],
      version: '"7"',
    });
    expect(accountNumberResult.currentReferences).toEqual([]);
    expect(accountNumberResult.consolidatedReferences).toEqual([]);
    expect(accountNumberResult.canAdd).toBe(true);
  });

  it('does not offer Add if a direct APR relationship exists even when its ACC row is hidden', () => {
    const result = transformAprsPayload({ references: [{ ...reference, category: 'ACC' }], version: '"7"' });

    expect(result.currentReferences).toEqual([]);
    expect(result.canAdd).toBe(false);
  });

  it.each([
    { zone: 'Europe/London', value: '2026-06-01T23:30:00Z', date: '02 June 2026' },
    { zone: 'Europe/London', value: '2026-06-01T23:30:00', date: '02 June 2026' },
    { zone: 'America/New_York', value: '2026-01-02T01:30:00Z', date: '01 January 2026' },
    { zone: 'Europe/London', value: '2026-01-02T01:30:00Z', date: '02 January 2026' },
  ])('maps both UTC timestamps to the local calendar date in $zone for $value', ({ zone, value, date }) => {
    Settings.defaultZone = zone;

    const result = transformAprsPayload({
      references: [{ ...reference, created_at: value, updated_at: value }],
      version: '"7"',
    });

    expect(result.currentReferences[0].createdDate).toBe(date);
    expect(result.currentReferences[0].updatedDate).toBe(date);
    expect(result.currentReferences[0].created_at).toBe(value);
  });

  it.each([null, '', 'invalid-date'])('uses an em dash for an unavailable updated date %j', (value) => {
    const result = transformAprsPayload({
      references: [{ ...reference, created_at: 'invalid-date', updated_at: value }],
      version: '"7"',
    });

    expect(result.currentReferences[0].createdDate).toBe('—');
    expect(result.currentReferences[0].updatedDate).toBe('—');
  });
});
