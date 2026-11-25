import { beforeEach, describe, expect, it } from 'vitest';
import { IFinesAecAccountTypeRow } from '../../interfaces/fines-aec-account-type-row.interface';
import { buildAmendValuesPayload } from './fines-aec-payload-build-amend-values.utils';

describe('buildAmendValuesPayload', () => {
  let row: IFinesAecAccountTypeRow;

  beforeEach(() => {
    row = {
      id: 101,
      version: 7,
      accountType: 'COL',
      accountTypeName: 'Adult - Collection order',
      minimumBalance: 100,
      highValue: 1000,
      lowValueAccountType: {
        id: 101,
        version: 7,
        account_type: 'COL',
        enforcement_account_type: 'COLL',
        path: 'L',
        minimum_balance: 100,
      },
      highValueAccountType: {
        id: 202,
        version: 11,
        account_type: 'COL',
        enforcement_account_type: 'COLH',
        path: 'H',
        minimum_balance: 1000,
      },
    };
  });

  it('converts validated amounts using each path ID and independent version without mutating inputs', () => {
    const formState = { minimum_balance: ' 150.50 ', high_value: ' 2000.99 ' };
    const originalRow = structuredClone(row);
    const originalFormState = { ...formState };

    expect(buildAmendValuesPayload(row, formState)).toEqual([
      { id: 101, minimum_balance: 150.5, version: 7 },
      { id: 202, minimum_balance: 2000.99, version: 11 },
    ]);
    expect(row).toEqual(originalRow);
    expect(formState).toEqual(originalFormState);
  });

  it('clears an existing high threshold when its form value is blank', () => {
    expect(buildAmendValuesPayload(row, { minimum_balance: '150.50', high_value: ' \t ' })).toEqual([
      { id: 101, minimum_balance: 150.5, version: 7 },
      { id: 202, minimum_balance: null, version: 11 },
    ]);
  });

  it('keeps zero as a financial value for both paths', () => {
    expect(buildAmendValuesPayload(row, { minimum_balance: '0.00', high_value: '0' })).toEqual([
      { id: 101, minimum_balance: 0, version: 7 },
      { id: 202, minimum_balance: 0, version: 11 },
    ]);
  });

  it('updates only the low path when there is no high record and the high value is blank', () => {
    row.highValueAccountType = null;

    expect(buildAmendValuesPayload(row, { minimum_balance: '100', high_value: '' })).toEqual([
      { id: 101, minimum_balance: 100, version: 7 },
    ]);
  });

  it('rejects a supplied high value when no high record exists', () => {
    row.highValueAccountType = null;

    expect(() => buildAmendValuesPayload(row, { minimum_balance: '0', high_value: '0' })).toThrow(
      'The high enforcement path is missing for the selected account type.',
    );
  });
});
