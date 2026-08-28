import { inject, Injectable } from '@angular/core';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';

import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';
import { IOpalFinesCentralFund } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-central-fund.interface';
import { IOpalFinesMajorCreditor } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor.interface';

const CENTRAL_FUND_DEFAULT_NAME = 'Central Fund';

@Injectable({
  providedIn: 'root',
})
export class FinesSaPayloadService {
  private readonly transformationService = inject(TransformationService);

  /**

   * Transforms the given finesSaPayload object by applying the transformations
   * defined in the FINES_SA_BUILD_TRANSFORM_ITEMS_CONFIG.
   *
   * @param finesSaPayload - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public transformPayload<T extends { [key: string]: any }>(
    finesSaPayload: T,
    transformItemsConfig: ITransformItem[],
  ): T {
    return this.transformationService.transformObjectValues(finesSaPayload, transformItemsConfig);
  }

  /**
   * Maps a Central Fund API response into the major creditor shape used by the
   * Search Account major creditor autocomplete.
   *
   * @param centralFund - Central Fund response for the selected business unit.
   * @param businessUnitId - Selected business unit ID used to retrieve the central fund.
   * @returns A major-creditor-compatible Central Fund item.
   */
  public mapCentralFundToMajorCreditor(
    centralFund: IOpalFinesCentralFund,
    businessUnitId: number,
  ): IOpalFinesMajorCreditor {
    return {
      account_number: centralFund.major_creditor.account_number,
      business_unit_id: businessUnitId,
      creditor_account_id: centralFund.major_creditor.creditor_account_id,
      creditor_account_type: 'CF',
      from_suspense: null,
      hold_payout: null,
      last_changed_date: null,
      major_creditor_code: null,
      major_creditor_id: centralFund.major_creditor.creditor_account_id,
      major_creditor_party_id: null,
      name: centralFund.major_creditor.name ?? CENTRAL_FUND_DEFAULT_NAME,
      postcode: null,
      prosecution_service: false,
    };
  }
}
