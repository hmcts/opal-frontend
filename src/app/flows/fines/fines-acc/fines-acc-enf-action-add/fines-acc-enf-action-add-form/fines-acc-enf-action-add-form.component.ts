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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukTextInputPrefixSuffixComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input-prefix-suffix';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { NUMERIC_PATTERN, SINGLE_ASCII_CHARACTERS } from '@hmcts/opal-frontend-common/constants';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { FINES_PAYMENT_TERMS_FREQUENCY_OPTIONS } from '../../../constants/fines-payment-terms-frequency-options.constant';
import { FINES_PAYMENT_TERMS_OPTIONS } from '../../../constants/fines-payment-terms-options.constant';
import { FinesMacDefaultDaysComponent } from '../../../fines-mac/components/fines-mac-default-days/fines-mac-default-days.component';
import { takeUntil } from 'rxjs';
import { FINES_ACC_ENF_ACTION_ADD_CLEAR_PAYMENT_TERMS_CONTROL_NAMES } from '../constants/fines-acc-enf-action-add-clear-payment-terms-control-names.constant';
import { FINES_ACC_ENF_ACTION_ADD_CONTROL_PREFIX } from '../constants/fines-acc-enf-action-add-control-prefix.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';
import { FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES } from '../constants/fines-acc-enf-action-add-control-names.constant';
import { FINES_ACC_ENF_ACTION_ADD_INPUT_PREFIX } from '../constants/fines-acc-enf-action-add-input-prefix.constant';
import { FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERMS_CONDITIONAL_ID_PREFIX } from '../constants/fines-acc-enf-action-add-payment-terms-conditional-id-prefix.constant';
import { FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS } from '../constants/fines-acc-enf-action-add-payment-term-keys.constant';
import { FINES_ACC_ENF_ACTION_ADD_TEXT_INPUT_MAX_LENGTH_CLASSES } from '../constants/fines-acc-enf-action-add-text-input-max-length-classes.constant';
import { FinesAccEnfActionAddService } from '../services/fines-acc-enf-action-add.service';
import { IFinesAccEnfActionAddFormState } from '../interfaces/fines-acc-enf-action-add-form-state.interface';
import { IFinesAccEnfActionAddFormField } from '../interfaces/fines-acc-enf-action-add-form-field.interface';

const CONTROL_NAMES = FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES;
const FIELD_TYPES = FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES;
const DECIMAL_NUMERIC_PATTERN_VALIDATOR = patternValidator(/^\d+(\.\d+)?$/, 'numericalTextPattern');
const TWO_DECIMAL_PLACES_PATTERN_VALIDATOR = patternValidator(/^\d+\.\d{2}$/, 'invalidDecimal');
const NUMERIC_PATTERN_VALIDATOR = patternValidator(NUMERIC_PATTERN, 'numericalTextPattern');
const SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR = patternValidator(SINGLE_ASCII_CHARACTERS, 'singleAsciiCharacters');

