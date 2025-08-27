import { inject, Injectable } from '@angular/core';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesDefendantAccountHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';

@Injectable({
  providedIn: 'root',
})
export class FinesAccPayloadService {
  private readonly payloadService = inject(FinesMacPayloadService);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Transforms the given IOpalFinesDefendantAccountHeader into IFinesAccountState for the Account Store
   *
   * @param headingData - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  public transformAccountHeaderForStore(headingData: IOpalFinesDefendantAccountHeader): IFinesAccountState {
    const party_name = `${headingData.title} ${headingData.firstnames} ${headingData.surname?.toUpperCase()}`;
    const business_unit_user_id = this.payloadService.getBusinessUnitBusinessUserId(
      Number(headingData.business_unit_id),
      this.globalStore.userState(),
    );

    return {
      account_number: headingData.account_number,
      party_id: headingData.defendant_account_id,
      party_type: headingData.debtor_type,
      party_name: party_name,
      base_version: Number(headingData.version),
      business_unit_user_id: business_unit_user_id,
    };
  }
}
