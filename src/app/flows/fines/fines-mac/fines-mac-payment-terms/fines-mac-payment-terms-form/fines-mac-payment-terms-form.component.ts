import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { AbstractFormBaseComponent } from '@components/abstract';
import { IFinesMacPaymentTermsForm } from '../interfaces';
import { FinesService } from '../../../services/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGovUkRadioOptions } from '@interfaces/components/govuk';
import { CommonModule } from '@angular/common';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukTextInputPrefixSuffixComponent,
} from '@components/govuk';
import { FINES_MAC_PAYMENT_TERMS_OPTIONS } from '../constants';
import { ScotgovDatePickerComponent } from '@components/scotgov';
import { FinesMacDefaultDaysComponent } from '../../components';

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
    GovukCheckboxesConditionalComponent,
    GovukCancelLinkComponent,
    ScotgovDatePickerComponent,
    GovukTextInputPrefixSuffixComponent,
    FinesMacDefaultDaysComponent,
  ],
  templateUrl: './fines-mac-payment-terms-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPaymentTermsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Output() protected override formSubmit = new EventEmitter<IFinesMacPaymentTermsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  public readonly paymentTerms: IGovUkRadioOptions[] = Object.entries(FINES_MAC_PAYMENT_TERMS_OPTIONS).map(
    ([key, value]) => ({ key, value }),
  );

  /**
   * Sets up the payment terms form.
   */
  private setupPaymentTermsForm(): void {
    this.form = new FormGroup({
      paymentTerms: new FormControl(null),
      holdEnforcementOnAccount: new FormControl(null),
      hasDaysInDefault: new FormControl(null),
      daysInDefaultDate: new FormControl(null),
      daysInDefault: new FormControl(null),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-payment-terms-form component.
   * This method sets up the payment terms form and repopulates it with the
   * payment terms from the finesMacState.
   */
  private initialPaymentTermsSetup(): void {
    this.setupPaymentTermsForm();
    this.rePopulateForm(this.finesService.finesMacState.paymentTerms);
  }

  public override ngOnInit(): void {
    this.initialPaymentTermsSetup();
    super.ngOnInit();
  }
}
