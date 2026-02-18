import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { CommonModule } from '@angular/common';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { FinesConStore } from '../../../../stores/fines-con.store';
import {
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN,
} from '@hmcts/opal-frontend-common/constants';
import { finesConSearchAccountFormCompaniesValidator } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/fines-con-search-account-form/fines-con-search-account-form-companies/validators/fines-con-search-account-form-companies.validator';

const LETTERS_WITH_SPACES_HYPHENS_APOSTROPHES_VALIDATOR = patternValidator(
  LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN,
  'lettersWithSpacesHyphensApostrophesPattern',
);

const ALPHANUMERIC_WITH_HYPHENS_APOSTROPHES_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericTextPattern',
);

/**
 * Nested Companies sub-form for Search Account.
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
  selector: 'app-fines-con-search-account-form-companies',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
  ],
  templateUrl: './fines-con-search-account-form-companies.component.html',
  styleUrls: ['./fines-con-search-account-form-companies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSearchAccountFormCompaniesComponent extends AbstractNestedFormBaseComponent {
  private readonly finesConStore = inject(FinesConStore);
  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;

  /**
   * Creates a **detached** builder FormGroup containing all controls owned by the Companies sub-form.
   * The returned controls are *not* attached to any parent yet; they are installed via `addControlsToNestedFormGroup`.
   *
   * @returns A FormGroup with all company search criteria controls
   * @private
   */
  private buildCompanyFormControls(): FormGroup {
    return new FormGroup({
      fcon_search_account_companies_company_name: new FormControl<string | null>(null, [
        LETTERS_WITH_SPACES_HYPHENS_APOSTROPHES_VALIDATOR,
        Validators.maxLength(50),
      ]),
      fcon_search_account_companies_company_name_exact_match: new FormControl<boolean | null>(null),
      fcon_search_account_companies_include_aliases: new FormControl<boolean | null>(null),
      fcon_search_account_companies_address_line_1: new FormControl<string | null>(null, [
        ALPHANUMERIC_WITH_HYPHENS_APOSTROPHES_VALIDATOR,
        Validators.maxLength(30),
      ]),
      fcon_search_account_companies_post_code: new FormControl<string | null>(null, [
        ALPHANUMERIC_WITH_HYPHENS_APOSTROPHES_VALIDATOR,
        Validators.maxLength(8),
      ]),
    });
  }

  /**
   * Retrieves the companies FormGroup from the parent form.
   *
   * @returns The companies FormGroup if it exists, null otherwise
   * @private
   */
  private getCompaniesGroup(): FormGroup | null {
    const group = this.form.get('fcon_search_account_companies_search_criteria');
    return group instanceof FormGroup ? group : null;
  }

  /**
   * Installs this sub-form's controls, sets up conditional validation,
   * rehydrates values from the store, and runs a one-off validator sync.
   *
   * @private
   */
  private setupCompanyForm(): void {
    const controlsGroup = this.buildCompanyFormControls();
    const companiesGroup = this.getCompaniesGroup();
    if (!companiesGroup) {
      return;
    }
    this.addControlsToNestedFormGroup(controlsGroup, companiesGroup);
    companiesGroup.addValidators(finesConSearchAccountFormCompaniesValidator);
    companiesGroup.patchValue(
      this.finesConStore.searchAccountForm().fcon_search_account_companies_search_criteria ?? {},
    );
    companiesGroup.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Angular lifecycle hook: initialise the Companies sub-form before invoking the base setup.
   *
   * The parent passes in the shared nested `form` group and `formControlErrorMessages`.
   * This component installs its own controls, wires conditional validation, and hydrates from the store.
   */
  public override ngOnInit(): void {
    super.ngOnInit();
    this.setupCompanyForm();
  }
}
