import { inject, Injectable } from '@angular/core';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-at-a-glance-tab-ref-data.interface';
import { IFinesAccAddCommentsFormState } from '../fines-acc-comments-add/interfaces/fines-acc-comments-add-form-state.interface';

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
  public transformAccountHeaderForStore(headingData: IOpalFinesAccountDefendantDetailsHeader): IFinesAccountState {
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
      party_id: headingData.defendant_party_id,
      party_type: headingData.parent_guardian_party_id ? 'Parent/Guardian' : 'Defendant',
      party_name: party_name,
      base_version: Number(headingData.version),
      business_unit_id: headingData.business_unit_summary.business_unit_id,
      business_unit_user_id: business_unit_user_id,
    };
  }

  /**
   * Transforms the given IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData into IFinesAccAddCommentsFormState for the Comments Add form
   *
   * @param atAGlanceData - The at-a-glance data from the API.
   * @returns The transformed form state object for comments add form.
   */
  public transformAtAGlanceDataToCommentsForm(
    atAGlanceData: IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData,
  ): IFinesAccAddCommentsFormState {
    const { comment_and_notes } = atAGlanceData;

    return {
      facc_add_comment: comment_and_notes?.account_comment || '',
      facc_add_free_text_1: comment_and_notes?.free_text_note_1 || '',
      facc_add_free_text_2: comment_and_notes?.free_text_note_2 || '',
      facc_add_free_text_3: comment_and_notes?.free_text_note_3 || '',
    };
  }
}
