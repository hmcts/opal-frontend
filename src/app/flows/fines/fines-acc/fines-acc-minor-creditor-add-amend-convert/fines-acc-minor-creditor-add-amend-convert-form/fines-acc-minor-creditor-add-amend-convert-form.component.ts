import { CommonModule } from '@angular/common';
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
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  NUMERIC_PATTERN,
  SINGLE_ASCII_CHARACTERS,
} from '@hmcts/opal-frontend-common/constants';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
  GovukCheckboxesConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { distinctUntilChanged, takeUntil } from 'rxjs';
import { FINES_MAC_TITLE_DROPDOWN_OPTIONS } from '../../../fines-mac/constants/fines-mac-title-dropdown-options.constant';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { IFinesAccMinorCreditorAddAmendConvertForm } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-form.interface';
import { IFinesAccMinorCreditorAddAmendConvertFieldErrors } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-field-errors.interface';
import { IFinesAccMinorCreditorAddAmendConvertState } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-state.interface';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FORM } from '../constants/fines-acc-minor-creditor-add-amend-convert-form.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FIELD_ERRORS } from '../constants/fines-acc-minor-creditor-add-amend-convert-field-errors.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES } from '../constants/fines-acc-minor-creditor-add-amend-convert-control-names.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CREDITOR_TYPES } from '../constants/fines-acc-minor-creditor-add-amend-convert-creditor-types.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES } from '../constants/fines-acc-minor-creditor-add-amend-convert-control-names-individual.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES } from '../constants/fines-acc-minor-creditor-add-amend-convert-control-names-company.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_BACS_CONTROL_NAMES } from '../constants/fines-acc-minor-creditor-add-amend-convert-control-names-bacs.constant';

const SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR = patternValidator(SINGLE_ASCII_CHARACTERS, 'singleAsciiCharacters');
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);
const NUMERIC_PATTERN_VALIDATOR = patternValidator(NUMERIC_PATTERN, 'numericalTextPattern');

