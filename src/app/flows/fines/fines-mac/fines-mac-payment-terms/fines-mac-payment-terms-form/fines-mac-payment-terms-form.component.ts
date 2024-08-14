import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { AbstractFormBaseComponent } from '@components/abstract';
import { IFinesMacPaymentTermsForm } from '../interfaces';
import { FinesService } from '../../../services/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGovUkRadioOptions } from '@interfaces/components/govuk';
import { FINES_MAC_PAYMENT_TERMS_PAYMENT_TERMS } from '../constants/fines-mac-payment-terms-payment-terms';
import { CommonModule } from '@angular/common';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@components/govuk';

@Component({
  selector: 'app-fines-mac-payment-terms-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-mac-payment-terms-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPaymentTermsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IFinesMacPaymentTermsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  public readonly paymentTerms: IGovUkRadioOptions[] = Object.entries(FINES_MAC_PAYMENT_TERMS_PAYMENT_TERMS).map(
    ([key, value]) => ({ key, value }),
  );

  /**
   * Sets up the payment terms form.
   */
  private setupPaymentTermsForm(): void {
    this.form = new FormGroup({
      paymentTerms: new FormControl(null),
      holdEnforcementOnAccount: new FormControl(null),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-payment-terms-form component.
   * This method sets up the payment terms form and repopulates it with the
   * payment terms from the finesMacState.
   */
  private initialSetup(): void {
    this.setupPaymentTermsForm();
    this.rePopulateForm(this.finesService.finesMacState.paymentTerms);
  }

  /**
   * Handles the form submission event.
   *
   * @param event - The submit event object.
   * @returns void
   */
  public handleFormSubmit(event: SubmitEvent): void {
    if (this.form.valid) {
      this.formSubmitted = true;
      const nestedFlow = event.submitter ? event.submitter.className.includes('nested-flow') : false;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({ formData: this.form.value, nestedFlow: nestedFlow });
    }
  }

  public override ngOnInit(): void {
    this.initialSetup();
    super.ngOnInit();
  }
}
