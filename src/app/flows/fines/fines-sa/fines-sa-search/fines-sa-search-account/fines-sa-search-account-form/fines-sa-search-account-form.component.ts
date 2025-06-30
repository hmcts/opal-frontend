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
import { CommonModule } from '@angular/common';
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
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUAL_FIELD_ERRORS } from './fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individual-field-errors.constant';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { FinesSaSearchAccountTabs } from '../types/fines-sa-search-account-tabs.type';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../../routing/constants/fines-sa-search-routing-paths.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUAL_CONTROLS } from './fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individual-controls.constant';
import { FinesSaService } from '../../../services/fines-sa.service';

@Component({
  selector: 'app-fines-sa-search-account-form',
  imports: [
    CommonModule,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormComponent extends AbstractFormBaseComponent {
  @Output() protected override formSubmit = new EventEmitter<IFinesSaSearchAccountForm>();

  public readonly finesSaStore = inject(FinesSaStore);
  private readonly finesSaSearchRoutingPaths = FINES_SA_SEARCH_ROUTING_PATHS;
  private readonly tabFieldErrorMap: Record<FinesSaSearchAccountTabs, Partial<IFinesSaSearchAccountFieldErrors>> = {
    individuals: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUAL_FIELD_ERRORS,
    companies: {},
    minorCreditors: {},
    majorCreditors: {},
  };
  private readonly tabControlsMap = {
    individuals: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUAL_CONTROLS,
    companies: {},
    minorCreditors: {},
    majorCreditors: {},
  };
  private readonly finesSaService = inject(FinesSaService);
  private formRepopulated = false;

  override fieldErrors: IFinesSaSearchAccountFieldErrors = FINES_SA_SEARCH_ACCOUNT_FIELD_ERRORS;

  /**
   * Sets up the base structure of the form, including all static and tab-specific search criteria controls.
   */
  private setupBaseSearchAccountForm(): void {
    this.form = new FormGroup({
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
      fsa_search_account_individual_search_criteria: new FormGroup({}),
      fsa_search_account_companies_search_criteria: new FormGroup({}),
      fsa_search_account_minor_creditor_search_criteria: new FormGroup({}),
      fsa_search_account_major_creditor_search_criteria: new FormGroup({}),
      fsa_search_account_active_accounts_only: new FormControl<boolean | null>(null),
    });
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

      this.finesSaStore.setActiveTab(resolvedFragment as FinesSaSearchAccountTabs);
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
   * @param controls An object containing control names and their FormControl instances.
   */
  private setControls(controls: Record<string, FormControl>): void {
    const group = this.searchCriteriaForm;

    // Clear existing
    Object.keys(group.controls).forEach((key) => group.removeControl(key));

    // Add new
    Object.entries(controls).forEach(([key, control]) => group.addControl(key, control));
  }

  /**
   * Returns the FormGroup associated with the currently active tab.
   */
  public get searchCriteriaForm(): FormGroup {
    switch (this.finesSaStore.activeTab()) {
      case 'individuals':
        return this.form.get('fsa_search_account_individual_search_criteria') as FormGroup;
      case 'companies':
        return this.form.get('fsa_search_account_companies_search_criteria') as FormGroup;
      case 'minorCreditors':
        return this.form.get('fsa_search_account_minor_creditor_search_criteria') as FormGroup;
      case 'majorCreditors':
        return this.form.get('fsa_search_account_major_creditor_search_criteria') as FormGroup;
      default:
        return new FormGroup({});
    }
  }

  /**
   * Switches the current tab by updating the error map and applying tab-specific controls.
   * Also repopulates the form state once after initial navigation.
   * @param tab The tab name or fragment string.
   */
  public switchTab(tab: string | Event): void {
    this.fieldErrors = {
      ...FINES_SA_SEARCH_ACCOUNT_FIELD_ERRORS,
      ...this.tabFieldErrorMap[tab as FinesSaSearchAccountTabs],
    } as IFinesSaSearchAccountFieldErrors;

    this.clearSearchForm();

    this.setControls(this.tabControlsMap[tab as FinesSaSearchAccountTabs] ?? {});

    if (!this.formRepopulated) {
      // Ensures that repopulating the form only happens after Angular has finished rendering the tab panel and form controls.
      // This is necessary because the controls for the newly selected tab are not present in the DOM or form model until after the current microtask completes.
      // Using queueMicrotask allows Angular's view update cycle to complete before attempting to patch values into the form, preventing errors or missing controls.
      queueMicrotask(() => {
        this.rePopulateForm(this.finesSaStore.searchAccount());
        this.finesSaStore.resetSearchAccount();
        this.formRepopulated = true;
      });
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
   * Clears all controls in the currently active tab's search criteria form group.
   */
  private clearSearchForm(): void {
    this.searchCriteriaForm.reset({}, { emitEvent: false });
  }

  /**
   * Handles the form submission logic including AC6 enforcement:
   * If multiple criteria are used (account number + reference number + tab data), redirect to error.
   * Otherwise, proceed with base class submission.
   * @param event The SubmitEvent triggered by the form.
   */
  override handleFormSubmit(event: SubmitEvent): void {
    const accountNumber = this.form.get('fsa_search_account_number')?.value?.trim();
    const referenceNumber = this.form.get('fsa_search_account_reference_case_number')?.value?.trim();

    const hasTabData = this.finesSaService.hasAnySearchCriteriaPopulated(this.form.value);

    const criteriaUsed = [!!accountNumber, !!referenceNumber, hasTabData].filter(Boolean).length;

    if (criteriaUsed > 1) {
      this.finesSaStore.setSearchAccountTemporary(this.form.value);
      this['router'].navigate([this.finesSaSearchRoutingPaths.children.problem], {
        relativeTo: this['activatedRoute'].parent,
      });
      return;
    }

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
