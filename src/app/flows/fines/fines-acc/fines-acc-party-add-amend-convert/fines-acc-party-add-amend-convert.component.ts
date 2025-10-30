import { Component, inject } from '@angular/core';
import { FinesAccPartyAddAmendConvertFormComponent } from './fines-acc-party-add-amend-convert-form/fines-acc-party-add-amend-convert-form.component';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesAccPartyAddAmendConvertForm } from './interfaces/fines-acc-party-add-amend-convert-form.interface';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_STATE } from './constants/fines-acc-party-add-amend-convert-state.constant';

@Component({
  selector: 'app-fines-acc-debtor-add-amend',
  imports: [FinesAccPartyAddAmendConvertFormComponent],
  templateUrl: './fines-acc-party-add-amend-convert.component.html',
})
export class FinesAccPartyAddAmendConvert extends AbstractFormParentBaseComponent {
  private readonly payloadService = inject(FinesAccPayloadService);

  private readonly partyPayload: IOpalFinesAccountDefendantAccountParty =
    this['activatedRoute'].snapshot.data['partyAddAmendConvertData'];

  protected readonly prefilledFormData: IFinesAccPartyAddAmendConvertForm = {
    formData:
      this.payloadService.mapDebtorAccountPartyPayload(this.partyPayload) || FINES_ACC_PARTY_ADD_AMEND_CONVERT_STATE,
    nestedFlow: false,
  };

  protected readonly isDebtor: boolean = this.partyPayload.defendant_account_party.is_debtor;

  protected readonly partyType: string = this['activatedRoute'].snapshot.params['partyType'];

  /**
   * Handles the form submission event from the child form component.
   * @param formData - The form data submitted from the child component
   */
  public handleFormSubmit(formData: IFinesAccPartyAddAmendConvertForm): void {
    console.log('Form submitted with data:', formData);
    console.log('Party Type:', this.partyType);
  }

  /**
   * Handles the unsaved changes event from the child form component.
   * @param unsavedChanges - Boolean indicating if there are unsaved changes
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }
}
