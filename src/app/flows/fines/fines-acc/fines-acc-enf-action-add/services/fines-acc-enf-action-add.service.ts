import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { FINES_ACC_ENF_ACTION_ADD_CONTROL_PREFIX } from '../constants/fines-acc-enf-action-add-control-prefix.constant';
import { FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES } from '../constants/fines-acc-enf-action-add-control-names.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPE_ALIASES } from '../constants/fines-acc-enf-action-add-field-type-aliases.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';
import { FINES_ACC_ENF_ACTION_ADD_MENU_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-menu-field-types.constant';
import { FINES_ACC_ENF_ACTION_ADD_TEXT_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-text-field-types.constant';
import { FINES_ACC_ENF_ACTION_ADD_WELSH_CONTROL_SUFFIX } from '../constants/fines-acc-enf-action-add-welsh-control-suffix.constant';
import { IFinesAccEnfActionAddFormField } from '../interfaces/fines-acc-enf-action-add-form-field.interface';
import { IFinesAccEnfActionAddFormStructure } from '../interfaces/fines-acc-enf-action-add-form-structure.interface';
import { IFinesAccEnfActionAddResultParam } from '../interfaces/fines-acc-enf-action-add-result-param.interface';
import { TFinesAccEnfActionAddFieldType } from '../types/fines-acc-enf-action-add-field-type.type';

const CONTROL_NAMES = FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES;
const FIELD_TYPES = FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES;
const FIELD_TYPE_ALIASES = FINES_ACC_ENF_ACTION_ADD_FIELD_TYPE_ALIASES;

@Injectable({
  providedIn: 'root',
})
export class FinesAccEnfActionAddService {
  /**
   * Determines whether a dynamic result parameter is mandatory.
   */
  private isRequired(param: IFinesAccEnfActionAddResultParam): boolean {
    return this.isTruthy(param.mandatory);
  }

  /**
   * Parses result parameter JSON from reference data and falls back to an empty list if invalid.
   */
  private parseResultParams(resultParameters: string | undefined): IFinesAccEnfActionAddResultParam[] {
    if (!resultParameters) return [];

    try {
      const parsed = JSON.parse(resultParameters);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Maps one API result parameter to the internal dynamic form field model.
   */
  private mapParamToField(
    param: IFinesAccEnfActionAddResultParam,
    hasWelshLanguagePreference: boolean,
  ): IFinesAccEnfActionAddFormField {
    const type = this.mapFieldType(param.type, param.max);
    const controlName = this.getControlName(param.name);
    const options = this.mapOptions(param.options);
    const hasWelshField =
      hasWelshLanguagePreference &&
      this.isFieldType(FINES_ACC_ENF_ACTION_ADD_TEXT_FIELD_TYPES, type) &&
      this.isLanguageDependent(param.languageDependent);

    return {
      controlName,
      parameterName: param.name,
      label: param.prompt,
      type,
      required: this.isRequired(param),
      min: param.min,
      max: param.max,
      hint: param.hint,
      options,
      apiData: param.apiData,
      ...(type === FIELD_TYPES.menuCheckbox
        ? {
            checkboxControls: options.map((option) => ({
              controlName: `${controlName}_${this.getOptionControlSuffix(option.value)}`,
              option,
            })),
          }
        : {}),
      ...(hasWelshField
        ? {
            welshControlName: `${controlName}${FINES_ACC_ENF_ACTION_ADD_WELSH_CONTROL_SUFFIX}`,
            welshLabel: `${param.prompt} - Welsh version`,
          }
        : {}),
    };
  }

  /**
   * Normalises API field type strings to the field types rendered by the add-action form.
   */
  private mapFieldType(type: string, maxLength?: string | number): TFinesAccEnfActionAddFieldType {
    const normalizedType = type.toLowerCase().trim();

    if (this.isApiFieldType(FIELD_TYPE_ALIASES.decimal, normalizedType)) {
      return FIELD_TYPES.decimal;
    }

    if (this.isApiFieldType(FIELD_TYPE_ALIASES.textarea, normalizedType)) {
      return FIELD_TYPES.textarea;
    }

    if (this.isApiFieldType(FIELD_TYPE_ALIASES.text, normalizedType)) {
      if (Number(maxLength) === 1000) {
        return FIELD_TYPES.textarea;
      }
      return FIELD_TYPES.text;
    }

    if (this.isApiFieldType(FIELD_TYPE_ALIASES.menuRadio, normalizedType)) {
      return FIELD_TYPES.menuRadio;
    }

    if (this.isApiFieldType(FIELD_TYPE_ALIASES.menuAutocomplete, normalizedType)) {
      return FIELD_TYPES.menuAutocomplete;
    }

    if (this.isApiFieldType(FIELD_TYPE_ALIASES.menuCheckbox, normalizedType)) {
      return FIELD_TYPES.menuCheckbox;
    }

    if (this.isApiFieldType(FIELD_TYPE_ALIASES.date, normalizedType)) {
      return FIELD_TYPES.date;
    }

    if (this.isApiFieldType(FIELD_TYPE_ALIASES.integer, normalizedType)) {
      return FIELD_TYPES.integer;
    }

    return FIELD_TYPES.text;
  }

  /**
   * Converts API menu option shapes into GOV.UK-compatible option objects.
   */
  private mapOptions(options: IFinesAccEnfActionAddResultParam['options']): IGovUkSelectOptions[] {
    if (!options) return [];

    if (Array.isArray(options)) {
      return options.map((option) =>
        typeof option === 'string' ? { value: option, name: option } : { value: option.value, name: option.name },
      );
    }

    return Object.entries(options).map(([value, name]) => ({ value, name }));
  }

  /**
   * Determines whether a language-dependent API value is enabled.
   */
  private isLanguageDependent(value: boolean | string | undefined): boolean {
    return this.isTruthy(value);
  }

  /**
   * Checks a normalized API field type against a supported alias list.
   */
  private isApiFieldType(aliases: readonly string[], normalizedType: string): boolean {
    return aliases.includes(normalizedType);
  }

  /**
   * Checks a mapped field type against a grouped field type list.
   */
  private isFieldType(
    fieldTypes: readonly TFinesAccEnfActionAddFieldType[],
    type: TFinesAccEnfActionAddFieldType,
  ): boolean {
    return fieldTypes.includes(type);
  }

  /**
   * Builds the reactive-form control name for a dynamic API parameter.
   */
  private getControlName(parameterName: string): string {
    return `${FINES_ACC_ENF_ACTION_ADD_CONTROL_PREFIX}${parameterName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
  }

  /**
   * Builds a stable checkbox control suffix from a menu option value.
   */
  private getOptionControlSuffix(optionValue: string | number): string {
    return String(optionValue)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
  }

  /**
   * Builds validation error messages for one dynamic field.
   */
  private buildDynamicFieldErrors(field: IFinesAccEnfActionAddFormField): IAbstractFormBaseFieldErrors[string] {
    if (this.isFieldType(FINES_ACC_ENF_ACTION_ADD_MENU_FIELD_TYPES, field.type)) {
      return {
        required: {
          message: `Select a/an ${field.label}`,
          priority: 1,
        },
      };
    }

    switch (field.type) {
      case FIELD_TYPES.date:
        return this.buildDateFieldErrors(field.label);
      case FIELD_TYPES.decimal:
        return this.buildDecimalFieldErrors(field.label);
      case FIELD_TYPES.integer:
        return {
          required: {
            message: `Enter a/an ${field.label}`,
            priority: 1,
          },
          numericalTextPattern: {
            message: 'Enter only numbers',
            priority: 2,
          },
          min: {
            message: `${field.label} must be ${field.min} or more`,
            priority: 3,
          },
          max: {
            message: `${field.label} must be ${field.max} or less`,
            priority: 4,
          },
        };
      default:
        return {
          required: {
            message: `Enter a/an ${field.label}`,
            priority: 1,
          },
          maxlength: {
            message: `${field.label} must be ${field.max} characters or fewer`,
            priority: 2,
          },
          minlength: {
            message: `${field.label} must be ${field.min} characters or more`,
            priority: 3,
          },
          alphanumericTextPattern: {
            message: `${field.label} must only include letters a to z, numbers, hyphens, spaces and apostrophes`,
            priority: 4,
          },
          pairedLanguage: {
            message: `Enter a/an ${field.label}`,
            priority: 5,
          },
        };
    }
  }

  /**
   * Builds validation error messages shared by date fields.
   */
  private buildDateFieldErrors(label: string): IAbstractFormBaseFieldErrors[string] {
    return {
      required: {
        message: `Enter a/an ${label}`,
        priority: 1,
      },
      invalidDate: {
        message: 'Enter a valid date',
        priority: 2,
      },
      invalidDateFormat: {
        message: 'Date must be in the format DD/MM/YYYY',
        priority: 3,
      },
    };
  }

  /**
   * Builds validation error messages shared by decimal fields.
   */
  private buildDecimalFieldErrors(label: string): IAbstractFormBaseFieldErrors[string] {
    return {
      required: {
        message: `Enter a/an ${label}`,
        priority: 1,
      },
      invalidDecimal: {
        message: 'Enter amount as 2 decimal places, such as 100.99',
        priority: 2,
      },
      invalidAmountValue: {
        message: 'Enter a valid amount',
        priority: 2,
      },
      invalidAmount: {
        message: 'Enter amount as 2 decimal places, such as 100.99',
        priority: 3,
      },
      min: {
        message: `${label} must be more than or equal to the minimum amount`,
        priority: 4,
      },
      max: {
        message: `${label} must be less than or equal to the maximum amount`,
        priority: 5,
      },
    };
  }

  /**
   * Normalises boolean-like API values.
   */
  private isTruthy(value: boolean | string | undefined): boolean {
    return value === true || value?.toString().toLowerCase() === 'true';
  }

  /**
   * Checks whether a control value contains meaningful content.
   */
  private hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  }

  /**
   * Adds or removes one paired-language validation error without clobbering other errors.
   */
  private setPairError(control: AbstractControl | null | undefined, errorKey: string, shouldSet: boolean): void {
    if (!control) return;

    const errors = control.errors ?? {};
    if (shouldSet) {
      control.setErrors({ ...errors, [errorKey]: true });
      return;
    }

    if (errors[errorKey]) {
      delete errors[errorKey];
      const remainingErrors = errors;
      control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
    }
  }

  /**
   * Maps the result parameter JSON string into the dynamic form structure used by the add screen.
   */
  public mapResultParamsToFormStructure(
    resultParameters: string | undefined,
    hasWelshLanguagePreference: boolean,
  ): IFinesAccEnfActionAddFormStructure {
    const resultParams = this.parseResultParams(resultParameters);

    return {
      fields: resultParams.map((param) => this.mapParamToField(param, hasWelshLanguagePreference)),
    };
  }

  /**
   * Builds field-level validation copy for the dynamically generated fields and payment terms section.
   */
  public buildFieldErrors(fields: IFinesAccEnfActionAddFormField[]): IAbstractFormBaseFieldErrors {
    const fieldErrors = fields.reduce<IAbstractFormBaseFieldErrors>((errors, field) => {
      errors[field.controlName] = this.buildDynamicFieldErrors(field);

      if (field.welshControlName && field.welshLabel) {
        errors[field.welshControlName] = this.buildDynamicFieldErrors({
          ...field,
          controlName: field.welshControlName,
          label: field.welshLabel,
        });
      }

      return errors;
    }, {});

    return {
      ...fieldErrors,
      [CONTROL_NAMES.addPaymentTerms]: {
        required: {
          message: 'Select whether you want to add payment terms',
          priority: 1,
        },
      },
      [CONTROL_NAMES.paymentTerms]: {
        required: {
          message: 'Select payment terms',
          priority: 1,
        },
      },
      [CONTROL_NAMES.payByDate]: this.buildDateFieldErrors('Pay by date'),
      [CONTROL_NAMES.instalmentAmount]: this.buildDecimalFieldErrors('Instalment'),
      [CONTROL_NAMES.instalmentPeriod]: {
        required: {
          message: 'Select frequency',
          priority: 1,
        },
      },
      [CONTROL_NAMES.startDate]: this.buildDateFieldErrors('Start date'),
      [CONTROL_NAMES.lumpSumAmount]: this.buildDecimalFieldErrors('Lump sum'),
      [CONTROL_NAMES.daysInDefault]: {
        numericalTextPattern: {
          message: 'Enter only numbers',
          priority: 1,
        },
      },
      [CONTROL_NAMES.dateDaysInDefaultImposed]: this.buildDateFieldErrors('Date days in default were last imposed'),
    };
  }

  /**
   * Validator used for paired English/Welsh text controls.
   */
  public pairedLanguageValidator(englishControlName: string, welshControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const englishControl = control.get(englishControlName);
      const welshControl = control.get(welshControlName);
      const englishValue = this.hasValue(englishControl?.value);
      const welshValue = this.hasValue(welshControl?.value);

      this.setPairError(englishControl, 'pairedLanguage', welshValue && !englishValue);
      this.setPairError(welshControl, 'pairedLanguage', englishValue && !welshValue);

      return null;
    };
  }
}
