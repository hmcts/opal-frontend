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
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS } from './constants/fines-sa-search-account-form-individuals-field-errors.constant';
import { IFinesSaSearchAccountFormIndividualsFieldErrors } from './interfaces/fines-sa-search-account-form-individuals-field-errors.interface';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

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
 * - Register this sub-form's field-error messages into the shared `fieldErrors` map passed down by the parent.
 * - Manage conditional validation (e.g. when exact-match or alias flags toggle required fields).
 * - Re-populate values from the store and sync validators accordingly.
 */
@Component({
  selector: 'app-fines-sa-search-account-form-individuals',
  imports: [GovukTextInputComponent, GovukCheckboxesComponent, GovukCheckboxesItemComponent, MojDatePickerComponent],
  templateUrl: './fines-sa-search-account-form-individuals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormIndividualsComponent extends AbstractNestedFormBaseComponent {
  private readonly finesSaStore = inject(FinesSaStore);
  private readonly individualsFieldErrors: IFinesSaSearchAccountFormIndividualsFieldErrors =
    FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS;
  protected readonly dateService = inject(DateService);

  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true })
  public override fieldErrors!: IAbstractFormBaseFieldErrors;
  @Input({ required: true })
  public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
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
   * Uses the base helper `setRequired` to toggle validators and update validity without emitting events.
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

    const hasValue = (v: unknown) => (v == null ? false : typeof v === 'string' ? v.trim().length > 0 : true);

    const firstNamesHasValue = hasValue(firstNamesControl.value);
    const dobHasValue = hasValue(dobControl.value);
    const lastNameHasValue = hasValue(lastNameControl.value);
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
   * Installs this sub-form's controls, registers its error messages into the shared map,
   * sets up conditional validation, rehydrates values from the store, and syncs validators once.
   */
  private setupIndividualForm(): void {
    const controlsGroup = this.buildIndividualFormControls();
    this.addControlsToNestedFormGroup(controlsGroup);
    this.registerNestedFormFieldErrors(this.individualsFieldErrors);
    this.setupConditionalValidation();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
    this.rePopulateForm(this.finesSaStore.searchAccount().fsa_search_account_individuals_search_criteria);
    this.handleConditionalValidation();
  }

  /**
   * Angular lifecycle hook: initialise the Individuals sub-form before invoking the base setup.
   *
   * Note: the parent passes in the shared `form`, `fieldErrors`, and `formControlErrorMessages` maps.
   * This component registers its own error definitions so the parent can render summaries and inline messages.
   */
  public override ngOnInit(): void {
    this.setupIndividualForm();
    super.ngOnInit();
  }
}
