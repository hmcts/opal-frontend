import { describe, expect, it } from 'vitest';
import { mapAllocateRequest } from './fines-api-payload-map-allocate-request.utils';
import { IFinesApiAllocateTillsTableWrapperTableData } from '../../fines-api-process-allocate/fines-api-allocate-tab/fines-api-allocate-tills-table-wrapper/interfaces/fines-api-allocate-tills-table-wrapper-table-data.interface';

const rows: IFinesApiAllocateTillsTableWrapperTableData[] = [77, 78].map((businessUnitId, index) => ({
  tillId: String(101 + index),
  businessUnitId,
  'Till number': 7,
  Errors: 0,
  Filename: 'payments.dat',
  Source: 'NatWest',
  Amount: 10,
  'Business Unit': 'Test unit',
  'Processed by': 'test-operator',
  'Date processed': 0,
  dateProcessedDisplay: '',
}));

describe('mapAllocateRequest', () => {
  it('uses internal identity and authoritative BU IDs, deduplicating selected IDs', () => {
    expect(mapAllocateRequest(rows, ['102', '101', '102'])).toEqual({
      tills: [
        { till_id: 102, business_unit_id: 78 },
        { till_id: 101, business_unit_id: 77 },
      ],
    });
  });

  it.each([{ ids: [] }, { ids: ['999'] }, { ids: ['101', '999'] }])(
    'rejects empty or stale selections $ids as a whole',
    ({ ids }) => {
      expect(mapAllocateRequest(rows, ids)).toBeNull();
    },
  );

  it.each(['', 'NaN', '-1', '1.5', ' 101 ', '9007199254740993'])('rejects unsafe till identity %s', (tillId) => {
    expect(mapAllocateRequest([{ ...rows[0], tillId }], [tillId])).toBeNull();
  });

  it.each([undefined, null, -1, 1.5, 32768, '77'])('rejects missing or invalid BU identity %s', (businessUnitId) => {
    const malformedRow = { ...rows[0], businessUnitId } as unknown as IFinesApiAllocateTillsTableWrapperTableData;
    expect(mapAllocateRequest([malformedRow], ['101'])).toBeNull();
  });

  it('rejects an ambiguous internal identity', () => {
    expect(mapAllocateRequest([rows[0], rows[0]], ['101'])).toBeNull();
  });
});
