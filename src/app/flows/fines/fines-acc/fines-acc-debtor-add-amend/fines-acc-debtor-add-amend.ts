import { Component, inject, OnInit } from '@angular/core';
import { FinesAccDebtorAddAmendFormComponent } from './fines-acc-debtor-add-amend-form/fines-acc-debtor-add-amend-form';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesAccDebtorAddAmendFormData } from './interfaces/fines-acc-debtor-add-amend-form.interface';
import { FINES_ACC_DEBTOR_ADD_AMEND_STATE } from './constants/fines-acc-debtor-add-amend-state.constant';

@Component({
  selector: 'app-fines-acc-debtor-add-amend',
  imports: [FinesAccDebtorAddAmendFormComponent],
  templateUrl: './fines-acc-debtor-add-amend.html',
})
export class FinesAccDebtorAddAmend extends AbstractFormParentBaseComponent {
  protected readonly prefilledFormData: IFinesAccDebtorAddAmendFormData = this['activatedRoute'].snapshot.data[
    'debtorAmendFormData'
  ] || {
    formData: FINES_ACC_DEBTOR_ADD_AMEND_STATE,
    nestedFlow: false,
  };
  /**
   * Handles the form submission event from the child form component.
   * @param formData - The form data submitted from the child component
   */
  public handleFormSubmit(formData: IFinesAccDebtorAddAmendFormData): void {
    console.log('Form submitted with data:', formData);
    // TODO: Implement actual form submission logic
  }

  /**
   * Handles the unsaved changes event from the child form component.
   * @param hasUnsavedChanges - Boolean indicating if there are unsaved changes
   */
  public handleUnsavedChanges(hasUnsavedChanges: boolean): void {
    console.log('Unsaved changes detected:', hasUnsavedChanges);
    // TODO: Implement unsaved changes handling logic
  }
}
