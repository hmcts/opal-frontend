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
import { AbstractFormBaseComponent } from '@components/abstract';
import {
  IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation,
  IFinesMacPaymentTermsFieldErrors,
  IFinesMacPaymentTermsForm,
  IFinesMacPaymentTermsPaymentTermOptionsControlValidation,
} from '../interfaces';
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
  GovukErrorSummaryComponent,
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
  GovukTextInputPrefixSuffixComponent,
} from '@components/govuk';
import {
  FINES_MAC_PAYMENT_TERMS_ALL_PAYMENT_TERM_OPTIONS_CONTROL_VALIDATION,
  FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION,
  FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS,
  FINES_MAC_PAYMENT_TERMS_OPTIONS,
} from '../constants';
import { ScotgovDatePickerComponent } from '@components/scotgov';
import { FinesMacDefaultDaysComponent } from '../../components';
import { FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS } from '../constants/fines-mac-payment-terms-field-errors';
import { takeUntil } from 'rxjs';
import { DateService } from '@services';

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
    GovukRadiosConditionalComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukCancelLinkComponent,
    ScotgovDatePickerComponent,
    GovukTextInputPrefixSuffixComponent,
    FinesMacDefaultDaysComponent,
    GovukErrorSummaryComponent,
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

  public readonly paymentTermOptions = FINES_MAC_PAYMENT_TERMS_OPTIONS;
  public readonly paymentTerms: IGovUkRadioOptions[] = Object.entries(this.paymentTermOptions).map(([key, value]) => ({
    key,
    value,
  }));
  public readonly frequencyOptions: IGovUkRadioOptions[] = Object.entries(
    FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS,
  ).map(([key, value]) => ({ key, value }));
  public readonly paymentTermsControls: IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation =
    FINES_MAC_PAYMENT_TERMS_ALL_PAYMENT_TERM_OPTIONS_CONTROL_VALIDATION;
  public yesterday!: string;
  public isAdult!: boolean;

  /**
   * Sets up the payment terms form.
   */
  private setupPaymentTermsForm(): void {
    this.form = new FormGroup({
      paymentTerms: new FormControl(null),
      requestPaymentCard: new FormControl(null),
      hasDaysInDefault: new FormControl(null),
      addEnforcementAction: new FormControl(null),
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
    this.paymentTermsListener();
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
    const { hasDaysInDefault } = this.form.controls;

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
    this.isAdult = !formData.DOB || this.dateService.calculateAge(formData.DOB) >= 18;
  }

  private paymentTermsListener(): void {
    const { paymentTerms } = this.form.controls;

    paymentTerms.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((selectedTerm) => {
      const controls =
        this.paymentTermsControls[selectedTerm as keyof IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation];

      controls.fieldsToRemove.forEach((control: IFinesMacPaymentTermsPaymentTermOptionsControlValidation) => {
        this.removeControl(control.controlName);
        this.removeControlErrors(control.controlName);
      });

      controls.fieldsToAdd.forEach((control: IFinesMacPaymentTermsPaymentTermOptionsControlValidation) => {
        this.createControl(control.controlName, control.validators);
      });
    });
  }

  public override ngOnInit(): void {
    this.initialPaymentTermsSetup();
    super.ngOnInit();
  }
}
