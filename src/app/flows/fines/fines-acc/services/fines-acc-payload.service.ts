import { inject, Injectable } from '@angular/core';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FinesAccPayloadService {
  private readonly transformationService = inject(TransformationService);
  private readonly payloadService = inject(FinesMacPayloadService);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Transforms the given IOpalFinesDefendantAccountHeader into IFinesAccountState for the Account Store
   *
   * @param headingData - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  public transformAccountHeaderForStore(
    account_id: number,
    headingData: IOpalFinesAccountDefendantDetailsHeader,
  ): IFinesAccountState {
    let party_name = '';
    if (headingData.party_details.organisation_flag) {
      party_name = headingData.party_details.organisation_details?.organisation_name ?? '';
    } else {
      party_name = `${headingData.party_details.individual_details?.title} ${headingData.party_details.individual_details?.forenames} ${headingData.party_details.individual_details?.surname?.toUpperCase()}`;
    }
    const business_unit_user_id = this.payloadService.getBusinessUnitBusinessUserId(
      Number(headingData.business_unit_summary.business_unit_id),
      this.globalStore.userState(),
    );

    return {
      account_number: headingData.account_number,
      account_id: Number(account_id),
      party_id: headingData.defendant_party_id,
      party_type: headingData.parent_guardian_party_id ? 'Parent/Guardian' : 'Defendant',
      party_name: party_name,
      base_version: headingData.version,
      business_unit_id: headingData.business_unit_summary.business_unit_id,
      business_unit_user_id: business_unit_user_id,
    };
  }

  /**
   * Transforms the given finesMacPayload object by applying the transformations
   * defined in the FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG.
   *
   * @param finesAccPayload - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  public transformPayload<T extends { [key: string]: unknown }>(
    finesAccPayload: T,
    transformItemsConfig: ITransformItem[],
  ): T {
    return this.transformationService.transformObjectValues(finesAccPayload, transformItemsConfig);
  }
}
