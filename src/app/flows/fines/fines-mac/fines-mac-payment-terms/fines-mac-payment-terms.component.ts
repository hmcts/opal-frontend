import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacPaymentTermsForm } from './interfaces/fines-mac-payment-terms-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FinesMacPaymentTermsFormComponent } from './fines-mac-payment-terms-form/fines-mac-payment-terms-form.component';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';

@Component({
  selector: 'app-fines-mac-payment-terms',
  standalone: true,
  imports: [FinesMacPaymentTermsFormComponent],
  templateUrl: './fines-mac-payment-terms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPaymentTermsComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type!;

  /**
   * Handles the submission of the payment terms form.
   * Updates the finesMacState with the new payment terms and sets unsavedChanges and stateChanges flags.
   * Navigates to the appropriate route based on whether it's a nested flow or not.
   *
   * @param form - The payment terms form data.
   */
  public handlePaymentTermsSubmit(form: IFinesMacPaymentTermsForm): void {
    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    // Change number fields to number type
    const {
      fm_payment_terms_lump_sum_amount,
      fm_payment_terms_instalment_amount,
      fm_payment_terms_default_days_in_jail,
    } = form.formData;
    form.formData.fm_payment_terms_lump_sum_amount = fm_payment_terms_lump_sum_amount
      ? Number(fm_payment_terms_lump_sum_amount)
      : null;
    form.formData.fm_payment_terms_instalment_amount = fm_payment_terms_instalment_amount
      ? Number(fm_payment_terms_instalment_amount)
      : null;
    form.formData.fm_payment_terms_default_days_in_jail = fm_payment_terms_default_days_in_jail
      ? Number(fm_payment_terms_default_days_in_jail)
      : null;

    // Update the state with the form data
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      paymentTerms: form,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow) {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountCommentsNotes);
    } else {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountDetails);
    }
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesService.finesMacState.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
