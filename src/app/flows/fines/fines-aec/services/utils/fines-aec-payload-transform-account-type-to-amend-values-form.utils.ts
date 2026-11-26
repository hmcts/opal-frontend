import { IFinesAecAmendValuesFormState } from '../../fines-aec-amend-values/interfaces/fines-aec-amend-values-form-state.interface';
import { IFinesAecAccountTypeRow } from '../../interfaces/fines-aec-account-type-row.interface';

/**
 * Prepares editable monetary values without modifying the selected account type.
 * @param row - Selected account type and its current low and high thresholds.
 * @returns Amounts with two decimal places, including zero, and empty strings for absent balances.
 */
export function transformAccountTypeToAmendValuesForm(row: IFinesAecAccountTypeRow): IFinesAecAmendValuesFormState {
  return {
    minimum_balance: row.minimumBalance?.toFixed(2) ?? '',
    high_value: row.highValue?.toFixed(2) ?? '',
  };
}
