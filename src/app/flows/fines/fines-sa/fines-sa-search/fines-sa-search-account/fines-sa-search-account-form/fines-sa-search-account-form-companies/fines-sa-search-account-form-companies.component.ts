import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { FinesSaStore } from '../../../../stores/fines-sa.store';
import {
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN,
} from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
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
 * Nested Companies sub-form for Search Account.
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
  selector: 'app-fines-sa-search-account-form-companies',
  imports: [GovukTextInputComponent, GovukCheckboxesComponent, GovukCheckboxesItemComponent],
  templateUrl: './fines-sa-search-account-form-companies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormCompaniesComponent extends AbstractNestedFormBaseComponent {
  private readonly finesSaStore = inject(FinesSaStore);

  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;

  /**
   * Creates a **detached** builder FormGroup containing all controls owned by the Companies sub-form.
   * The returned controls are *not* attached to any parent yet; they are installed via `addControlsToNestedFormGroup`.
   */
  private buildCompanyFormControls(): FormGroup {
    return new FormGroup({
      fsa_search_account_companies_company_name: new FormControl<string | null>(null, [
        LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN_VALIDATOR,
        Validators.maxLength(30),
      ]),
      fsa_search_account_companies_company_name_exact_match: new FormControl<boolean | null>(null),
      fsa_search_account_companies_include_aliases: new FormControl<boolean | null>(null),
      fsa_search_account_companies_address_line_1: new FormControl<string | null>(null, [
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
        Validators.maxLength(30),
      ]),
      fsa_search_account_companies_post_code: new FormControl<string | null>(null, [
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
        Validators.maxLength(8),
      ]),
    });
  }

  /**
   * Convenience accessor for this sub-form's controls from the installed parent group.
   * Returns `null` for any control that is missing to keep callers defensive.
   */
  private getCompanyNameControls() {
    return {
      companyNameControl: this.form.get('fsa_search_account_companies_company_name'),
      companyNameExactMatchControl: this.form.get('fsa_search_account_companies_company_name_exact_match'),
      includeAliasesControl: this.form.get('fsa_search_account_companies_include_aliases'),
    };
  }

  /**
   * Applies conditional `required` rules based on current values/toggles.
   * - Company name becomes required when exact-match or include-aliases flags are set and the field is empty.
   *
   * Uses the base helper `setValidatorPresence` to add/remove `Validators.required` and update validity quietly.
   */
  private handleConditionalValidation(): void {
    const { companyNameControl, companyNameExactMatchControl, includeAliasesControl } = this.getCompanyNameControls();
    if (!companyNameControl || !companyNameExactMatchControl || !includeAliasesControl) return;

    const companyNameHasValue = this.hasValue(companyNameControl.value);
    const companyNameExactMatchHasValue = !!companyNameExactMatchControl.value;
    const includeAliasesHasValue = !!includeAliasesControl.value;

    const shouldRequireCompanyName = (companyNameExactMatchHasValue || includeAliasesHasValue) && !companyNameHasValue;

    this.setValidatorPresence(companyNameControl, Validators.required, shouldRequireCompanyName);
  }

  /**
   * Wires the conditional validation handler to relevant controls' `valueChanges` with auto-unsubscribe.
   * No-ops if any required control is missing (defensive in case the group is not yet fully installed).
   */
  private setupConditionalValidation(): void {
    const { companyNameControl, companyNameExactMatchControl, includeAliasesControl } = this.getCompanyNameControls();
    if (!companyNameControl || !companyNameExactMatchControl || !includeAliasesControl) return;

    this.subscribeValidation(
      () => this.handleConditionalValidation(),
      companyNameControl,
      companyNameExactMatchControl,
      includeAliasesControl,
    );
  }

  /**
   * Installs this sub-form's controls, sets up conditional validation,
   * rehydrates values from the store, and runs a one-off validator sync.
   */
  private setupCompanyForm(): void {
    const controlsGroup = this.buildCompanyFormControls();
    this.addControlsToNestedFormGroup(controlsGroup);
    this.setupConditionalValidation();
    this.rePopulateForm(this.finesSaStore.searchAccount().fsa_search_account_companies_search_criteria);
    this.handleConditionalValidation();
  }

  /**
   * Angular lifecycle hook: initialise the Companies sub-form before invoking the base setup.
   *
   * The parent passes in the shared nested `form` group and `formControlErrorMessages`.
   * This component installs its own controls, wires conditional validation, and hydrates from the store.
   */
  public override ngOnInit(): void {
    this.setupCompanyForm();
    super.ngOnInit();
  }
}
