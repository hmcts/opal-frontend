import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
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
import { IFinesSaSearchAccountFormCompaniesFieldErrors } from './interfaces/fines-sa-search-account-form-companies-field-errors.interface';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS } from './constants/fines-sa-search-account-form-companies-field-errors.constant';
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
 * Nested Companies sub-form for Search Account.
 *
 * Responsibilities:
 * - Build and install its own controls into the parent-provided FormGroup.
 * - Register this sub-form's field-error messages into the shared `fieldErrors` map passed down by the parent.
 * - Manage conditional validation (e.g. when exact-match or alias flags toggle required fields).
 * - Re-populate values from the store and sync validators accordingly.
 */
@Component({
  selector: 'app-fines-sa-search-account-form-companies',
  imports: [GovukTextInputComponent, GovukCheckboxesComponent, GovukCheckboxesItemComponent],
  templateUrl: './fines-sa-search-account-form-companies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormCompaniesComponent extends AbstractNestedFormBaseComponent {
  private readonly finesSaStore = inject(FinesSaStore);
  private readonly companiesFieldErrors: IFinesSaSearchAccountFormCompaniesFieldErrors =
    FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS;

  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true })
  public override fieldErrors!: IAbstractFormBaseFieldErrors;
  @Input({ required: true })
  public override formControlErrorMessages!: IAbstractFormControlErrorMessage;

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
   * Uses the base helper `setRequired` to toggle validators and update validity without emitting events.
   */
  private handleConditionalValidation(): void {
    const { companyNameControl, companyNameExactMatchControl, includeAliasesControl } = this.getCompanyNameControls();
    if (!companyNameControl || !companyNameExactMatchControl || !includeAliasesControl) return;

    const hasValue = (v: unknown) => (v == null ? false : typeof v === 'string' ? v.trim().length > 0 : true);

    const companyNameHasValue = hasValue(companyNameControl.value);
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
   * Installs this sub-form's controls, registers its error messages into the shared map,
   * sets up conditional validation, rehydrates values from the store, and syncs validators once.
   */
  private setupCompanyForm(): void {
    const controlsGroup = this.buildCompanyFormControls();
    this.addControlsToNestedFormGroup(controlsGroup);
    this.registerNestedFormFieldErrors(this.companiesFieldErrors);
    this.setupConditionalValidation();
    this.rePopulateForm(this.finesSaStore.searchAccount().fsa_search_account_companies_search_criteria);
    this.handleConditionalValidation();
  }

  /**
   * Angular lifecycle hook: initialise the Companies sub-form before invoking the base setup.
   *
   * Note: the parent passes in the shared `form`, `fieldErrors`, and `formControlErrorMessages` maps.
   * This component registers its own error definitions so the parent can render summaries and inline messages.
   */
  public override ngOnInit(): void {
    this.setupCompanyForm();
    super.ngOnInit();
  }
}
