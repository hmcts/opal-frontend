import { Injectable } from '@angular/core';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { IFinesFpuBusinessUnit } from '../interfaces/fines-fpu-business-unit.interface';
import { buildFinesFpuDraftAccountParams } from './utils/fines-fpu-payload-build-draft-account-params.utils';
import { mapFinesFpuDraftAccountsToBusinessUnits } from './utils/fines-fpu-payload-map-business-units.utils';

@Injectable({
  providedIn: 'root',
})
export class FinesFpuPayloadService {
  /**
   * Builds query parameters for fixed penalties awaiting publication.
   *
   * @param userState - The signed-in user's business unit permissions.
   * @returns The draft account query parameters for eligible business units.
   */
  public buildDraftAccountParams(userState: IOpalUserState): IOpalFinesDraftAccountParams {
    return buildFinesFpuDraftAccountParams(userState);
  }

  /**
   * Maps fixed penalty draft accounts into business unit ticket totals.
   *
   * @param response - Draft accounts returned by the VPFPO query.
   * @param userState - The signed-in user's business unit permissions.
   * @returns Business unit summaries for the To publish table.
   */
  public mapDraftAccountsToBusinessUnits(
    response: IOpalFinesDraftAccountsResponse,
    userState: IOpalUserState,
  ): IFinesFpuBusinessUnit[] {
    return mapFinesFpuDraftAccountsToBusinessUnits(response, userState);
  }
}
