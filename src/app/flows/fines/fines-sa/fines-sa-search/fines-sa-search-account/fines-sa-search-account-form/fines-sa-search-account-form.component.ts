import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IFinesSaSearchAccountForm } from '../interfaces/fines-sa-search-account-form.interface';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS } from './fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individuals-field-errors.constant';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { FinesSaSearchAccountTab } from '../types/fines-sa-search-account-tab.type';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../../routing/constants/fines-sa-search-routing-paths.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS } from './fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individuals-controls.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS } from './fines-sa-search-account-form-companies/constants/fines-sa-search-account-form-companies-field-errors.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS } from './fines-sa-search-account-form-companies/constants/fines-sa-search-account-form-companies-controls.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_FIELD_ERRORS } from './fines-sa-search-account-form-minor-creditors/constants/fines-sa-search-account-form-minor-creditors-field-errors.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS } from './fines-sa-search-account-form-minor-creditors/constants/fines-sa-search-account-form-minor-creditors-controls.constant';

import { atLeastOneCriteriaValidator } from '../validators/fines-sa-search-account.validator';

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
  private readonly tabFieldErrorMap: Record<FinesSaSearchAccountTab, Partial<IFinesSaSearchAccountFieldErrors>> = {
    individuals: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS,
    companies: FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS,
    minorCreditors: FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_FIELD_ERRORS,
    majorCreditors: {},
  };
  private readonly tabControlsMap = {
    individuals: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS,
    companies: FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS,
    minorCreditors: FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS,
    majorCreditors: {},
  };

  @Output() protected override formSubmit = new EventEmitter<IFinesSaSearchAccountForm>();

  public readonly finesSaStore = inject(FinesSaStore);
  override fieldErrors: IFinesSaSearchAccountFieldErrors = FINES_SA_SEARCH_ACCOUNT_FIELD_ERRORS;

  /**
   * Sets up the base structure of the form, including all static and tab-specific search criteria controls.
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
   * Subscribes to the ActivatedRoute fragment to determine the active tab.
   * If no fragment is provided, defaults to 'individuals' and updates the URL accordingly.
   * Also triggers the corresponding tab switch on initial load.
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

      this.finesSaStore.setActiveTab(resolvedFragment as FinesSaSearchAccountTab);
      this.switchTab(this.finesSaStore.activeTab());
    });
  }

  /**
   * Calls form setup, routing subscription, and initialises error messages.
   */
  private initialFormSetup(): void {
    this.setupBaseSearchAccountForm();
    this.setupFragmentListener();
    this.setInitialErrorMessages();
  }

  /**
   * Replaces the controls inside the currently active tab's search criteria FormGroup.
   * Accepts either a Record of controls or a FormGroup instance.
   * @param controls An object containing control names and their AbstractControl instances, or a FormGroup.
   */
  private setControls(controls: Record<string, AbstractControl> | FormGroup): void {
    const group = this.searchCriteriaForm;

    // Clear existing controls
    Object.keys(group.controls).forEach((key) => group.removeControl(key));

    if (controls instanceof FormGroup) {
      Object.entries(controls.controls).forEach(([key, control]) => group.addControl(key, control));
    } else {
      Object.entries(controls).forEach(([key, control]) => group.addControl(key, control));
    }
  }

  /**
   * Clears all controls in all tab-specific search criteria form groups.
   * Clears all error messages.
   */
  private clearSearchForm(): void {
    ['individuals', 'companies', 'minor_creditors', 'major_creditor'].forEach((key) =>
      this.form.get(`fsa_search_account_${key}_search_criteria`)?.reset({}, { emitEvent: false }),
    );
    this.clearAllErrorMessages();
  }

  /**
   * Switches the current tab by updating the error map and applying tab-specific controls.
   * Also repopulates the form state once after initial navigation.
   * @param tab The tab name or fragment string.
   */
  private switchTab(tab: string | Event): void {
    this.fieldErrors = {
      ...FINES_SA_SEARCH_ACCOUNT_FIELD_ERRORS,
      ...this.tabFieldErrorMap[tab as FinesSaSearchAccountTab],
    } as IFinesSaSearchAccountFieldErrors;

    this.clearSearchForm();

    this.setControls(this.tabControlsMap[tab as FinesSaSearchAccountTab] ?? {});

    this.rePopulateForm(this.finesSaStore.searchAccount());
    this.finesSaStore.resetSearchAccount();
  }

  /**
   * Handles the internal validation and navigation logic for form submission.
   *
   * - If the form has the 'atLeastOneCriteriaRequired' error, it temporarily stores the form value
   *   in the FinesSaStore and navigates to the problem route, preventing further processing.
   * - If the form has the 'formEmpty' error, it simply returns and does not proceed.
   * - Otherwise, allows the submission to continue (handled by the parent class).
   *
   * This method is intended to be called before the main form submission logic to ensure
   * that the form meets minimum criteria and to provide user feedback or navigation if not.
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
   * Returns the FormGroup associated with the currently active tab.
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
   * Navigates to the Filter by Business Units page, saving current form data and preserving tab state.
   */
  public goToFilterBusinessUnits(): void {
    this.finesSaStore.setSearchAccountTemporary(this.form.value);
    this.handleRoute(this.finesSaStore.getFilterByBusinessUnitsPath(), false, undefined, {
      fragment: this.finesSaStore.activeTab(),
    });
  }

  /**
   * Handles the form submission event for the fines search account form.
   *
   * - If the form has the 'atLeastOneCriteriaRequired' error, it temporarily stores the form value
   *   and navigates to the problem route.
   * - If the form has the 'formEmpty' error, it prevents further processing.
   * - Otherwise, it delegates the handling to the parent class implementation.
   *
   * @param event - The submit event triggered by the form submission.
   */
  public override handleFormSubmit(event: SubmitEvent): void {
    this.handleFormSubmission();
    super.handleFormSubmit(event);
  }

  /**
   * Angular lifecycle hook - initialises form and invokes parent component lifecycle logic.
   */
  public override ngOnInit(): void {
    this.initialFormSetup();
    super.ngOnInit();
  }
}
