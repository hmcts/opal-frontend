import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IFinesSaSearchAccountForm } from '../interfaces/fines-sa-search-account-form.interface';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { GovukTabsComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs';
import { GovukTabsListItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs/govuk-tabs-list-item';
import { GovukTabsPanelComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs/govuk-tabs-panel';
import { FinesSaSearchAccountFormIndividualsComponent } from './fines-sa-search-account-form-individuals/fines-sa-search-account-form-individuals.component';
import { FinesSaSearchAccountFormCompaniesComponent } from './fines-sa-search-account-form-companies/fines-sa-search-account-form-companies.component';
import { FinesSaSearchAccountFormMinorCreditorsComponent } from './fines-sa-search-account-form-minor-creditors/fines-sa-search-account-form-minor-creditors.component';
import { FinesSaSearchAccountFormMajorCreditorsComponent } from './fines-sa-search-account-form-major-creditors/fines-sa-search-account-form-major-creditors.component';
import { IFinesSaSearchAccountFieldErrors } from '../interfaces/fines-sa-search-account-field-errors.interface';
import { FINES_SA_SEARCH_ACCOUNT_FIELD_ERRORS } from '../constants/fines-sa-search-account-field-errors.constant';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { FinesSaSearchAccountTab } from '../types/fines-sa-search-account-tab.type';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../../routing/constants/fines-sa-search-routing-paths.constant';
import { atLeastOneCriteriaValidator } from '../validators/fines-sa-search-account.validator';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS } from './fines-sa-search-account-form-companies/constants/fines-sa-search-account-form-companies-field-errors.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS } from './fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individuals-field-errors.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_FIELD_ERRORS } from './fines-sa-search-account-form-minor-creditors/constants/fines-sa-search-account-form-minor-creditors-field-errors.constant';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';

/**
 * Parent form for “Search Account” with tabbed sub-forms (Individuals, Companies, Minor Creditors, Major Creditors).
 *
 * Responsibilities:
 * - Owns the root FormGroup and all error state (field error templates, inline messages, and summary).
 * - Builds static controls and hosts empty nested groups for each tab’s sub-form.
 * - Determines the active tab from the URL fragment and swaps the tab-specific error templates.
 * - Clears nested groups and rehydrates persisted values when switching tabs.
 * - Delegates installation of tab controls and conditional validation to the child components.
 *
 * Notes:
 * - Children **do not** emit error maps; this component remains the single source of truth for
 *   `fieldErrors`, `formControlErrorMessages`, and `formErrorSummaryMessage`.
 */
@Component({
  selector: 'app-fines-sa-search-account-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukTabsComponent,
    GovukTabsListItemComponent,
    GovukTabsPanelComponent,
    GovukErrorSummaryComponent,
    FinesSaSearchAccountFormIndividualsComponent,
    FinesSaSearchAccountFormCompaniesComponent,
    FinesSaSearchAccountFormMinorCreditorsComponent,
    FinesSaSearchAccountFormMajorCreditorsComponent,
  ],
  templateUrl: './fines-sa-search-account-form.component.html',
  styleUrls: ['./fines-sa-search-account-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormComponent extends AbstractFormBaseComponent {
  private readonly finesSaSearchRoutingPaths = FINES_SA_SEARCH_ROUTING_PATHS;
  /**
   * Tab-specific field error templates. On tab change, the parent recomputes
   * `fieldErrors = { ...BASE, ...tabFieldErrorMap[activeTab] }` and then
   * calls `setInitialErrorMessages()` to seed inline/summary structures.
   */
  private readonly tabFieldErrorMap: Record<FinesSaSearchAccountTab, Partial<IFinesSaSearchAccountFieldErrors>> = {
    individuals: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS,
    companies: FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS,
    minorCreditors: FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_FIELD_ERRORS,
    majorCreditors: {},
  };

  /**
   * Emits after `handleFormSubmit` runs the base validation/submission logic and the form is valid.
   */
  @Output() protected override formSubmit = new EventEmitter<IFinesSaSearchAccountForm>();

  public readonly finesSaStore = inject(FinesSaStore);
  /**
   * Parent-owned field error templates. These are swapped per active tab using `tabFieldErrorMap`.
   * Children read computed inline messages via their `[formControlErrorMessages]` input only.
   */
  override fieldErrors: IFinesSaSearchAccountFieldErrors = FINES_SA_SEARCH_ACCOUNT_FIELD_ERRORS;

  /**
   * Creates the root FormGroup, including static controls and empty nested groups
   * into which each tab’s sub-form installs its own controls. Attaches the
   * cross-field validator that enforces “at least one criterion”.
   */
  private setupBaseSearchAccountForm(): void {
    this.form = new FormGroup(
      {
        fsa_search_account_business_unit_ids: new FormControl<number[] | null>(null),
        fsa_search_account_number: new FormControl<string | null>(null, [
          patternValidator(/^\d{8}([A-Z])?$/, 'invalidFormat'),
          patternValidator(/^[a-zA-Z0-9\s'-]+$/, 'invalidCharacterPattern'),
          Validators.maxLength(9),
        ]),
        fsa_search_account_reference_case_number: new FormControl<string | null>(null, [
          patternValidator(/^[a-zA-Z0-9\s'-]+$/, 'invalidCharacterPattern'),
          Validators.maxLength(30),
        ]),
        fsa_search_account_individuals_search_criteria: new FormGroup({}),
        fsa_search_account_companies_search_criteria: new FormGroup({}),
        fsa_search_account_minor_creditors_search_criteria: new FormGroup({}),
        fsa_search_account_major_creditor_search_criteria: new FormGroup({}),
        fsa_search_account_active_accounts_only: new FormControl<boolean | null>(null),
      },
      { validators: atLeastOneCriteriaValidator },
    );
  }

  /**
   * Subscribes to the route fragment to resolve the active tab. If missing, defaults
   * to `individuals` (and updates the URL). Triggers `switchTab` on initial load and
   * whenever the fragment changes.
   */
  private setupFragmentListener(): void {
    (this['activatedRoute'] as ActivatedRoute).fragment.pipe(takeUntil(this.ngUnsubscribe)).subscribe((fragment) => {
      const resolvedFragment = fragment ?? 'individuals';

      if (!fragment) {
        this['router'].navigate([], {
          relativeTo: this['activatedRoute'],
          fragment: 'individuals',
          replaceUrl: true,
        });
      }

      this.switchTab(resolvedFragment);
    });
  }

  /**
   * Builds the form shell, wires the fragment listener, and seeds empty error message
   * structures based on the initial tab’s templates.
   */
  private initialFormSetup(): void {
    this.setupBaseSearchAccountForm();
    this.setupFragmentListener();
    this.setInitialErrorMessages();
  }

  /**
   * Resets all tab-specific nested FormGroups (without emitting) and clears the parent’s
   * inline/summary error messages.
   */
  private clearSearchForm(): void {
    ['individuals', 'companies', 'minor_creditors', 'major_creditor'].forEach((key) =>
      this.form.get(`fsa_search_account_${key}_search_criteria`)?.reset({}, { emitEvent: false }),
    );
    this.clearAllErrorMessages();
  }

  /**
   * Switches the active tab:
   * - Recomputes `fieldErrors` from the base + tab-specific templates.
   * - Seeds empty inline/summary messages via `setInitialErrorMessages()`.
   * - Clears all tab groups, then rehydrates any persisted form state from the store.
   * - Persists the selected tab to the store (and resets temporary state if the tab changed).
   *
   * @param tab Fragment string identifying the tab (the component treats this as a string).
   */
  private switchTab(tab: string | Event): void {
    this.fieldErrors = {
      ...FINES_SA_SEARCH_ACCOUNT_FIELD_ERRORS,
      ...this.tabFieldErrorMap[tab as FinesSaSearchAccountTab],
    } as IFinesSaSearchAccountFieldErrors;

    this.setInitialErrorMessages();

    // Reset existing values/validation in all tab groups
    this.clearSearchForm();

    // Rehydrate any previously saved form state (child also handles its own patching where needed)
    this.rePopulateForm(this.finesSaStore.searchAccount());

    if (tab !== this.finesSaStore.activeTab()) {
      this.finesSaStore.resetSearchAccount();
    }

    this.finesSaStore.setActiveTab(tab as FinesSaSearchAccountTab);
  }

  /**
   * Pre-submit guard:
   * - If multiple criteria are populated (`atLeastOneCriteriaRequired`), persist the transient
   *   form state and navigate to the problem route to inform the user.
   * - If the form is empty (`formEmpty`), do nothing.
   * - Otherwise, allow the base class to continue with submission.
   */
  private handleFormSubmission(): void {
    if (this.form.errors?.['atLeastOneCriteriaRequired']) {
      this.finesSaStore.setSearchAccountTemporary(this.form.value);
      this['router'].navigate([this.finesSaSearchRoutingPaths.children.problem], {
        relativeTo: this['activatedRoute'].parent,
      });
      return;
    }

    if (this.form.errors?.['formEmpty']) {
      return;
    }
  }

  /**
   * Receives error-summary items (e.g., from a shared summary component) and replaces the parent-held summary.
   */
  public updateFormErrorSummaryMessages(event: IAbstractFormBaseFormErrorSummaryMessage[]): void {
    this.formErrorSummaryMessage = event;
  }

  /**
   * Convenience accessor for the nested FormGroup associated with the current tab.
   */
  public get searchCriteriaForm(): FormGroup {
    switch (this.finesSaStore.activeTab()) {
      case 'individuals':
        return this.form.get('fsa_search_account_individuals_search_criteria') as FormGroup;
      case 'companies':
        return this.form.get('fsa_search_account_companies_search_criteria') as FormGroup;
      case 'minorCreditors':
        return this.form.get('fsa_search_account_minor_creditors_search_criteria') as FormGroup;
      case 'majorCreditors':
        return this.form.get('fsa_search_account_major_creditor_search_criteria') as FormGroup;
      default:
        return new FormGroup({});
    }
  }

  /**
   * Navigates to the “Filter by Business Units” flow, preserving the current form value and tab fragment.
   */
  public goToFilterBusinessUnits(): void {
    this.finesSaStore.setSearchAccountTemporary(this.form.value);
    this.handleRoute(this.finesSaStore.getFilterByBusinessUnitsPath(), false, undefined, {
      fragment: this.finesSaStore.activeTab(),
    });
  }

  /**
   * Runs pre-submit guards, then delegates to the base `handleFormSubmit` implementation.
   */
  public override handleFormSubmit(event: SubmitEvent): void {
    this.handleFormSubmission();
    super.handleFormSubmit(event);
  }

  /**
   * Angular lifecycle:
   * - Build the form shell and route subscriptions.
   * - Invoke the base lifecycle for shared behaviour (e.g., unsaved-changes wiring).
   */
  public override ngOnInit(): void {
    this.initialFormSetup();
    super.ngOnInit();
  }
}
