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
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FORM } from '../constants/fines-acc-minor-creditor-add-amend-convert-form.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FIELD_ERRORS } from '../constants/fines-acc-minor-creditor-add-amend-convert-field-errors.constant';
import {
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_BACS_CONTROL_NAMES,
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES,
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES,
  FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES,
} from '../constants/fines-acc-minor-creditor-add-amend-convert-control-names.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CREDITOR_TYPES } from '../constants/fines-acc-minor-creditor-add-amend-convert-creditor-types.constant';

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

  private getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  private hasValue(value: unknown): boolean {
    return typeof value === 'string' ? !!value.trim() : value !== null && value !== undefined && value !== false;
  }

  private hasAnyControlValue(controlNames: readonly string[]): boolean {
    return controlNames.some((controlName) => this.hasValue(this.form.get(controlName)?.value));
  }

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

  private resetControls(controlNames: readonly string[]): void {
    controlNames.forEach((controlName) => {
      this.getControl(controlName).reset(null, { emitEvent: false });
    });
  }

  private updateControlsValidity(controlNames: readonly string[]): void {
    controlNames.forEach((controlName) => {
      this.getControl(controlName).updateValueAndValidity({ emitEvent: false });
    });
  }

  private clearControlValidators(controlNames: readonly string[]): void {
    controlNames.forEach((controlName) => {
      this.getControl(controlName).clearValidators();
    });
    this.updateControlsValidity(controlNames);
  }

  private setControlsEnabled(controlNames: readonly string[], enabled: boolean): void {
    controlNames.forEach((controlName) => {
      const control = this.getControl(controlName);

      if (enabled) {
        control.enable({ emitEvent: false });
      } else {
        control.disable({ emitEvent: false });
      }

      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  private resetErrorMessages(): void {
    this.clearAllErrorMessages();
    this.setInitialErrorMessages();
  }

  private setIndividualValidators(): void {
    this.getControl(this.controls.title).setValidators([Validators.required]);
    this.getControl(this.controls.forenames).setValidators([
      Validators.required,
      Validators.maxLength(20),
      SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
    ]);
    this.getControl(this.controls.surname).setValidators([
      Validators.required,
      Validators.maxLength(30),
      SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
    ]);
    this.updateControlsValidity(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES);
  }

  private setCompanyValidators(): void {
    this.getControl(this.controls.companyName).setValidators([
      Validators.required,
      Validators.maxLength(50),
      SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
    ]);
    this.updateControlsValidity(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES);
  }

  private setPaymentDetailValidators(): void {
    this.getControl(this.controls.bankAccountName).setValidators([
      Validators.required,
      Validators.maxLength(18),
      SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
    ]);
    this.getControl(this.controls.bankSortCode).setValidators([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      NUMERIC_PATTERN_VALIDATOR,
    ]);
    this.getControl(this.controls.bankAccountNumber).setValidators([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(8),
      NUMERIC_PATTERN_VALIDATOR,
    ]);
    this.getControl(this.controls.bankAccountReference).setValidators([Validators.required, Validators.maxLength(18)]);
    this.updateControlsValidity(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_BACS_CONTROL_NAMES);
  }

  private updateCreditorTypeValidity(): void {
    this.getControl(this.controls.creditorType).updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  private handleCreditorTypeChange(selectedType: string | null, resetInactiveValues: boolean): void {
    this.clearControlValidators(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES);
    this.clearControlValidators(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES);

    const isIndividual = selectedType === 'individual';
    const isCompany = selectedType === 'company';

    if (resetInactiveValues) {
      if (isIndividual) {
        this.resetControls(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES);
      } else if (isCompany) {
        this.resetControls(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES);
      } else {
        this.resetControls([
          ...FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES,
          ...FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES,
        ]);
      }
    }

    this.setControlsEnabled(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES, isIndividual);
    this.setControlsEnabled(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES, isCompany);

    if (isIndividual) {
      this.setIndividualValidators();
    }

    if (isCompany) {
      this.setCompanyValidators();
    }

    this.updateCreditorTypeValidity();
  }

  private handlePaymentDetailsChange(hasPaymentDetails: boolean, resetValues: boolean): void {
    this.clearControlValidators(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_BACS_CONTROL_NAMES);

    if (resetValues && !hasPaymentDetails) {
      this.resetControls(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_BACS_CONTROL_NAMES);
    }

    this.setControlsEnabled(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_BACS_CONTROL_NAMES, hasPaymentDetails);

    if (hasPaymentDetails) {
      this.setPaymentDetailValidators();
    }
  }

  private setupDynamicValidation(): void {
    const creditorTypeControl = this.getControl(this.controls.creditorType);
    const payByBacsControl = this.getControl(this.controls.payByBacs);

    creditorTypeControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged()).subscribe((value) => {
      this.handleCreditorTypeChange(value, true);
      this.resetErrorMessages();
    });

    payByBacsControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged()).subscribe((value) => {
      this.handlePaymentDetailsChange(value === true, true);
      this.resetErrorMessages();
    });

    [
      ...FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_CONTROL_NAMES,
      ...FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_CONTROL_NAMES,
    ].forEach((controlName) => {
      this.getControl(controlName)
        .valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged())
        .subscribe(() => this.updateCreditorTypeValidity());
    });
  }

  /**
   * Creates the minor creditor amend form controls from the resolved initial form data.
   */
  private setupForm(): void {
    const { formData } = this.initialFormData;

    this.form = new FormGroup({
      [this.controls.creditorType]: new FormControl(formData.facc_minor_creditor_creditor_type, [Validators.required]),
      [this.controls.title]: new FormControl(formData.facc_minor_creditor_title),
      [this.controls.forenames]: new FormControl(formData.facc_minor_creditor_forenames),
      [this.controls.surname]: new FormControl(formData.facc_minor_creditor_surname),
      [this.controls.companyName]: new FormControl(formData.facc_minor_creditor_company_name),
      [this.controls.addressLine1]: new FormControl(formData.facc_minor_creditor_address_line_1, [
        Validators.maxLength(30),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.addressLine2]: new FormControl(formData.facc_minor_creditor_address_line_2, [
        Validators.maxLength(30),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.addressLine3]: new FormControl(formData.facc_minor_creditor_address_line_3, [
        Validators.maxLength(16),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.addressLine4]: new FormControl(formData.facc_minor_creditor_address_line_4, [
        Validators.maxLength(16),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.addressLine5]: new FormControl(formData.facc_minor_creditor_address_line_5, [
        Validators.maxLength(16),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      [this.controls.postCode]: new FormControl(formData.facc_minor_creditor_post_code, [
        Validators.maxLength(8),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      [this.controls.payByBacs]: new FormControl(formData.facc_minor_creditor_pay_by_bacs ?? false),
      [this.controls.bankAccountName]: new FormControl(formData.facc_minor_creditor_bank_account_name),
      [this.controls.bankSortCode]: new FormControl(formData.facc_minor_creditor_bank_sort_code),
      [this.controls.bankAccountNumber]: new FormControl(formData.facc_minor_creditor_bank_account_number),
      [this.controls.bankAccountReference]: new FormControl(formData.facc_minor_creditor_bank_account_reference),
    });

    this.getControl(this.controls.creditorType).addValidators(this.minorCreditorDetailsValidator());
    this.handleCreditorTypeChange(formData.facc_minor_creditor_creditor_type, false);
    this.handlePaymentDetailsChange(formData.facc_minor_creditor_pay_by_bacs === true, false);
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
