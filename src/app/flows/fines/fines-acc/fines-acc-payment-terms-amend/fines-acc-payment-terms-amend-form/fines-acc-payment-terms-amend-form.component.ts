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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IFinesAccPaymentTermsAmendForm } from '../interfaces/fines-acc-payment-terms-amend-form.interface';
import { IFinesAccPaymentTermsAmendFieldErrors } from '../interfaces/fines-acc-payment-terms-amend-field-errors.interface';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FIELD_ERRORS } from '../constants/fines-acc-payment-terms-amend-field-errors.constant';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM } from '../constants/fines-acc-payment-terms-amend-form.constant';
import { FINES_ACC_PAYMENT_TERMS_AMEND_OPTIONS } from '../constants/fines-acc-payment-terms-amend-options.constant';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FREQUENCY_OPTIONS } from '../constants/fines-acc-payment-terms-amend-frequency-options.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { IGovUkRadioOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio/interfaces';
import { takeUntil } from 'rxjs';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';

// GovUK Components
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukTextInputPrefixSuffixComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input-prefix-suffix';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';

// Validators
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  TWO_DECIMAL_PLACES_PATTERN,
  NUMERIC_PATTERN,
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
} from '@hmcts/opal-frontend-common/constants';

// regex pattern validators for the form controls
const TWO_DECIMAL_PLACES_PATTERN_VALIDATOR = patternValidator(TWO_DECIMAL_PLACES_PATTERN, 'invalidDecimal');
const NUMERIC_PATTERN_VALIDATOR = patternValidator(NUMERIC_PATTERN, 'numericalTextPattern');
const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericWithHyphensSpacesApostrophesDotPattern',
);

