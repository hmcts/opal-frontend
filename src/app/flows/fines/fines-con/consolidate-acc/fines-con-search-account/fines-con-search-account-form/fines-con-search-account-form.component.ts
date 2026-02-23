import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IFinesConSearchAccountForm } from '../interfaces/fines-con-search-account-form.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { nationalInsuranceNumberValidator } from '@hmcts/opal-frontend-common/validators/national-insurance-number';
import { FinesConSearchAccountFormIndividualsComponent } from './fines-con-search-account-form-individuals/fines-con-search-account-form-individuals.component';
import { FinesConSearchAccountFormCompaniesComponent } from './fines-con-search-account-form-companies/fines-con-search-account-form-companies.component';
import { IFinesConSearchAccountFieldErrors } from '../interfaces/fines-con-search-account-field-errors.interface';
import { FINES_CON_SEARCH_ACCOUNT_FIELD_ERRORS } from '../constants/fines-con-search-account-field-errors.constant';
import { CommonModule } from '@angular/common';
import { FinesConDefendant } from '../../../types/fines-con-defendant.type';
import { consolidateSearchAccountFormValidator } from './validators/fines-con-search-account-form.validator';
import { FinesConStore } from '../../../stores/fines-con.store';
import { FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS } from './fines-con-search-account-form-individuals/constants/fines-con-search-account-form-individuals-field-errors.constant';
import { FINES_CON_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS } from './fines-con-search-account-form-companies/constants/fines-con-search-account-form-companies-field-errors.constant';
import { ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { ACCOUNT_NUMBER_PATTERN } from '@app/flows/fines/constants/fines-regex-patterns.constant';
// Custom pattern that allows letters, numbers, hyphens, spaces, and apostrophes
const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericTextPattern',
);

/**
 * Search Account Form Component
 *
 * Responsibilities:
 * - Owns the root FormGroup and all error state (field error templates, inline messages, and summary).
 * - Builds controls and hosts nested groups for the individuals sub-form.
 * - Determines the defendant type and manages form validation.
 * - Persists and rehydrates form state via the FinesConStore.
 *
 * Notes:
 * - The parent (store) is the single source of truth for form state persistence.
 * - Children do not emit error maps; this component remains the single source of truth for
 *   `fieldErrors`, `formControlErrorMessages`, and `formErrorSummaryMessage`.
 */
@Component({
  selector: 'app-fines-con-search-account-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukErrorSummaryComponent,
    FinesConSearchAccountFormIndividualsComponent,
    FinesConSearchAccountFormCompaniesComponent,
  ],
  templateUrl: './fines-con-search-account-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSearchAccountFormComponent extends AbstractFormBaseComponent {
  private readonly finesConStore = inject(FinesConStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesConSearchAccountForm>();
  override fieldErrors: IFinesConSearchAccountFieldErrors = {
    ...FINES_CON_SEARCH_ACCOUNT_FIELD_ERRORS,
    ...FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS,
    ...FINES_CON_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS,
  };
  @Input({ required: true }) defendantType: FinesConDefendant = 'individual';

  /**
   * Creates the form with quick search fields and detail search fields.
   */
  private setupSearchAccountForm(): void {
    this.form = new FormGroup(
      {
        fcon_search_account_number: new FormControl<string | null>(null, [
          patternValidator(ACCOUNT_NUMBER_PATTERN, 'invalidFormat'),
          ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR,
          Validators.maxLength(9),
        ]),
        fcon_search_account_national_insurance_number: new FormControl<string | null>(null, [
          nationalInsuranceNumberValidator(),
          ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR,
          Validators.maxLength(9),
        ]),
        fcon_search_account_individuals_search_criteria: new FormGroup({}),
        fcon_search_account_companies_search_criteria: new FormGroup({}),
      },
      { validators: consolidateSearchAccountFormValidator },
    );
  }

  /**
   * Builds the form shell and seeds initial error message structures.
   */
  private initialFormSetup(): void {
    this.setupSearchAccountForm();
    this.rePopulateForm(this.finesConStore.searchAccountForm());
    this.setInitialErrorMessages();
  }

  /**
   * Persists the current form state as temporary/transient data in the store.
   *
   * Useful for preserving search state when navigating to intermediate steps
   * or when the form needs to be validated before final submission.
   */
  public setSearchAccountTemporary(): void {
    this.finesConStore.updateSearchAccountFormTemporary(this.form.value);
  }

  /**
   * AC7: Clears all data entered on the Search tab.
   *
   * Resets the form to its initial state, clearing all search criteria.
   * The Results and For consolidation tabs are not affected.
   *
   * @param event The click event from the clear link
   */
  public clearSearchForm(event?: Event | boolean): void {
    if (event instanceof Event) {
      event.preventDefault();
    }
    this.form.reset();
    this.clearAllErrorMessages();
    this.setInitialErrorMessages();
    this.finesConStore.resetSearchAccountForm();
  }

  /**
   * Angular lifecycle:
   * - Build the form shell and initial state.
   * - Invoke the base lifecycle for shared behaviour (e.g., unsaved-changes wiring).
   */
  public override ngOnInit(): void {
    this.initialFormSetup();
    super.ngOnInit();
  }
}
