import { inject, Injectable } from '@angular/core';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { IFinesAccAddNoteForm } from '../fines-acc-note-add/interfaces/fines-acc-note-add-form.interface';
import { IOpalFinesAddNotePayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';

@Injectable({
  providedIn: 'root',
})
export class FinesAccPayloadService {
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
    // construct the payload for adding a note
    return {
      account_version: this.finesAccStore.version()!,
      associated_record_type: this.finesAccStore.party_type()!,
      associated_record_id: this.finesAccStore.party_id()!,
      note_type: 'AA',
      note_text: form.formData.facc_add_notes!,
    };
  }
}
  /**
   * Transforms the given IOpalFinesDefendantAccountHeader into IFinesAccountState for the Account Store
   *
   * @param headingData - The payload object to be transformed.
   * @returns The transformed payload object.
   */
  public transformAccountHeaderForStore(headingData: IOpalFinesAccountDefendantDetailsHeader): IFinesAccountState {
    let party_name = '';
    if (headingData.party_details.organisation_flag) {
      party_name = headingData.party_details.organisation_details?.organisation_name!;
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
      business_unit_user_id: business_unit_user_id,
    };
  }
}
