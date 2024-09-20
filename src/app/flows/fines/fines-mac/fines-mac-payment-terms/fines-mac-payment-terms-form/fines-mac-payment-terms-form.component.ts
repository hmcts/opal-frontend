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
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_PAYMENT_TERMS as PT_CONTROL_PAYMENT_TERMS } from '../constants/controls/fines-mac-payment-terms-controls-payment-terms.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_REQUEST_CARD_PAYMENT as PT_CONTROL_REQUEST_CARD_PAYMENT } from '../constants/controls/fines-mac-payment-terms-controls-request-card-payment.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_HAS_DAYS_IN_DEFAULT as PT_CONTROL_HAS_DAYS_IN_DEFAULT } from '../constants/controls/fines-mac-payment-terms-controls-has-days-in-default.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_ADD_ENFORCEMENT_ACTION as PT_CONTROL_ADD_ENFORCEMENT_ACTION } from '../constants/controls/fines-mac-payment-terms-controls-add-enforcement-action.constant';
import { IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-all-payment-term-options-control-validation.interface';
import { FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS } from '../constants/fines-mac-payment-terms-frequency-options';
import { FINES_MAC_PAYMENT_TERMS_ALL_PAYMENT_TERM_OPTIONS_CONTROL_VALIDATION } from '../constants/fines-mac-payment-terms-all-payment-term-options-control-validation';
import { IFinesMacPaymentTermsPaymentTermOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-payment-term-options-control-validation.interface';
import { FINES_MAC_DEFENDANT_TYPES } from '../../constants/fines-mac-defendant-types';
import { IFinesMacDefendantTypes } from '../../interfaces/fines-mac-defendant-types.interface';
import { GovukRadiosConditionalComponent } from '@components/govuk/govuk-radio/govuk-radios-conditional/govuk-radios-conditional.component';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
import { GovukTextAreaComponent } from '@components/govuk/govuk-text-area/govuk-text-area.component';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT as PT_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT } from '../constants/controls/fines-mac-payment-terms-controls-hold-enforcement-on-account.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF as PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF } from '../constants/controls/fines-mac-payment-terms-controls-hold-enforcement-reason.constant';

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
    GovukTextInputPrefixSuffixComponent,
    FinesMacDefaultDaysComponent,
    GovukErrorSummaryComponent,
    MojDatePickerComponent,
    MojTicketPanelComponent,
    GovukTextAreaComponent,
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

  protected readonly defendantTypes = FINES_MAC_DEFENDANT_TYPES;
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
  public dateInFuture!: boolean;
  public dateInPast!: boolean;
  public accessDefaultDates!: boolean;

  /**
   * Sets up the payment terms form.
   */
  private setupPaymentTermsForm(): void {
    this.form = new FormGroup({
      [PT_CONTROL_PAYMENT_TERMS.controlName]: this.createFormControl(PT_CONTROL_PAYMENT_TERMS.validators),
      [PT_CONTROL_REQUEST_CARD_PAYMENT.controlName]: this.createFormControl(PT_CONTROL_REQUEST_CARD_PAYMENT.validators),
      [PT_CONTROL_HAS_DAYS_IN_DEFAULT.controlName]: this.createFormControl(PT_CONTROL_HAS_DAYS_IN_DEFAULT.validators),
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
    this.createEnforcementFields();
    this.canAccessDefaultDates();
    this.hasDaysInDefaultListener();
    this.paymentTermsListener();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
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
        FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION.forEach((control) => {
          this.createControl(control.controlName, control.validators);
        });
      } else {
        FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION.forEach((control) => {
          this.removeControl(control.controlName);
        });
      }
    });
  }

  /**
   * Listens for changes in the payment terms control and performs necessary actions based on the selected term.
   * @private
   * @returns {void}
   */
  private handleControl(
    control: IFinesMacPaymentTermsPaymentTermOptionsControlValidation,
    action: 'add' | 'remove',
  ): void {
    if (action === 'remove') {
      this.removeControl(control.controlName);
      this.removeControlErrors(control.controlName);
      this.resetDateChecker();
    } else if (action === 'add') {
      this.createControl(control.controlName, control.validators);
      if (control.controlName === 'start_date' || control.controlName === 'pay_by_date') {
        this.dateListener(control.controlName);
      }
    }
  }

  /**
   * Listens for changes in the payment terms control and performs actions based on the selected term.
   */
  private paymentTermsListener(): void {
    const { payment_terms: paymentTerms } = this.form.controls;

    paymentTerms.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((selectedTerm) => {
      const controls =
        this.paymentTermsControls[selectedTerm as keyof IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation];

      if (!controls) {
        return;
      }

      controls.fieldsToRemove?.forEach((control: IFinesMacPaymentTermsPaymentTermOptionsControlValidation) => {
        this.handleControl(control, 'remove');
      });

      controls.fieldsToAdd?.forEach((control: IFinesMacPaymentTermsPaymentTermOptionsControlValidation) => {
        this.handleControl(control, 'add');
      });
    });
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
   * Listens for changes in the specified control and performs a date check.
   *
   * @param controlName - The name of the control to listen for changes.
   */
  private dateListener(controlName: string): void {
    const control = this.form.controls[controlName];

    control.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((value) => {
      this.dateChecker(value);
    });
  }

  /**
   * Resets the date checker flags to their initial state.
   */
  private resetDateChecker(): void {
    this.dateInFuture = false;
    this.dateInPast = false;
  }

  /**
   * Determines whether the user can access default dates based on the defendant type.
   */
  private canAccessDefaultDates(): void {
    let formData;
    switch (this.defendantTypes[this.defendantType as keyof IFinesMacDefendantTypes]) {
      case this.defendantTypes.adultOrYouthOnly:
        formData = this.finesService.finesMacState.personalDetails.formData;
        this.accessDefaultDates = !formData.dob || this.dateService.calculateAge(formData.dob) >= 18;
        break;
      case this.defendantTypes.parentOrGuardianToPay:
        this.accessDefaultDates = true;
        break;
      default:
        this.accessDefaultDates = false;
    }
  }

  /**
   * Listens to changes in the hold_enforcement_on_account form control and performs actions accordingly.
   */
  private holdEnforcementOnAccountListener(): void {
    const { hold_enforcement_on_account: holdEnforcementOnAccount } = this.form.controls;

    holdEnforcementOnAccount.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      if (holdEnforcementOnAccount.value === true) {
        this.createControl(
          PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF.controlName,
          PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF.validators,
        );
      } else {
        this.removeControl(PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF.controlName);
      }
    });
  }

  /**
   * Creates enforcement fields based on the defendant type.
   * If the defendant type is a company, it creates the control for holding enforcement on account.
   * Otherwise, it creates the control for adding enforcement action.
   */
  private createEnforcementFields(): void {
    if (this.defendantTypes[this.defendantType as keyof IFinesMacDefendantTypes] === this.defendantTypes.company) {
      this.createControl(
        PT_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT.controlName,
        PT_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT.validators,
      );
      this.holdEnforcementOnAccountListener();
    } else {
      this.createControl(PT_CONTROL_ADD_ENFORCEMENT_ACTION.controlName, PT_CONTROL_ADD_ENFORCEMENT_ACTION.validators);
    }
  }

  public override ngOnInit(): void {
    this.initialPaymentTermsSetup();
    super.ngOnInit();
  }
}
