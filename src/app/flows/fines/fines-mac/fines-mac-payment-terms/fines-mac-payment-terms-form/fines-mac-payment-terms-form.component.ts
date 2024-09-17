import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';
import { IFinesMacPaymentTermsFieldErrors } from '../interfaces/fines-mac-payment-terms-field-errors.interface';
import { IFinesMacPaymentTermsForm } from '../interfaces/fines-mac-payment-terms-form.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGovUkRadioOptions } from '@components/govuk/govuk-radio/interfaces/govuk-radio-options.interface';
import { CommonModule } from '@angular/common';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukCheckboxesComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes.component';
import { GovukCheckboxesConditionalComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-conditional/govuk-checkboxes-conditional.component';
import { GovukCheckboxesItemComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukRadioComponent } from '@components/govuk/govuk-radio/govuk-radio.component';
import { GovukRadiosItemComponent } from '@components/govuk/govuk-radio/govuk-radios-item/govuk-radios-item.component';
import { GovukTextInputPrefixSuffixComponent } from '@components/govuk/govuk-text-input-prefix-suffix/govuk-text-input-prefix-suffix.component';

import { FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION } from '../constants/fines-mac-payment-terms-default-days-control-validation';
import { FINES_MAC_PAYMENT_TERMS_OPTIONS } from '../constants/fines-mac-payment-terms-options';
import { FinesMacDefaultDaysComponent } from '../../components/fines-mac-default-days/fines-mac-default-days.component';
import { FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS } from '../constants/fines-mac-payment-terms-field-errors';
import { takeUntil } from 'rxjs';
import { DateService } from '@services/date-service/date.service';
import { MojDatePickerComponent } from '../../../../../components/moj/moj-date-picker/moj-date-picker.component';

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
    GovukTextInputPrefixSuffixComponent,
    FinesMacDefaultDaysComponent,
    GovukErrorSummaryComponent,
    MojDatePickerComponent,
  ],
  templateUrl: './fines-mac-payment-terms-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPaymentTermsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacPaymentTermsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly dateService = inject(DateService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  override fieldErrors: IFinesMacPaymentTermsFieldErrors = {
    ...FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS,
  };

  public readonly paymentTerms: IGovUkRadioOptions[] = Object.entries(FINES_MAC_PAYMENT_TERMS_OPTIONS).map(
    ([key, value]) => ({ key, value }),
  );
  public yesterday!: string;
  public isAdult!: boolean;

  /**
   * Sets up the payment terms form.
   */
  private setupPaymentTermsForm(): void {
    this.form = new FormGroup({
      payment_terms: new FormControl(null),
      hold_enforcement_on_account: new FormControl(null),
      has_days_in_default: new FormControl(null),
    });
  }

  /**
   * Sets up the initial payment terms for the fines-mac-payment-terms-form component.
   * This method performs the following tasks:
   * - Sets up the payment terms form.
   * - Adds a listener for changes in the "days in default" field.
   * - Sets the initial error messages.
   * - Repopulates the form with the payment terms data from the fines service.
   */
  private initialPaymentTermsSetup(): void {
    const { formData } = this.finesService.finesMacState.paymentTerms;
    this.setupPaymentTermsForm();
    this.hasDaysInDefaultListener();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.checkDefendantAge();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  /**
   * Listens for changes in the 'hasDaysInDefault' form control and performs actions accordingly.
   * If the value of 'hasDaysInDefault' is true, it creates the necessary form controls.
   * If the value of 'hasDaysInDefault' is false, it removes the unnecessary form controls.
   */
  private hasDaysInDefaultListener(): void {
    const { has_days_in_default: hasDaysInDefault } = this.form.controls;

    hasDaysInDefault.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      if (hasDaysInDefault.value === true) {
        FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION.map((control) => {
          this.createControl(control.controlName, control.validators);
        });
      } else {
        FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION.map((control) => {
          this.removeControl(control.controlName);
        });
      }
    });
  }

  /**
   * Checks the age of the defendant based on their date of birth.
   * If the defendant's date of birth is not provided or their age is 18 or above,
   * the `isAdult` property is set to `true`, indicating that the defendant is an adult.
   * Otherwise, the `isAdult` property is set to `false`.
   */
  private checkDefendantAge(): void {
    const { formData } = this.finesService.finesMacState.personalDetails;
    this.isAdult = !formData.dob || this.dateService.calculateAge(formData.dob) >= 18;
  }

  public override ngOnInit(): void {
    this.initialPaymentTermsSetup();
    super.ngOnInit();
  }
}
