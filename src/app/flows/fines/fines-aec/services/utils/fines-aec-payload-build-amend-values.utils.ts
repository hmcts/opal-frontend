import { IOpalFinesEnforcementAccountTypeUpdate } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-type-update.interface';
import { IFinesAecAmendValuesFormState } from '../../fines-aec-amend-values/interfaces/fines-aec-amend-values-form-state.interface';
import { IFinesAecAccountTypeRow } from '../../interfaces/fines-aec-account-type-row.interface';

/**
 * Builds updates for the selected account type's predefined low and high enforcement paths without mutating inputs.
 * A blank high value clears its balance; supplying one without a high path raises an error.
 * @param row - Selected account type with the original IDs and versions for both enforcement paths.
 * @param formState - Validated numeric form values, with an optional blank high value.
 * @returns Low path update followed by the high path update when that record exists.
 */
export function buildAmendValuesPayload(
  row: IFinesAecAccountTypeRow,
  formState: IFinesAecAmendValuesFormState,
): IOpalFinesEnforcementAccountTypeUpdate[] {
  const highValue = formState.high_value.trim();
  const payload: IOpalFinesEnforcementAccountTypeUpdate[] = [
    {
      id: row.lowValueAccountType.id,
      minimum_balance: Number(formState.minimum_balance.trim()),
      version: row.lowValueAccountType.version,
    },
  ];

  if (row.highValueAccountType) {
    payload.push({
      id: row.highValueAccountType.id,
      minimum_balance: highValue === '' ? null : Number(highValue),
      version: row.highValueAccountType.version,
    });
  } else if (highValue !== '') {
    throw new Error('The high enforcement path is missing for the selected account type.');
  }

  return payload;
}
