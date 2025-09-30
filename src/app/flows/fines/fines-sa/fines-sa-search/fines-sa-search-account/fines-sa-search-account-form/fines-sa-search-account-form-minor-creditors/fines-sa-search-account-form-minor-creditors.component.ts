import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil, distinctUntilChanged } from 'rxjs';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { FINES_MINOR_CREDITOR_TYPES } from 'src/app/flows/fines/constants/fines-minor-creditor-types.constant';
import { IGovUkRadioOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio/interfaces';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { requiredMinorCreditorDataValidator } from './validators/fines-sa-search-account-form-minor-creditors.validator';
import { FinesSaStore } from '../../../../stores/fines-sa.store';
import {
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  LETTERS_WITH_SPACES_PATTERN,
} from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  IAbstractFormBaseFormErrorSummaryMessage,
  IAbstractFormControlErrorMessage,
} from '@hmcts/opal-frontend-common/components/abstract/interfaces';

const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericWithHyphensSpacesApostrophesDotPattern',
);
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericWithSpacesPattern',
);
const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'lettersWithSpacesPattern');

/**
 * Nested Minor Creditors sub-form for Search Account.
 *
 * Responsibilities:
 * - Build and install its own controls into the parent-provided FormGroup.
 * - Manage conditional validation for both the Individual and Company tabs.
 * - Re-populate values from the store and sync validators accordingly.
 *
 * Notes:
 * - The parent component is the single source of truth for field error templates and computed messages.
 *   This sub-form only receives `form` and `formControlErrorMessages` and does not emit error maps.
 */
