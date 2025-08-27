import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import {
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN,
} from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { FinesSaStore } from '../../../../stores/fines-sa.store';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';

const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericWithHyphensSpacesApostrophesDotPattern',
);
const LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN,
  'lettersSpacesHyphensApostrophesDotPattern',
);

/**
 * Nested Individuals sub-form for Search Account.
 *
 * Responsibilities:
 * - Build and install its own controls into the parent-provided FormGroup.
 * - Manage conditional validation (e.g. when exact-match or alias flags toggle required fields).
 * - Re-populate values from the store and sync validators accordingly.
 *
 * Notes:
 * - The parent component is the single source of truth for field error templates and computed messages.
 *   This sub-form only receives `form` and `formControlErrorMessages` and does not emit error maps.
 */
@Component({
  selector: 'app-fines-sa-search-account-form-individuals',
  imports: [GovukTextInputComponent, GovukCheckboxesComponent, GovukCheckboxesItemComponent, MojDatePickerComponent],
  templateUrl: './fines-sa-search-account-form-individuals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormIndividualsComponent extends AbstractNestedFormBaseComponent {
  private readonly finesSaStore = inject(FinesSaStore);
  protected readonly dateService = inject(DateService);

  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
  public yesterday!: string;

  /**
   * Creates a **detached** builder FormGroup containing all controls owned by the Individuals sub-form.
   * The returned controls are *not* attached to any parent yet; they are installed via `addControlsToNestedFormGroup`.
   */
  private buildIndividualFormControls(): FormGroup {
    return new FormGroup({
      fsa_search_account_individuals_last_name: new FormControl<string | null>(null, [
        LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN_VALIDATOR,
        Validators.maxLength(30),
      ]),
      fsa_search_account_individuals_last_name_exact_match: new FormControl<boolean | null>(null),
      fsa_search_account_individuals_first_names: new FormControl<string | null>(null, [
        LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN_VALIDATOR,
        Validators.maxLength(20),
      ]),
      fsa_search_account_individuals_first_names_exact_match: new FormControl<boolean | null>(null),
      fsa_search_account_individuals_include_aliases: new FormControl<boolean | null>(null),
      fsa_search_account_individuals_date_of_birth: new FormControl<string | null>(null, [
        optionalValidDateValidator(),
        dateOfBirthValidator(),
      ]),
      fsa_search_account_individuals_national_insurance_number: new FormControl<string | null>(null, [
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
        Validators.maxLength(9),
      ]),
      fsa_search_account_individuals_address_line_1: new FormControl<string | null>(null, [
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
        Validators.maxLength(30),
      ]),
      fsa_search_account_individuals_post_code: new FormControl<string | null>(null, [
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
        Validators.maxLength(8),
      ]),
    });
  }

  /**
   * Convenience accessor for this sub-form's controls from the installed parent group.
   * Returns `null` for any control that is missing to keep callers defensive.
   */
  private getIndividualFormControls(): {
    firstNamesControl: FormControl | null;
    dobControl: FormControl | null;
    lastNameControl: FormControl | null;
    firstNamesExactMatchControl: FormControl | null;
    lastNameExactMatchControl: FormControl | null;
    includeAliasesControl: FormControl | null;
  } {
    return {
      firstNamesControl: this.form.get('fsa_search_account_individuals_first_names') as FormControl,
      dobControl: this.form.get('fsa_search_account_individuals_date_of_birth') as FormControl,
      lastNameControl: this.form.get('fsa_search_account_individuals_last_name') as FormControl,
      firstNamesExactMatchControl: this.form.get(
        'fsa_search_account_individuals_first_names_exact_match',
      ) as FormControl,
      lastNameExactMatchControl: this.form.get('fsa_search_account_individuals_last_name_exact_match') as FormControl,
      includeAliasesControl: this.form.get('fsa_search_account_individuals_include_aliases') as FormControl,
    };
  }

  /**
   * Applies conditional `required` rules based on current values/toggles.
   * - Last name becomes required when first names or DOB are provided, or when exact-match/aliases flags are set.
   * - First names become required when the first-names exact-match flag is set.
   *
   * Uses the base helper `setValidatorPresence` to add/remove `Validators.required` and update validity quietly.
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

    // Last name validation rules
    const requireByNameOrDob = firstNamesHasValue || dobHasValue;
    const requireByOtherFlags = lastNameExactMatchHasValue || includeAliasesHasValue;
    const shouldRequireLastName = (requireByNameOrDob || requireByOtherFlags) && !lastNameHasValue;

    // First names validation rules
    const requireFirstName = firstNamesExactMatchHasValue && !firstNamesHasValue;

    this.setValidatorPresence(lastNameControl, Validators.required, shouldRequireLastName);
    this.setValidatorPresence(firstNamesControl, Validators.required, requireFirstName);
  }

  /**
   * Wires the conditional validation handler to relevant controls' `valueChanges` with auto-unsubscribe.
   * No-ops if any required control is missing (defensive in case the group is not yet fully installed).
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

  /**
   * Installs this sub-form's controls, sets up conditional validation,
   * rehydrates values from the store, and syncs validators once.
   */
  private setupIndividualForm(): void {
    const controlsGroup = this.buildIndividualFormControls();
    this.addControlsToNestedFormGroup(controlsGroup);
    this.setupConditionalValidation();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
    this.rePopulateForm(this.finesSaStore.searchAccount().fsa_search_account_individuals_search_criteria);
    this.finesSaStore.resetSearchAccount();
    this.handleConditionalValidation();
  }

  /**
   * Angular lifecycle hook: initialise the Individuals sub-form before invoking the base setup.
   *
   * The parent passes in the shared nested `form` group and `formControlErrorMessages`.
   * This component installs its own controls, wires conditional validation, and hydrates from the store.
   */
  public override ngOnInit(): void {
    super.ngOnInit();
    this.setupIndividualForm();
  }
}