@Component({
  selector: 'app-fines-acc-minor-creditor-add-amend-convert-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukErrorSummaryComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukSelectComponent,
    GovukTextInputComponent,
    CapitalisationDirective,
    GovukRadiosConditionalComponent,
    GovukHeadingWithCaptionComponent,
  ],
  templateUrl: './fines-acc-minor-creditor-add-amend-convert-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorAddAmendConvertFormComponent
  extends AbstractFormBaseComponent
  implements OnInit, OnDestroy
{
  private readonly finesAccStore = inject(FinesAccountStore);
  protected override formSubmit = new EventEmitter<IFinesAccMinorCreditorAddAmendConvertForm>();
  protected readonly accountNumber = this.finesAccStore.getAccountNumber();
  protected readonly partyName = this.finesAccStore.party_name();

  @Output() public cancelRequested = new EventEmitter<void>();
  @Input({ required: false }) public initialFormData: IFinesAccMinorCreditorAddAmendConvertForm =
    FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FORM;

  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};
  public readonly controls = FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES;
  public readonly creditorTypes = FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CREDITOR_TYPES;
  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
  public readonly individualConditionalId = 'facc_minor_creditor_creditor_type_individual_conditional';
  public readonly companyConditionalId = 'facc_minor_creditor_creditor_type_company_conditional';

  public override fieldErrors: IFinesAccMinorCreditorAddAmendConvertFieldErrors = {
    ...FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FIELD_ERRORS,
  };

  /**
   * Gets a form control by name, cast to the correct type for ease of use in validation and value retrieval.
   * @param controlName The name of the form control.
   * @returns The form control cast to the correct type.
   */
  private getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  /**
   * Checks if a value is considered "filled" for the purposes of form validation.
   * @param value The value to check.
   * @returns True if the value is considered filled, false otherwise.
   */
  private hasValue(value: unknown): boolean {
    return typeof value === 'string' ? !!value.trim() : value !== null && value !== undefined && value !== false;
  }

  /**
   * Checks if any of the specified controls have a value that should be considered for validation. Used to determine if the creditor details are sufficiently filled based on the selected creditor type.
   * @param controlNames The names of the form controls to check.
   * @returns True if any of the specified controls have a value, false otherwise.
   */
  private hasAnyControlValue(controlNames: readonly string[]): boolean {
    return controlNames.some((controlName) => this.hasValue(this.form.get(controlName)?.value));
  }

  /**
   * Validator function for minor creditor details. Ensures that the appropriate details are filled based on the selected creditor type.
   * @returns A ValidatorFn that checks the minor creditor details.
   */
  private minorCreditorDetailsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === 'individual') {
        return this.hasAnyControlValue(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES)
          ? null
          : { minorCreditorDetailsMissing: true };
      }

      if (control.value === 'company') {
        return this.hasAnyControlValue(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES)
          ? null
          : { minorCreditorDetailsMissing: true };
      }

      return null;
    };
  }

  /**
   * Adds a control with validators, or updates validators when the control already exists.
   * @param controlName The name of the form control.
   * @param validators The validators to apply to the control.
   */
  private addOrUpdateControl(controlName: string, validators: ValidatorFn[]): void {
    if (this.form.get(controlName)) {
      this.updateControl(controlName, validators);
      return;
    }

    this.createControl(controlName, validators);
  }

  /**
   * Removes the specified controls from the form using the base form helper.
   * @param controlNames The names of the form controls to remove.
   */
  private removeControls(controlNames: readonly string[]): void {
    controlNames.forEach((controlName) => {
      if (this.form.get(controlName)) {
        this.removeControl(controlName);
      }
    });
  }

  /**
   * Sets up listeners for active creditor detail controls so the creditor type summary validation updates as details are entered.
   * @param controlNames The names of the active creditor detail controls.
   */
  private setupCreditorDetailValidationListeners(controlNames: readonly string[]): void {
    controlNames.forEach((controlName) => {
      this.getControl(controlName)
        .valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged())
        .subscribe(() => this.updateCreditorTypeValidity());
    });
  }

  /**
   * Resets all error messages to their initial state after dynamic controls have changed.
   */
  private resetErrorMessages(): void {
    this.clearAllErrorMessages();
    this.setInitialErrorMessages();
  }

  /**
   * Adds individual creditor detail controls with their validators.
   */
  private addIndividualControls(formData?: IFinesAccMinorCreditorAddAmendConvertState): void {
    this.addOrUpdateControl(this.controls.title, [Validators.required]);
    this.addOrUpdateControl(this.controls.forenames, [
      Validators.required,
      Validators.maxLength(20),
      SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
    ]);
    this.addOrUpdateControl(this.controls.surname, [
      Validators.required,
      Validators.maxLength(30),
      SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
    ]);

    if (formData) {
      this.rePopulateForm(formData);
    }

    this.setupCreditorDetailValidationListeners(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES);
  }

  /**
   * Adds company creditor detail controls with their validators.
   */
  private addCompanyControls(formData?: IFinesAccMinorCreditorAddAmendConvertState): void {
    this.addOrUpdateControl(this.controls.companyName, [
      Validators.required,
      Validators.maxLength(50),
      SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
    ]);

    if (formData) {
      this.rePopulateForm(formData);
    }

    this.setupCreditorDetailValidationListeners(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES);
  }

  /**
   * Adds BACS payment detail controls with their validators.
   */
  private addPaymentDetailControls(formData?: IFinesAccMinorCreditorAddAmendConvertState): void {
    this.addOrUpdateControl(this.controls.bankAccountName, [
      Validators.required,
      Validators.maxLength(18),
      SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
    ]);
    this.addOrUpdateControl(this.controls.bankSortCode, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      NUMERIC_PATTERN_VALIDATOR,
    ]);
    this.addOrUpdateControl(this.controls.bankAccountNumber, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(8),
      NUMERIC_PATTERN_VALIDATOR,
    ]);
    this.addOrUpdateControl(this.controls.bankAccountReference, [Validators.required, Validators.maxLength(18)]);

    if (formData) {
      this.rePopulateForm(formData);
    }
  }

  /**
   * Updates the validity of the creditor type control. This is typically called after changes to individual or company creditor details to ensure that the creditor type control reflects the current state of the form.
   */
  private updateCreditorTypeValidity(): void {
    this.getControl(this.controls.creditorType).updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  /**
   * Handles changes to the creditor type by replacing the active creditor detail controls.
   * @param selectedType The selected creditor type, either 'individual' or 'company'.
   * @param formData The initial form data to patch into newly-added controls.
   */
  private handleCreditorTypeChange(
    selectedType: string | null,
    formData?: IFinesAccMinorCreditorAddAmendConvertState,
  ): void {
    this.removeControls([
      ...FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES,
      ...FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES,
    ]);

    const isIndividual = selectedType === 'individual';
    const isCompany = selectedType === 'company';

    if (isIndividual) {
      this.addIndividualControls(formData);
    }

    if (isCompany) {
      this.addCompanyControls(formData);
    }

    this.updateCreditorTypeValidity();
  }

  /**
   * Handles changes to payment details by replacing the active BACS controls.
   * @param hasPaymentDetails Whether the payment details are provided.
   * @param formData The initial form data to patch into newly-added controls.
   */
  private handlePaymentDetailsChange(
    hasPaymentDetails: boolean,
    formData?: IFinesAccMinorCreditorAddAmendConvertState,
  ): void {
    this.removeControls(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_BACS_CONTROL_NAMES);

    if (hasPaymentDetails) {
      this.addPaymentDetailControls(formData);
    }
  }

  /**
   * Sets up dynamic validation for the form controls based on changes to the creditor type and payment details.
   */
  private setupDynamicValidation(): void {
    const creditorTypeControl = this.getControl(this.controls.creditorType);
    const payByBacsControl = this.getControl(this.controls.payByBacs);

    creditorTypeControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged()).subscribe((value) => {
      this.handleCreditorTypeChange(value);
      this.resetErrorMessages();
    });

    payByBacsControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged()).subscribe((value) => {
      this.handlePaymentDetailsChange(value === true);
      this.resetErrorMessages();
    });
  }

  /**
   * Creates the minor creditor amend form controls from the resolved initial form data.
   */
  private setupForm(): void {
    const { formData } = this.initialFormData;

    this.form = new FormGroup({
      [this.controls.creditorType]: this.createFormControl([Validators.required]),
      [this.controls.addressLine1]: this.createFormControl([
        Validators.maxLength(30),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.addressLine2]: this.createFormControl([
        Validators.maxLength(30),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.addressLine3]: this.createFormControl([
        Validators.maxLength(16),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.addressLine4]: this.createFormControl([
        Validators.maxLength(16),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.addressLine5]: this.createFormControl([
        Validators.maxLength(16),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.postCode]: this.createFormControl([
        Validators.maxLength(8),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      [this.controls.payByBacs]: new FormControl(formData.facc_minor_creditor_pay_by_bacs ?? false),
    });

    this.rePopulateForm({
      ...formData,
      [this.controls.payByBacs]: formData.facc_minor_creditor_pay_by_bacs ?? false,
    });
    this.updateControl(this.controls.creditorType, [Validators.required, this.minorCreditorDetailsValidator()]);
    this.handleCreditorTypeChange(formData.facc_minor_creditor_creditor_type, formData);
    this.handlePaymentDetailsChange(formData.facc_minor_creditor_pay_by_bacs === true, formData);
    this.setupDynamicValidation();
    this.setInitialErrorMessages();
  }

  /**
   * Initialises the form before wiring up shared form behaviour.
   */
  public override ngOnInit(): void {
    this.setupForm();
    super.ngOnInit();
  }

  /**
   * Emits the cancel action so the routed parent can navigate while preserving guard state.
   */
  public handleCancel(): void {
    this.unsavedChanges.emit(this.hasUnsavedChanges());
    this.cancelRequested.emit();
  }
}
