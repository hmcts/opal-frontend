import { inject, Injectable } from '@angular/core';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { IFinesAccAddNoteForm } from '../fines-acc-note-add/interfaces/fines-acc-note-add-form.interface';
import { IOpalFinesAddNotePayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-at-a-glance-tab-ref-data.interface';
import { IFinesAccAddCommentsFormState } from '../fines-acc-comments-add/interfaces/fines-acc-comments-add-form-state.interface';
import { IOpalFinesUpdateDefendantAccountPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-update-defendant-account.interface';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';

@Injectable({
  providedIn: 'root',
})
export class FinesAccPayloadService {
  private readonly transformationService = inject(TransformationService);
  private readonly payloadService = inject(FinesMacPayloadService);
  private readonly globalStore = inject(GlobalStore);
  private readonly finesAccStore = inject(FinesAccountStore);

  /**
   * Constructs the payload for adding a note.
   *
   * This method collects necessary data from the finesAccStore as well as the form input to build the
   * payload required for adding a new note to the account. It gathers the account version, the associated
   * record's type and ID, the note type (hardcoded as 'AA'), and the note text from the form data.
   *
   * @param form - The form containing note data for the fines account.
   * @returns The payload object conforming to the IOpalFinesAddNotePayload interface.
   */
  public buildAddNotePayload(form: IFinesAccAddNoteForm): IOpalFinesAddNotePayload {
    return {
      activity_note: {
        record_type: 'DEFENDANT_ACCOUNTS',
        record_id: this.finesAccStore.account_id()!,
        note_text: form.formData.facc_add_notes!,
        note_type: 'AA',
      },
    };
  }

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
      party_type: headingData.debtor_type,
      party_name: party_name,
      base_version: headingData.version,
      business_unit_id: headingData.business_unit_summary.business_unit_id,
      business_unit_user_id: business_unit_user_id,
      welsh_speaking: headingData.business_unit_summary.welsh_speaking,
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
    const { comments_and_notes } = atAGlanceData;
    return {
      facc_add_comment: comments_and_notes?.account_comment || '',
      facc_add_free_text_1: comments_and_notes?.free_text_note_1 || '',
      facc_add_free_text_2: comments_and_notes?.free_text_note_2 || '',
      facc_add_free_text_3: comments_and_notes?.free_text_note_3 || '',
    };
  }

  /**
   * Transforms the given IFinesAccAddCommentsFormState and account version into an update payload
   * for the defendant account API.
   *
   * @param formState - The form state containing the comment and note data
   * @returns The transformed payload for updating the defendant account
   */
  public buildCommentsFormPayload(formState: IFinesAccAddCommentsFormState): IOpalFinesUpdateDefendantAccountPayload {
    return {
      comment_and_notes: {
        account_comment: formState.facc_add_comment || null,
        free_text_note_1: formState.facc_add_free_text_1 || null,
        free_text_note_2: formState.facc_add_free_text_2 || null,
        free_text_note_3: formState.facc_add_free_text_3 || null,
      },
    };
  }

  /**
   * Transforms the given finesMacPayload object by applying the transformations
   * defined in the FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG.
   *
   * @param finesAccPayload - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public transformPayload<T extends { [key: string]: any }>(
    finesAccPayload: T,
    transformItemsConfig: ITransformItem[],
  ): T {
    return this.transformationService.transformObjectValues(finesAccPayload, transformItemsConfig);
  }
}
