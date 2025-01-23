import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IFinesMacPaymentTermsForm } from './interfaces/fines-mac-payment-terms-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FinesMacPaymentTermsFormComponent } from './fines-mac-payment-terms-form/fines-mac-payment-terms-form.component';
import { FinesMacStore } from '../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-payment-terms',
  imports: [FinesMacPaymentTermsFormComponent],
  templateUrl: './fines-mac-payment-terms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPaymentTermsComponent extends AbstractFormParentBaseComponent {
  public finesMacStore = inject(FinesMacStore);
  public defendantType = this.finesMacStore.getDefendantType();

  /**
   * Handles the submission of the payment terms form.
   * Updates the finesMacStore with the new payment terms and sets unsavedChanges and stateChanges flags.
   * Navigates to the appropriate route based on whether it's a nested flow or not.
   *
   * @param form - The payment terms form data.
   */
  public handlePaymentTermsSubmit(form: IFinesMacPaymentTermsForm): void {
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

    this.finesMacStore.setPaymentTerms(form);

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
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