@Component({
  selector: 'app-fines-sa-search-account-form-minor-creditors',
  imports: [
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukTextInputComponent,
  ],
  templateUrl: './fines-sa-search-account-form-minor-creditors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormMinorCreditorsComponent extends AbstractNestedFormBaseComponent {
  private readonly finesSaStore = inject(FinesSaStore);
  private readonly finesMinorCreditorTypes = FINES_MINOR_CREDITOR_TYPES;

  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Output() public formErrorSummaryMessagesChange = new EventEmitter<IAbstractFormBaseFormErrorSummaryMessage[]>();
  public readonly minorCreditorTypes: IGovUkRadioOptions[] = Object.entries(this.finesMinorCreditorTypes).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );
  /**
   * Convenience accessor for the minor creditor type control from the installed parent form.
   * Returns the control instance; callers should treat it as present once controls are installed.
   */
  private get minorCreditorType(): FormControl {
    return this.form.get('fsa_search_account_minor_creditors_minor_creditor_type') as FormControl;
  }

  /**
   * Convenience accessor for the Individual tab group from the installed parent form.
   * Returns the group instance; callers should treat it as present once controls are installed.
   */
  public get individualGroup(): FormGroup {
    return this.form.get('fsa_search_account_minor_creditors_individual') as FormGroup;
  }

  /**
   * Convenience accessor for the Company tab group from the installed parent form.
   * Returns the group instance; callers should treat it as present once controls are installed.
   */
  public get companyGroup(): FormGroup {
    return this.form.get('fsa_search_account_minor_creditors_company') as FormGroup;
  }

  /**
   * Creates a **detached** builder FormGroup containing all controls owned by the Minor Creditors sub-form.
   * The returned controls are *not* attached to any parent yet; they are installed via `addControlsToNestedFormGroup`.
   */
  private buildMinorCreditorFormControls(): FormGroup {
    return new FormGroup({
      fsa_search_account_minor_creditors_minor_creditor_type: new FormControl<string | null>(null, [
        Validators.nullValidator,
      ]),
      fsa_search_account_minor_creditors_individual: new FormGroup({
        fsa_search_account_minor_creditors_last_name: new FormControl<string | null>(null, [
          LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
          Validators.maxLength(30),
        ]),
        fsa_search_account_minor_creditors_last_name_exact_match: new FormControl<boolean | null>(null),
        fsa_search_account_minor_creditors_first_names: new FormControl<string | null>(null, [
          LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
          Validators.maxLength(20),
        ]),
        fsa_search_account_minor_creditors_first_names_exact_match: new FormControl<boolean | null>(null),
        fsa_search_account_minor_creditors_individual_address_line_1: new FormControl<string | null>(null, [
          ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
          Validators.maxLength(30),
        ]),
        fsa_search_account_minor_creditors_individual_post_code: new FormControl<string | null>(null, [
          ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
          Validators.maxLength(8),
        ]),
      }),
      fsa_search_account_minor_creditors_company: new FormGroup({
        fsa_search_account_minor_creditors_company_name: new FormControl<string | null>(null, [
          ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
          Validators.maxLength(50),
        ]),
        fsa_search_account_minor_creditors_company_name_exact_match: new FormControl<boolean | null>(null),
        fsa_search_account_minor_creditors_company_address_line_1: new FormControl<string | null>(null, [
          ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
          Validators.maxLength(30),
        ]),
        fsa_search_account_minor_creditors_company_post_code: new FormControl<string | null>(null, [
          ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
          Validators.maxLength(8),
        ]),
      }),
    });
  }

  /**
   * Removes dynamically-added `required` validators from Individual tab controls.
   * Ensures conditional rules do not persist when switching to the Company tab.
   */
  private clearIndividualDynamicValidators(): void {
    const firstNamesControl = this.individualGroup.get('fsa_search_account_minor_creditors_first_names');
    const lastNameControl = this.individualGroup.get('fsa_search_account_minor_creditors_last_name');
    this.setValidatorPresence(firstNamesControl, Validators.required, false);
    this.setValidatorPresence(lastNameControl, Validators.required, false);
  }

  /**
   * Removes dynamically-added `required` validators from Company tab controls.
   * Ensures conditional rules do not persist when switching to the Individual tab.
   */
  private clearCompanyDynamicValidators(): void {
    const companyNameControl = this.companyGroup.get('fsa_search_account_minor_creditors_company_name');
    this.setValidatorPresence(companyNameControl, Validators.required, false);
  }

  /**
   * Applies conditional `required` rules for the Individual tab.
   * - Last name becomes required when first names has a value or when the last-name exact-match flag is set.
   * - First names becomes required when the first-names exact-match flag is set.
   * Uses the base `setValidatorPresence` helper to add/remove `Validators.required` and update validity quietly.
   */
  private handleIndividualConditionalValidation(): void {
    const type = this.minorCreditorType.value;
    if (type !== 'individual') return;

    const individualGroup = this.individualGroup;
    if (!individualGroup) return;

    const firstNamesControl = individualGroup.get('fsa_search_account_minor_creditors_first_names');
    const firstNamesExactMatchControl = individualGroup.get(
      'fsa_search_account_minor_creditors_first_names_exact_match',
    );
    const lastNameControl = individualGroup.get('fsa_search_account_minor_creditors_last_name');
    const lastNameExactMatchControl = individualGroup.get('fsa_search_account_minor_creditors_last_name_exact_match');

    if (!firstNamesControl || !lastNameControl) return;

    const firstNamesHasValue = this.hasValue(firstNamesControl.value);
    const lastNameHasValue = this.hasValue(lastNameControl.value);
    const lastNameExactMatchHasValue = !!lastNameExactMatchControl?.value;
    const firstNamesExactMatchHasValue = !!firstNamesExactMatchControl?.value;

    // last name required if first names OR last name exact match is set but last name is empty
    const shouldRequireLastName = (firstNamesHasValue || lastNameExactMatchHasValue) && !lastNameHasValue;
    this.setValidatorPresence(lastNameControl, Validators.required, shouldRequireLastName);

    // first names required if first names exact match is set but first names is empty
    const shouldRequireFirstName = firstNamesExactMatchHasValue && !firstNamesHasValue;
    this.setValidatorPresence(firstNamesControl, Validators.required, shouldRequireFirstName);
  }

  /**
   * Wires the Individual tab conditional validation to relevant controls' `valueChanges` with auto-unsubscribe.
   * No-ops if any required control is missing (defensive in case the group is not yet fully installed).
   */
  private setupIndividualConditionalValidation(): void {
    const firstNamesControl = this.individualGroup.get('fsa_search_account_minor_creditors_first_names') as FormControl;
    const firstNamesExactMatchControl = this.individualGroup.get(
      'fsa_search_account_minor_creditors_first_names_exact_match',
    ) as FormControl;
    const lastNameControl = this.individualGroup.get('fsa_search_account_minor_creditors_last_name') as FormControl;
    const lastNameExactMatchControl = this.individualGroup.get(
      'fsa_search_account_minor_creditors_last_name_exact_match',
    ) as FormControl;

    const areMissingIndividualControls =
      !firstNamesControl || !lastNameControl || !firstNamesExactMatchControl || !lastNameExactMatchControl;
    if (areMissingIndividualControls) return;

    this.subscribeValidation(
      () => this.handleIndividualConditionalValidation(),
      firstNamesControl,
      lastNameControl,
      firstNamesExactMatchControl,
      lastNameExactMatchControl,
    );
  }

  /**
   * Applies conditional `required` rules for the Company tab.
   * - Company name becomes required when the exact-match flag is set and the field is empty.
   * Uses the base `setValidatorPresence` helper to add/remove `Validators.required` and update validity quietly.
   */
  private handleCompanyConditionalValidation(): void {
    const minorCreditorType = this.minorCreditorType.value;
    if (minorCreditorType !== 'company') return;

    const companyNameControl = this.companyGroup.get('fsa_search_account_minor_creditors_company_name') as FormControl;
    const companyNameExactMatchControl = this.companyGroup.get(
      'fsa_search_account_minor_creditors_company_name_exact_match',
    ) as FormControl;
    const areMissingCompanyControls = !companyNameControl || !companyNameExactMatchControl;
    if (areMissingCompanyControls) return;

    const companyNameHasValue = this.hasValue(companyNameControl.value);
    const companyNameExactMatchHasValue = !!companyNameExactMatchControl.value;

    const shouldRequireCompanyName = companyNameExactMatchHasValue && !companyNameHasValue;
    this.setValidatorPresence(companyNameControl, Validators.required, shouldRequireCompanyName);
  }

  /**
   * Wires the Company tab conditional validation to relevant controls' `valueChanges` with auto-unsubscribe.
   * No-ops if any required control is missing (defensive in case the group is not yet fully installed).
   */
  private setupCompanyConditionalValidation(): void {
    const companyNameControl = this.companyGroup.get('fsa_search_account_minor_creditors_company_name') as FormControl;
    const companyNameExactMatchControl = this.companyGroup.get(
      'fsa_search_account_minor_creditors_company_name_exact_match',
    ) as FormControl;

    const areMissingCompanyControls = !companyNameControl || !companyNameExactMatchControl;
    if (areMissingCompanyControls) return;

    this.subscribeValidation(
      () => this.handleCompanyConditionalValidation(),
      companyNameControl,
      companyNameExactMatchControl,
    );
  }

  /**
   * Sets up the minor-creditor type behaviour and form-level validator.
   * - Installs the custom `requiredMinorCreditorDataValidator` on the type control.
   * - When switching tabs, clears dynamic validators and resets relevant group state.
   * - Revalidates the type control when either sub-group changes (avoids recursive loops).
   */
  private setupMinorCreditorTypeListener(): void {
    const typeControl = this.minorCreditorType;
    if (typeControl) {
      typeControl.setValidators(
        requiredMinorCreditorDataValidator(() => ({
          individualGroup: this.individualGroup,
          companyGroup: this.companyGroup,
        })),
      );
      typeControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }

    this.minorCreditorType?.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged())
      .subscribe((type) => {
        if (type === 'individual') {
          // Clear company tab: remove dynamic validators first, then clear field states
          this.clearCompanyDynamicValidators();
          this.resetAndValidateControls(Object.values(this.companyGroup.controls));
          this.resetAndValidateFormGroup(this.companyGroup);
        } else if (type === 'company') {
          // Clear individual tab: remove dynamic validators first, then clear field states
          this.clearIndividualDynamicValidators();
          this.resetAndValidateControls(Object.values(this.individualGroup.controls));
          this.resetAndValidateFormGroup(this.individualGroup);
        }
        // Only now update the typeControl validity
        typeControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        // On tab switch, reset inline/summary errors; parent owns field error templates
        this.clearAllErrorMessages();
        this.setInitialErrorMessages();
        this.formErrorSummaryMessagesChange.emit([]);
      });

    // Only update validity if the group is valid and dirty, and avoid loops
    this.individualGroup.valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged()).subscribe(() => {
      if (typeControl?.dirty) {
        typeControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });

    this.companyGroup.valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged()).subscribe(() => {
      if (typeControl?.dirty) {
        typeControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });
  }

  /**
   * Installs this sub-form's controls, sets up the type listener and conditional validation,
   * rehydrates store values, and runs a one-off validator sync.
   */
  private setupMinorCreditorForm(): void {
    const controlGroup = this.buildMinorCreditorFormControls();
    this.addControlsToNestedFormGroup(controlGroup);
    this.rePopulateForm(this.finesSaStore.searchAccount().fsa_search_account_minor_creditors_search_criteria);
    this.finesSaStore.resetSearchAccount();
    this.setupMinorCreditorTypeListener();
    this.setupIndividualConditionalValidation();
    this.setupCompanyConditionalValidation();
  }

  /**
   * Angular lifecycle hook: initialise the Minor Creditors sub-form then invoke base setup.
   *
   * The parent passes in the shared nested `form` group and `formControlErrorMessages`.
   * This component installs its own controls, wires conditional validation, and hydrates from the store.
   */
  public override ngOnInit(): void {
    this.setupMinorCreditorForm();
    super.ngOnInit();
  }
}
