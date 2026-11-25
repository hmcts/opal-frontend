import { Injectable } from '@angular/core';
import { IOpalFinesEnforcementAccountTypesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-types-response.interface';
import { IOpalFinesEnforcementAccountTypeUpdate } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-type-update.interface';
import { IFinesAecAmendValuesFormState } from '../fines-aec-amend-values/interfaces/fines-aec-amend-values-form-state.interface';
import { IFinesAecAccountTypeRow } from '../interfaces/fines-aec-account-type-row.interface';
import { transformAccountTypesForView } from './utils/fines-aec-payload-transform-account-types-for-view.utils';
import { transformAccountTypeToAmendValuesForm } from './utils/fines-aec-payload-transform-account-type-to-amend-values-form.utils';
import { buildAmendValuesPayload } from './utils/fines-aec-payload-build-amend-values.utils';

@Injectable({ providedIn: 'root' })
export class FinesAecPayloadService {
  /**
   * Builds the Account types table rows without modifying the API response.
   * @param response - National thresholds with separate low (L) and high (H) enforcement path records.
   * @returns Rows in the standard account type order, retaining the original path metadata for amendments.
   */
  public transformAccountTypesForView(response: IOpalFinesEnforcementAccountTypesResponse): IFinesAecAccountTypeRow[] {
    return transformAccountTypesForView(response);
  }

  /**
   * Prepares the selected account type's thresholds for editing.
   * @param row - Account type selected from the Account types tab.
   * @returns Amounts with two decimal places or empty strings for absent values.
   */
  public transformAccountTypeToAmendValuesForm(row: IFinesAecAccountTypeRow): IFinesAecAmendValuesFormState {
    return transformAccountTypeToAmendValuesForm(row);
  }

  /**
   * Builds the PATCH updates while preserving each enforcement path's ID and version.
   * @param row - Selected account type with its original enforcement path records.
   * @param formState - Validated form values; a blank high value clears its threshold.
   * @returns Updates for the low path and, when present, the high path.
   */
  public buildAmendValuesPayload(
    row: IFinesAecAccountTypeRow,
    formState: IFinesAecAmendValuesFormState,
  ): IOpalFinesEnforcementAccountTypeUpdate[] {
    return buildAmendValuesPayload(row, formState);
  }
}