@Component({
  selector: 'app-fines-acc-enf-action-add-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
    GovukRadioComponent,
    GovukRadiosConditionalComponent,
    GovukRadiosItemComponent,
    GovukTextInputComponent,
    GovukTextInputPrefixSuffixComponent,
    GovukTextAreaComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    AlphagovAccessibleAutocompleteComponent,
    MojDatePickerComponent,
    FinesMacDefaultDaysComponent,
  ],
  templateUrl: './fines-acc-enf-action-add-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FinesAccEnfActionAddFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly addService = inject(FinesAccEnfActionAddService);
  private readonly dateService = inject(DateService);

  protected override fieldErrors: IAbstractFormBaseFieldErrors = {};
  protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAccEnfActionAddFormState>>();
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};
  public readonly paymentTerms = Object.entries(FINES_PAYMENT_TERMS_OPTIONS).map(([key, value]) => ({ key, value }));
  public readonly frequencyOptions = Object.entries(FINES_PAYMENT_TERMS_FREQUENCY_OPTIONS).map(([key, value]) => ({
    key,
    value,
  }));
  public readonly formControlNames = FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES;
  public readonly fieldTypes = FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES;
  public readonly paymentTermKeys = FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS;
  public readonly paymentTermsConditionalIdPrefix = FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERMS_CONDITIONAL_ID_PREFIX;
  public showPaymentTermsFields = false;

  @Input({ required: true }) public accountNumber!: string;
  @Input({ required: true }) public actionTitle!: string;
  @Input({ required: true }) public fields!: IFinesAccEnfActionAddFormField[];
  @Input({ required: true }) public partyName!: string;
  @Input({ required: true }) public showPaymentTerms!: boolean;
  @Output() public cancelRequested = new EventEmitter<void>();

  /**
   * Creates the dynamic form controls and validators from the mapped result parameter structure.
   */
  private setupForm(): void {
    const controls: Record<string, FormControl<string | boolean | null>> = {};
    const validators: ValidatorFn[] = [];

    this.fields.forEach((field) => {
      controls[field.controlName] = new FormControl<string | null>(null, this.getFieldValidators(field));

      if (field.type === FIELD_TYPES.menuCheckbox) {
        field.checkboxControls?.forEach((checkbox) => {
          controls[checkbox.controlName] = new FormControl<boolean | null>(false);
        });
      }

      if (field.welshControlName) {
        controls[field.welshControlName] = new FormControl<string | null>(null, this.getFieldValidators(field));
        validators.push(this.addService.pairedLanguageValidator(field.controlName, field.welshControlName));
      }
    });

    if (this.showPaymentTerms) {
      controls[CONTROL_NAMES.addPaymentTerms] = new FormControl<boolean | null>(null, Validators.required);
      controls[CONTROL_NAMES.paymentTerms] = new FormControl<string | null>(null);
      controls[CONTROL_NAMES.payByDate] = new FormControl<string | null>(null, optionalValidDateValidator());
      controls[CONTROL_NAMES.instalmentAmount] = new FormControl<string | null>(null, [
        DECIMAL_NUMERIC_PATTERN_VALIDATOR,
        TWO_DECIMAL_PLACES_PATTERN_VALIDATOR,
      ]);
      controls[CONTROL_NAMES.instalmentPeriod] = new FormControl<string | null>(null);
      controls[CONTROL_NAMES.startDate] = new FormControl<string | null>(null, optionalValidDateValidator());
      controls[CONTROL_NAMES.lumpSumAmount] = new FormControl<string | null>(null, [
        DECIMAL_NUMERIC_PATTERN_VALIDATOR,
        TWO_DECIMAL_PLACES_PATTERN_VALIDATOR,
      ]);
      controls[CONTROL_NAMES.daysInDefault] = new FormControl<string | null>(null, NUMERIC_PATTERN_VALIDATOR);
      controls[CONTROL_NAMES.dateDaysInDefaultImposed] = new FormControl<string | null>(
        null,
        optionalValidDateValidator(),
      );
    }

    this.form = new FormGroup(controls, validators);
    this.setupCheckboxListeners();
  }

  /**
   * Applies payment term conditional validators when the operator opts to add payment terms.
   */
  private setupPaymentTermsListeners(): void {
    if (!this.showPaymentTerms) return;

    this.form
      .get(CONTROL_NAMES.addPaymentTerms)!
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        const paymentTermsControl = this.form.get(CONTROL_NAMES.paymentTerms)!;
        this.showPaymentTermsFields = value === true;
        if (this.showPaymentTermsFields) {
          paymentTermsControl.setValidators(Validators.required);
        } else {
          paymentTermsControl.clearValidators();
          this.clearPaymentTermsControls();
        }
        paymentTermsControl.updateValueAndValidity();
      });

    this.form
      .get(CONTROL_NAMES.paymentTerms)!
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => this.setPaymentTermsValidators(value));
  }

  /**
   * Builds validators for one dynamic field based on the mapped API field type.
   */
  private getFieldValidators(field: IFinesAccEnfActionAddFormField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    switch (field.type) {
      case FIELD_TYPES.date:
        validators.push(optionalValidDateValidator());
        break;
      case FIELD_TYPES.decimal:
        validators.push(DECIMAL_NUMERIC_PATTERN_VALIDATOR, TWO_DECIMAL_PLACES_PATTERN_VALIDATOR);
        if (typeof field.max === 'number') {
          validators.push(Validators.max(field.max));
        }
        break;
      case FIELD_TYPES.integer:
        validators.push(NUMERIC_PATTERN_VALIDATOR);
        if (typeof field.min === 'number') {
          validators.push(Validators.min(field.min));
        }
        if (typeof field.max === 'number') {
          validators.push(Validators.max(field.max));
        }
        break;
      case FIELD_TYPES.text:
        validators.push(SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR);
        if (typeof field.min === 'number' && field.min > 0) {
          validators.push(Validators.minLength(field.min));
        }
        if (typeof field.max === 'number') {
          validators.push(Validators.maxLength(field.max));
        }
        break;
      case FIELD_TYPES.textarea:
        validators.push(SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR);
        if (typeof field.min === 'number' && field.min > 0) {
          validators.push(Validators.minLength(field.min));
        }
        if (typeof field.max === 'number') {
          validators.push(Validators.maxLength(field.max));
        }
        break;
      case FIELD_TYPES.menuCheckbox:
        validators.push(this.checkboxSelectionCountValidator(field));
        break;
    }

    return validators;
  }

  /**
   * Keeps the hidden checkbox group control in sync with the rendered checkbox controls.
   */
  private setupCheckboxListeners(): void {
    this.fields
      .filter((field) => field.type === FIELD_TYPES.menuCheckbox)
      .forEach((field) => {
        field.checkboxControls?.forEach((checkbox) => {
          this.form
            .get(checkbox.controlName)!
            .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this.updateCheckboxRootControl(field));
        });

        this.updateCheckboxRootControl(field);
      });
  }

  /**
   * Stores selected checkbox values on the root control so standard form submission includes them.
   */
  private updateCheckboxRootControl(field: IFinesAccEnfActionAddFormField): void {
    const selectedValues = this.selectedCheckboxOptions(field).map((option) => option.value.toString());
    const rootControl = this.form.get(field.controlName);

    rootControl?.setValue(selectedValues.length > 0 ? selectedValues.join(',') : null, { emitEvent: false });
    rootControl?.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Validates menu-checkbox selection counts against the API min/max contract.
   */
  private checkboxSelectionCountValidator(field: IFinesAccEnfActionAddFormField): ValidatorFn {
    return () => {
      const selectedCount = this.selectedCheckboxOptions(field).length;
      const min = typeof field.min === 'number' ? field.min : field.required ? 1 : 0;
      const max = typeof field.max === 'number' ? field.max : undefined;

      if (selectedCount < min) return { required: true };
      if (max !== undefined && selectedCount > max) return { max: true };
      return null;
    };
  }

  /**
   * Clears all controls that belong to the optional payment terms section.
   */
  private clearPaymentTermsControls(): void {
    FINES_ACC_ENF_ACTION_ADD_CLEAR_PAYMENT_TERMS_CONTROL_NAMES.forEach((controlName) =>
      this.form.get(controlName)?.setValue(null),
    );
  }

  /**
   * Applies validators for the currently selected payment terms option.
   */
  private setPaymentTermsValidators(value: string | null): void {
    const payByDateControl = this.form.get(CONTROL_NAMES.payByDate)!;
    const instalmentAmountControl = this.form.get(CONTROL_NAMES.instalmentAmount)!;
    const instalmentPeriodControl = this.form.get(CONTROL_NAMES.instalmentPeriod)!;
    const startDateControl = this.form.get(CONTROL_NAMES.startDate)!;
    const lumpSumAmountControl = this.form.get(CONTROL_NAMES.lumpSumAmount)!;

    payByDateControl.setValidators(optionalValidDateValidator());
    instalmentAmountControl.setValidators([DECIMAL_NUMERIC_PATTERN_VALIDATOR, TWO_DECIMAL_PLACES_PATTERN_VALIDATOR]);
    instalmentPeriodControl.clearValidators();
    startDateControl.setValidators(optionalValidDateValidator());
    lumpSumAmountControl.setValidators([DECIMAL_NUMERIC_PATTERN_VALIDATOR, TWO_DECIMAL_PLACES_PATTERN_VALIDATOR]);

    if (value === FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS.payInFull) {
      payByDateControl.addValidators(Validators.required);
    } else if (value === FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS.instalmentsOnly) {
      instalmentAmountControl.addValidators(Validators.required);
      instalmentPeriodControl.setValidators(Validators.required);
      startDateControl.addValidators(Validators.required);
    } else if (value === FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS.lumpSumPlusInstalments) {
      lumpSumAmountControl.addValidators(Validators.required);
      instalmentAmountControl.addValidators(Validators.required);
      instalmentPeriodControl.setValidators(Validators.required);
      startDateControl.addValidators(Validators.required);
    }

    [
      payByDateControl,
      instalmentAmountControl,
      instalmentPeriodControl,
      startDateControl,
      lumpSumAmountControl,
    ].forEach((control) => control.updateValueAndValidity());
  }

  /**
   * Updates a date input control from the MoJ date picker event.
   */
  public override setInputValue(value: string, controlName: string): void {
    super.setInputValue(value, controlName);
  }

  /**
   * Returns the DOM id/name used by the rendered GOV.UK form control.
   */
  public get inputName(): (controlName: string) => string {
    return (controlName: string): string =>
      `${FINES_ACC_ENF_ACTION_ADD_INPUT_PREFIX}${controlName.replace(FINES_ACC_ENF_ACTION_ADD_CONTROL_PREFIX, '')}`;
  }

  /**
   * Returns a stable id for an individual radio option.
   */
  public get radioOptionInputName(): (
    controlName: string,
    optionValue: string | number,
    optionIndex: number,
  ) => string {
    return (controlName: string, optionValue: string | number, optionIndex: number): string => {
      const normalizedOptionValue = optionValue
        .toString()
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      return `${this.inputName(controlName)}-${normalizedOptionValue || optionIndex}`;
    };
  }

  /**
   * Normalises radio option values to strings for reactive forms.
   */
  public get radioOptionValue(): (optionValue: string | number) => string {
    return (optionValue: string | number): string => optionValue.toString();
  }

  /**
   * Chooses the GOV.UK input width class from the API max-length contract.
   */
  public get textInputClasses(): (field: IFinesAccEnfActionAddFormField) => string {
    return (field: IFinesAccEnfActionAddFormField): string =>
      typeof field.max === 'number' ? (FINES_ACC_ENF_ACTION_ADD_TEXT_INPUT_MAX_LENGTH_CLASSES[field.max] ?? '') : '';
  }

  /**
   * Determines whether a dynamic text field should render as a GOV.UK textarea.
   */
  public get isTextAreaField(): (field: IFinesAccEnfActionAddFormField) => boolean {
    return (field: IFinesAccEnfActionAddFormField): boolean =>
      field.type === FIELD_TYPES.textarea || field.max === 1000;
  }

  /**
   * Returns the character-count limit for textarea fields.
   */
  public get textAreaCharacterLimit(): (field: IFinesAccEnfActionAddFormField) => number {
    return (field: IFinesAccEnfActionAddFormField): number => (typeof field.max === 'number' ? field.max : 1000);
  }

  /**
   * Returns ISO date boundaries for the shared MoJ date picker.
   */
  public get dateBoundary(): (value: number | string | undefined) => string {
    return (value: number | string | undefined): string =>
      typeof value === 'string' && this.dateService.isValidDate(value, 'yyyy-MM-dd') ? value : '';
  }

  /**
   * Returns the selected option objects for a dynamic checkbox group.
   */
  public get selectedCheckboxOptions(): (field: IFinesAccEnfActionAddFormField) => IGovUkSelectOptions[] {
    return (field: IFinesAccEnfActionAddFormField): IGovUkSelectOptions[] =>
      (field.checkboxControls ?? [])
        .filter((checkbox) => this.form?.get(checkbox.controlName)?.value === true)
        .map((checkbox) => checkbox.option);
  }

  /**
   * Emits cancellation to the parent add-action page.
   */
  public handleCancel(): void {
    this.cancelRequested.emit();
  }

  /**
   * Initialises field error content, dynamic controls, and control listeners.
   */
  public override ngOnInit(): void {
    this.fieldErrors = this.addService.buildFieldErrors(this.fields);
    this.setupForm();
    this.setupPaymentTermsListeners();
    super.ngOnInit();
  }
}
