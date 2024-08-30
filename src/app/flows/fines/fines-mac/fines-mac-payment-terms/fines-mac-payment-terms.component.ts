import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract';
import { FinesService } from '@services/fines';
import { IFinesMacPaymentTermsForm } from './interfaces';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';
import { FinesMacPaymentTermsFormComponent } from './fines-mac-payment-terms-form/fines-mac-payment-terms-form.component';

@Component({
  selector: 'app-fines-mac-payment-terms',
  standalone: true,
  imports: [FinesMacPaymentTermsFormComponent],
  templateUrl: './fines-mac-payment-terms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPaymentTermsComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.DefendantType!;

  /**
   * Handles the submission of the payment terms form.
   * Updates the finesMacState with the new payment terms and sets unsavedChanges and stateChanges flags.
   * Navigates to the appropriate route based on whether it's a nested flow or not.
   *
   * @param form - The payment terms form data.
   */
  public handlePaymentTermsSubmit(form: IFinesMacPaymentTermsForm): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      paymentTerms: form.formData,
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