@Component({
  selector: 'app-fines-acc-payment-terms-amend-form',
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
    GovukTextInputPrefixSuffixComponent,
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
    MojDatePickerComponent,
    MojTicketPanelComponent,
    GovukTextAreaComponent,
  ],
  templateUrl: './fines-acc-payment-terms-amend-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPaymentTermsAmendFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  protected readonly dateService = inject(DateService);
  protected readonly accountStore = inject(FinesAccountStore);
  @Output() protected override formSubmit = new EventEmitter<IFinesAccPaymentTermsAmendForm>();
  protected readonly finesAccRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;

  public readonly FINES_ACC_SECTION_BREAK = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES.hr2;
  public dateInFuture!: boolean;
  public dateInPast!: boolean;
  @Input({ required: false }) public initialFormData: IFinesAccPaymentTermsAmendForm =
    FINES_ACC_PAYMENT_TERMS_AMEND_FORM;
  override fieldErrors: IFinesAccPaymentTermsAmendFieldErrors = {
    ...FINES_ACC_PAYMENT_TERMS_AMEND_FIELD_ERRORS,
  };

  public readonly paymentTermOptions = FINES_ACC_PAYMENT_TERMS_AMEND_OPTIONS;
  public readonly paymentTerms: IGovUkRadioOptions[] = Object.entries(this.paymentTermOptions).map(([key, value]) => ({
    key,
    value,
  }));
  public readonly frequencyOptions: IGovUkRadioOptions[] = Object.entries(
    FINES_ACC_PAYMENT_TERMS_AMEND_FREQUENCY_OPTIONS,
  ).map(([key, value]) => ({ key, value }));

  public today!: string;
  public yesterday!: string;

  /**
   * Sets up the payment terms form structure
   */
  private setupPaymentTermsForm(): void {
    this.form = new FormGroup({
      // Payment Terms
      facc_payment_terms_payment_terms: new FormControl(null, [Validators.required]),
      facc_payment_terms_pay_by_date: new FormControl(null, [optionalValidDateValidator()]),
      facc_payment_terms_lump_sum_amount: new FormControl(null, [
        NUMERIC_PATTERN_VALIDATOR,
        TWO_DECIMAL_PLACES_PATTERN_VALIDATOR,
      ]),
      facc_payment_terms_instalment_amount: new FormControl(null, [
        NUMERIC_PATTERN_VALIDATOR,
        TWO_DECIMAL_PLACES_PATTERN_VALIDATOR,
      ]),
      facc_payment_terms_instalment_period: new FormControl(null),
      facc_payment_terms_start_date: new FormControl(null, [optionalValidDateValidator()]),

      // Payment Card and Default Days
      facc_payment_terms_payment_card_request: new FormControl(null),
      facc_payment_terms_has_days_in_default: new FormControl(null),
      facc_payment_terms_suspended_committal_date: new FormControl(null, [optionalValidDateValidator()]),
      facc_payment_terms_default_days_in_jail: new FormControl(null, [
        optionalMaxLengthValidator(5),
        NUMERIC_PATTERN_VALIDATOR,
      ]),
      facc_payment_terms_reason_for_change: new FormControl(null, [
        Validators.required,
        optionalMaxLengthValidator(250),
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
      ]),
      facc_payment_terms_change_letter: new FormControl(null),
    });
  }

  /**
   * Listens for changes in the payment terms control and performs actions based on the selected term.
   */
  private paymentTermsListener(): void {
    const paymentTermsControl = this.form.get('facc_payment_terms_payment_terms');
    const payByDateControl = this.form.get('facc_payment_terms_pay_by_date');
    const lumpSumAmountControl = this.form.get('facc_payment_terms_lump_sum_amount');
    const instalmentAmountControl = this.form.get('facc_payment_terms_instalment_amount');
    const instalmentPeriodControl = this.form.get('facc_payment_terms_instalment_period');
    const startDateControl = this.form.get('facc_payment_terms_start_date');

    if (paymentTermsControl) {
      paymentTermsControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
        // Clear previous validators
        payByDateControl?.clearValidators();
        lumpSumAmountControl?.clearValidators();
        instalmentAmountControl?.clearValidators();
        instalmentPeriodControl?.clearValidators();
        startDateControl?.clearValidators();

        // Set base validators
        payByDateControl?.setValidators([optionalValidDateValidator()]);
        lumpSumAmountControl?.setValidators([TWO_DECIMAL_PLACES_PATTERN_VALIDATOR]);
        instalmentAmountControl?.setValidators([TWO_DECIMAL_PLACES_PATTERN_VALIDATOR]);
        startDateControl?.setValidators([optionalValidDateValidator()]);

        // Add required validators based on selection
        switch (value) {
          case 'payInFull':
            payByDateControl?.addValidators([Validators.required]);
            break;
          case 'instalmentsOnly':
            instalmentAmountControl?.addValidators([Validators.required]);
            instalmentPeriodControl?.setValidators([Validators.required]);
            startDateControl?.addValidators([Validators.required]);
            break;
          case 'lumpSumPlusInstalments':
            lumpSumAmountControl?.addValidators([Validators.required]);
            instalmentAmountControl?.addValidators([Validators.required]);
            instalmentPeriodControl?.setValidators([Validators.required]);
            startDateControl?.addValidators([Validators.required]);
            break;
        }

        // Update validity
        payByDateControl?.updateValueAndValidity();
        lumpSumAmountControl?.updateValueAndValidity();
        instalmentAmountControl?.updateValueAndValidity();
        instalmentPeriodControl?.updateValueAndValidity();
        startDateControl?.updateValueAndValidity();
      });
    }
  }

  /**
   * Checks the validity of a date and sets flags indicating if the date is in the future or in the past.
   * @param dateValue - The date value to be checked.
   */
  private dateChecker(dateValue: string): void {
    this.dateInFuture = false;
    this.dateInPast = false;

    if (this.dateService.isValidDate(dateValue)) {
      this.dateInFuture = this.dateService.isDateInTheFuture(dateValue, 3);
      this.dateInPast = this.dateService.isDateInThePast(dateValue);
    }
  }

  /**
   * Resets the date checker flags to their initial state.
   */
  private resetDateChecker(): void {
    this.dateInFuture = false;
    this.dateInPast = false;
  }

  /**
   * Listens for changes in the specified control and performs a date check.
   * @param controlName - The name of the control to listen for changes.
   */
  private dateListener(controlName: string): void {
    const control = this.form.controls[controlName];

    control.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.dateChecker(value);
    });
  }

  /**
   * Sets up date listeners for all date fields
   */
  private setupDateListeners(): void {
    this.dateListener('facc_payment_terms_pay_by_date');
    this.dateListener('facc_payment_terms_start_date');
    this.dateListener('facc_payment_terms_suspended_committal_date');
  }

  /**
   * Sets up the initial payment terms for the fines-acc-payment-terms-amend-form component.
   * This method performs various setup tasks such as setting up the payment terms form,
   * adding conditional validators, setting initial error messages, and populating the form with the provided form data.
   * It also sets the `today` and `yesterday` properties with the appropriate date values.
   */
  private initialPaymentTermsForm(): void {
    const { formData } = this.initialFormData;
    this.setupPaymentTermsForm();
    this.paymentTermsListener();
    this.setupDateListeners();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.today = this.dateService.toFormat(this.dateService.getDateNow(), 'dd/MM/yyyy');
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  /**
   * Handles routing to the defendant details page
   */
  public handleRouteToDefendantDetails(): void {
    this['router'].navigate(['../../details'], {
      relativeTo: this['activatedRoute'],
      fragment: 'payment-terms',
    });
  }

  public override ngOnInit(): void {
    if (!this.initialFormData) {
      this.initialFormData = FINES_ACC_PAYMENT_TERMS_AMEND_FORM;
    }

    this.initialPaymentTermsForm();
    this.resetDateChecker();
    super.ngOnInit();
  }
}
