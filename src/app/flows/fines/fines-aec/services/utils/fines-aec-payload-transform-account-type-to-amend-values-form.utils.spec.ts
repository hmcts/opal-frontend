import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-enforcement-account-types.mock';
import { IFinesAecAccountTypeRow } from '../../interfaces/fines-aec-account-type-row.interface';
import { transformAccountTypesForView } from './fines-aec-payload-transform-account-types-for-view.utils';
import { transformAccountTypeToAmendValuesForm } from './fines-aec-payload-transform-account-type-to-amend-values-form.utils';

describe('transformAccountTypeToAmendValuesForm', () => {
  let row: IFinesAecAccountTypeRow;

  beforeEach(() => {
    row = transformAccountTypesForView(structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK))[0];
  });

  it('formats existing monetary values with two decimal places without mutating the row', () => {
    row.minimumBalance = 12.5;
    row.highValue = 1000;
    const originalRow = structuredClone(row);

    expect(transformAccountTypeToAmendValuesForm(row)).toEqual({ minimum_balance: '12.50', high_value: '1000.00' });
    expect(row).toEqual(originalRow);
  });

  it('preserves zero values in the editable fields', () => {
    row.minimumBalance = 0;
    row.highValue = 0;

    expect(transformAccountTypeToAmendValuesForm(row)).toEqual({ minimum_balance: '0.00', high_value: '0.00' });
  });

  it('leaves absent balances blank', () => {
    row.minimumBalance = null;
    row.highValue = null;

    expect(transformAccountTypeToAmendValuesForm(row)).toEqual({ minimum_balance: '', high_value: '' });
  });
});
