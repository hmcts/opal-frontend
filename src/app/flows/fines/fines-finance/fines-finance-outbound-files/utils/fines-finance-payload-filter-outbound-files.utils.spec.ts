import { describe, expect, it } from 'vitest';
import type { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK } from '../mocks/fines-finance-outbound-files-response.mock';
import { filterOutboundFilesByBusinessUnit } from './fines-finance-payload-filter-outbound-files.utils';

describe('filterOutboundFilesByBusinessUnit', () => {
  const file = FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK.interface_files![0];
  const files: IOpalFileHandlingInterfaceFile[] = [
    { ...file, interface_file_id: 1, business_unit_codes: ['0046'] },
    { ...file, interface_file_id: 2, business_unit_codes: ['0042'] },
    { ...file, interface_file_id: 3, business_unit_codes: null },
    { ...file, interface_file_id: 4, business_unit_codes: [] },
    { ...file, interface_file_id: 5, business_unit_codes: ['0042', '0046'] },
    { ...file, interface_file_id: 6, business_unit_codes: ['46'] },
  ];

  it('keeps matching and unassigned files in API order for a selected business unit', () => {
    expect(filterOutboundFilesByBusinessUnit(files, '0046').map((item) => item.interface_file_id)).toEqual([
      1, 3, 4, 5,
    ]);
  });

  it('matches business-unit codes exactly, preserving leading zeros', () => {
    expect(filterOutboundFilesByBusinessUnit(files, '46').map((item) => item.interface_file_id)).toEqual([3, 4, 6]);
  });

  it('retains unassigned files when no returned file matches the selected unit', () => {
    expect(filterOutboundFilesByBusinessUnit(files, 'UNKNOWN').map((item) => item.interface_file_id)).toEqual([3, 4]);
  });

  it.each([null, ''])('includes every returned file when the business-unit selection is %s', (businessUnit) => {
    expect(filterOutboundFilesByBusinessUnit(files, businessUnit)).toEqual(files);
  });

  it.each([null, undefined, []])('returns an empty list when metadata is %s', (metadata) => {
    expect(filterOutboundFilesByBusinessUnit(metadata, '0046')).toEqual([]);
  });

  it('leaves API metadata and order unchanged when applying a selection', () => {
    const metadata = structuredClone(files);
    const original = structuredClone(metadata);
    metadata.forEach((item) => {
      Object.freeze(item.business_unit_codes);
      Object.freeze(item);
    });
    Object.freeze(metadata);

    const result = filterOutboundFilesByBusinessUnit(metadata, '0046');

    expect(metadata).toEqual(original);
    expect(result).not.toBe(metadata);
    expect(result[0]).toBe(metadata[0]);
  });
});
