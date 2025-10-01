import { Component } from '@angular/core';
import { FinesAccDebtorAddAmendFormComponent } from './fines-acc-debtor-add-amend-form/fines-acc-debtor-add-amend-form.component';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesAccDebtorAddAmendForm } from './interfaces/fines-acc-debtor-add-amend-form.interface';
import { FINES_ACC_DEBTOR_ADD_AMEND_FORM } from './constants/fines-acc-debtor-add-amend-form.constant';

@Component({
  selector: 'app-fines-acc-debtor-add-amend',
  imports: [FinesAccDebtorAddAmendFormComponent],
  templateUrl: './fines-acc-debtor-add-amend.component.html',
})
export class FinesAccDebtorAddAmend extends AbstractFormParentBaseComponent {
  protected readonly prefilledFormData: IFinesAccDebtorAddAmendForm =
    this['activatedRoute'].snapshot.data['debtorAmendFormData'];

  protected readonly partyType: string = this['activatedRoute'].snapshot.params['partyType'];

  /**
   * Handles the form submission event from the child form component.
   * @param formData - The form data submitted from the child component
   */
  public handleFormSubmit(formData: IFinesAccDebtorAddAmendForm): void {
    console.log('Form submitted with data:', formData);
    // TODO: Implement actual form submission logic
  }

  /**
   * Handles the unsaved changes event from the child form component.
   * @param unsavedChanges - Boolean indicating if there are unsaved changes
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }
}
