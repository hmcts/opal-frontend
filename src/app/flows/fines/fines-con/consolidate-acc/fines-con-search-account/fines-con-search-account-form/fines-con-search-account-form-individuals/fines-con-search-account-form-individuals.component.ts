import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { CommonModule } from '@angular/common';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  LETTERS_WITH_SPACES_PATTERN,
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
} from '@hmcts/opal-frontend-common/constants';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { FinesConStore } from '../../../../stores/fines-con.store';

const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'lettersWithSpacesPattern');
const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericTextPattern',
);

/**
 * Nested Individuals sub-form for Search Account.
 *
 * Responsibilities:
 * - Build and install its own controls into the parent-provided FormGroup.
 * - Manage conditional validation (e.g. when exact-match or alias flags toggle required fields).
 * - Notify parent of control changes and validation state updates.
 *
 * Notes:
 * - The parent component is the single source of truth for field error templates and computed messages.
 *   This sub-form only receives `form` and `formControlErrorMessages` and does not emit error maps.
 * - All validation logic is private to this component and is triggered on value changes.
 */
@Component({
  selector: 'app-fines-con-search-account-form-individuals',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    MojDatePickerComponent,
  ],
  templateUrl: './fines-con-search-account-form-individuals.component.html',
  styleUrls: ['./fines-con-search-account-form-individuals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSearchAccountFormIndividualsComponent extends AbstractNestedFormBaseComponent {
  private readonly finesConStore = inject(FinesConStore);
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;

  /**
   * Creates a **detached** builder FormGroup containing all controls owned by the Individuals sub-form.
   * The returned controls are *not* attached to any parent yet; they are installed via `addControlsToNestedFormGroup`.
   *
   * @returns A FormGroup with all individual search criteria controls
   * @private
   */
  private buildIndividualFormControls(): FormGroup {
    return new FormGroup({
      fcon_search_account_individuals_last_name: new FormControl<string | null>(null, [
        LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
        Validators.maxLength(30),
      ]),
      fcon_search_account_individuals_last_name_exact_match: new FormControl<boolean | null>(null),
      fcon_search_account_individuals_first_names: new FormControl<string | null>(null, [
        LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
        Validators.maxLength(20),
      ]),
      fcon_search_account_individuals_first_names_exact_match: new FormControl<boolean | null>(null),
      fcon_search_account_individuals_include_aliases: new FormControl<boolean | null>(null),
      fcon_search_account_individuals_date_of_birth: new FormControl<string | null>(null, [
        optionalValidDateValidator(),
        dateOfBirthValidator(),
      ]),
      fcon_search_account_individuals_address_line_1: new FormControl<string | null>(null, [
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR,
        Validators.maxLength(30),
      ]),
      fcon_search_account_individuals_post_code: new FormControl<string | null>(null, [
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR,
        Validators.maxLength(8),
      ]),
    });
  }

  /**
   * Convenience accessor for this sub-form's controls from the installed parent group.
   * Returns `null` for any control that is missing to keep callers defensive.
   *
   * @returns An object containing references to all individual form controls
   * @private
   */
  private getIndividualFormControls(): {
    firstNamesControl: FormControl | null;
    dobControl: FormControl | null;
    lastNameControl: FormControl | null;
    firstNamesExactMatchControl: FormControl | null;
    lastNameExactMatchControl: FormControl | null;
    includeAliasesControl: FormControl | null;
  } {
    const individualsGroup = this.getIndividualsGroup();
    if (!individualsGroup) {
      return {
        firstNamesControl: null,
        dobControl: null,
        lastNameControl: null,
        firstNamesExactMatchControl: null,
        lastNameExactMatchControl: null,
        includeAliasesControl: null,
      };
    }
    return {
      firstNamesControl: individualsGroup.get('fcon_search_account_individuals_first_names') as FormControl,
      dobControl: individualsGroup.get('fcon_search_account_individuals_date_of_birth') as FormControl,
      lastNameControl: individualsGroup.get('fcon_search_account_individuals_last_name') as FormControl,
      firstNamesExactMatchControl: individualsGroup.get(
        'fcon_search_account_individuals_first_names_exact_match',
      ) as FormControl,
      lastNameExactMatchControl: individualsGroup.get(
        'fcon_search_account_individuals_last_name_exact_match',
      ) as FormControl,
      includeAliasesControl: individualsGroup.get('fcon_search_account_individuals_include_aliases') as FormControl,
    };
  }

  /**
   * Applies conditional `required` rules based on current values/toggles.
   * - Last name becomes required when first names or DOB are provided, or when exact-match/aliases flags are set.
   * - First names become required when the first-names exact-match flag is set.
   *
   * Uses the base helper `setValidatorPresence` to add/remove `Validators.required` and update validity quietly.
   *
   * @private
   */
  private handleConditionalValidation(): void {
    const {
      firstNamesControl,
      dobControl,
      lastNameControl,
      firstNamesExactMatchControl,
      lastNameExactMatchControl,
      includeAliasesControl,
    } = this.getIndividualFormControls();

    if (
      !firstNamesControl ||
      !dobControl ||
      !lastNameControl ||
      !firstNamesExactMatchControl ||
      !lastNameExactMatchControl ||
      !includeAliasesControl
    ) {
      return;
    }

    const firstNamesHasValue = this.hasValue(firstNamesControl.value);
    const dobHasValue = this.hasValue(dobControl.value);
    const lastNameHasValue = this.hasValue(lastNameControl.value);
    const firstNamesExactMatchHasValue = !!firstNamesExactMatchControl.value;
    const lastNameExactMatchHasValue = !!lastNameExactMatchControl.value;
    const includeAliasesHasValue = !!includeAliasesControl.value;

    // Last name validation rules - required if:
    // - First names are provided (AC5a)
    // - DOB is provided (AC5b)
    // - Include aliases is checked (AC5c)
    // - Last name exact match is checked (AC5d)
    const requireByNameOrDob = firstNamesHasValue || dobHasValue;
    const requireByOtherFlags = lastNameExactMatchHasValue || includeAliasesHasValue;
    const shouldRequireLastName = (requireByNameOrDob || requireByOtherFlags) && !lastNameHasValue;

    // First names validation rules - required if first names exact match is set (AC5d)
    const requireFirstName = firstNamesExactMatchHasValue && !firstNamesHasValue;

    this.setValidatorPresence(lastNameControl, Validators.required, shouldRequireLastName);
    this.setValidatorPresence(firstNamesControl, Validators.required, requireFirstName);
  }

  /**
   * Wires the conditional validation handler to relevant controls' `valueChanges` with auto-unsubscribe.
   * No-ops if any required control is missing (defensive in case the group is not yet fully installed).
   *
   * @private
   */
  private setupConditionalValidation(): void {
    const {
      firstNamesControl,
      dobControl,
      firstNamesExactMatchControl,
      lastNameExactMatchControl,
      includeAliasesControl,
    } = this.getIndividualFormControls();

    if (
      !firstNamesControl ||
      !dobControl ||
      !firstNamesExactMatchControl ||
      !lastNameExactMatchControl ||
      !includeAliasesControl
    ) {
      return;
    }

    this.subscribeValidation(
      () => this.handleConditionalValidation(),
      firstNamesControl,
      dobControl,
      firstNamesExactMatchControl,
      lastNameExactMatchControl,
      includeAliasesControl,
    );
  }

  private getIndividualsGroup(): FormGroup | null {
    const group = this.form.get('fcon_search_account_individuals_search_criteria');
    return group instanceof FormGroup ? group : null;
  }

  /**
   * Installs this sub-form's controls, sets up conditional validation, and syncs validators once.
   * This is the main setup orchestrator for the individuals sub-form.
   *
   * @private
   */
  private setupIndividualForm(): void {
    const controlsGroup = this.buildIndividualFormControls();
    const individualsGroup = this.getIndividualsGroup();
    if (!individualsGroup) {
      return;
    }
    this.addControlsToNestedFormGroup(controlsGroup, individualsGroup);
    individualsGroup.patchValue(
      this.finesConStore.searchAccountForm().fcon_search_account_individuals_search_criteria ?? {},
    );
    this.setupConditionalValidation();
    this.handleConditionalValidation();
  }

  /**
   * Manually set input value and trigger conditional validation.
   * Called by the date picker's dateChange event to ensure validation runs when dates are selected.
   *
   * @param event The event or value to set
   * @param controlName The name of the control to update
   * @public
   */
  public override setInputValue(event: string, controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(event);
      this.handleConditionalValidation();
    }
  }

  /**
   * Angular lifecycle hook: initialise the Individuals sub-form.
   * Orchestrates the setup of all individual search controls and validation logic.
   */
  public override ngOnInit(): void {
    super.ngOnInit();
    this.setupIndividualForm();
  }
}
