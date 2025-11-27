import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinesAccPaymentTermsAmendFormComponent } from './fines-acc-payment-terms-amend-form/fines-acc-payment-terms-amend-form.component';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesAccPaymentTermsAmendForm } from './interfaces/fines-acc-payment-terms-amend-form.interface';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM } from './constants/fines-acc-payment-terms-amend-form.constant';

@Component({
  selector: 'app-fines-acc-payment-terms-amend',
  imports: [CommonModule, FinesAccPaymentTermsAmendFormComponent],
  templateUrl: './fines-acc-payment-terms-amend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPaymentTermsAmendComponent extends AbstractFormParentBaseComponent {
  protected readonly prefilledFormData: IFinesAccPaymentTermsAmendForm =
    this['activatedRoute'].snapshot.data['paymentTermsFormData'] || FINES_ACC_PAYMENT_TERMS_AMEND_FORM;

  /**
   * Handles the form submission for payment terms amendment
   */
  public handlePaymentTermsSubmit(formData: IFinesAccPaymentTermsAmendForm): void {
    console.log('Payment terms form submitted with data:', formData);

    // Navigate back to defendant details with payment terms fragment
    // this['router'].navigate(['../../details'], {
    //   relativeTo: this['activatedRoute'],
    //   fragment: 'payment-terms'
    // });
  }

  /**
   * Handles unsaved changes when navigating away
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }
}
