import { Injectable } from '@angular/core';
import { IOpalFinesEnforcementAccountTypesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-types-response.interface';
import { IFinesAecAccountTypeRow } from '../interfaces/fines-aec-account-type-row.interface';
import { transformAccountTypesForView } from './utils/fines-aec-payload-transform-account-types-for-view.utils';

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
}
