import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukTabsComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs';
import { GovukTabsListItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs/govuk-tabs-list-item';
import { GovukTabsPanelComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs/govuk-tabs-panel';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { hasNestedValue } from '@app/flows/fines/validators/utils/has-nested-value.util';
import {
  ACCOUNT_NUMBER_PATTERN,
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  SINGLE_ASCII_CHARACTERS,
} from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { FINES_MCI_ROUTING_PATHS } from '../routing/constants/fines-mci-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_SEARCH_FIELD_ERRORS } from './constants/fines-mci-payment-category-criminal-search-field-errors.constant';
import {
  finesMciPaymentCategoryCriminalSearchCompaniesValidator,
  finesMciPaymentCategoryCriminalSearchIndividualsValidator,
  finesMciPaymentCategoryCriminalSearchOneCriteriaValidator,
} from './validators/fines-mci-payment-category-criminal-search.validator';
import { distinctUntilChanged, takeUntil } from 'rxjs';
import { FinesMciCriminalSearchTab } from '../stores/interfaces/fines-mci-criminal-search.interface';

const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);
const SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR = patternValidator(SINGLE_ASCII_CHARACTERS, 'singleAsciiCharacters');

@Component({
  selector: 'app-fines-mci-payment-category-criminal-search',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukTextInputComponent,
    GovukTabsComponent,
    GovukTabsListItemComponent,
    GovukTabsPanelComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
  ],
  templateUrl: './fines-mci-payment-category-criminal-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalSearchComponent extends AbstractFormBaseComponent {
  private isContinuing = false;
  private readonly currentRoute = inject(ActivatedRoute);
  private readonly angularRouter = inject(Router);

  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly activeTab = signal<FinesMciCriminalSearchTab>('individuals');
  protected readonly tillDetailsRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.create,
    FINES_MCI_ROUTING_PATHS.children.till,
    FINES_MCI_ROUTING_PATHS.children.details,
  ];

  override fieldErrors = FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_SEARCH_FIELD_ERRORS;

  public override form = new FormGroup(
    {
      fsa_search_account_number: new FormControl<string | null>(null, [
        patternValidator(ACCOUNT_NUMBER_PATTERN, 'invalidFormat'),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
        Validators.maxLength(9),
      ]),
      fsa_search_account_individuals_search_criteria: new FormGroup(
        {
          fsa_search_account_individuals_last_name: new FormControl<string | null>(null, [
            SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
            Validators.maxLength(30),
          ]),
          fsa_search_account_individuals_last_name_exact_match: new FormControl<boolean | null>(null),
          fsa_search_account_individuals_first_names: new FormControl<string | null>(null, [
            SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
            Validators.maxLength(20),
          ]),
          fsa_search_account_individuals_first_names_exact_match: new FormControl<boolean | null>(null),
          fsa_search_account_individuals_include_aliases: new FormControl<boolean | null>(null),
        },
        { validators: finesMciPaymentCategoryCriminalSearchIndividualsValidator },
      ),
      fsa_search_account_companies_search_criteria: new FormGroup(
        {
          fsa_search_account_companies_company_name: new FormControl<string | null>(null, [
            SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
            Validators.maxLength(50),
          ]),
          fsa_search_account_companies_company_name_exact_match: new FormControl<boolean | null>(null),
          fsa_search_account_companies_include_aliases: new FormControl<boolean | null>(null),
        },
        { validators: finesMciPaymentCategoryCriminalSearchCompaniesValidator },
      ),
    },
    { validators: finesMciPaymentCategoryCriminalSearchOneCriteriaValidator },
  );

  /**
   * Keeps the selected tab in sync with the route fragment until the component is destroyed.
   * When no fragment is supplied, restores the submitted tab or defaults to Individuals
   * and updates the URL without adding a browser history entry.
   */
  private setupFragmentListener(): void {
    this.currentRoute.fragment.pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe)).subscribe((fragment) => {
      if (fragment === 'companies') {
        this.setActiveTabFromFragment('companies');
        return;
      }

      const tab = fragment ? 'individuals' : (this.finesMciStore.criminalSearch()?.activeTab ?? 'individuals');
      this.setActiveTabFromFragment(tab);

      if (!fragment) {
        void this.angularRouter.navigate([], {
          relativeTo: this.currentRoute,
          fragment: tab,
          replaceUrl: true,
        });
      }
    });
  }

  /**
   * Stores the submitted criteria for the matches resolver and subsequent search amendments.
   * Bypasses the leave warning and retains search state during this navigation, then restores
   * leave protection if navigation is cancelled or fails.
   */
  private navigateToMatches(): void {
    this.finesMciStore.setCriminalSearch({
      formData: this.form.getRawValue(),
      activeTab: this.activeTab(),
      searchCriteriaCannotBeCombined: !!this.form.errors?.['searchCriteriaCannotBeCombined'],
    });
    this.isContinuing = true;
    void this.angularRouter
      .navigate([FINES_MCI_ROUTING_PATHS.children.matches], { relativeTo: this.currentRoute.parent })
      .finally(() => {
        this.isContinuing = false;
      });
  }

  /**
   * Selects the requested tab and clears displayed validation errors.
   * Changing tabs resets both advanced-search groups while retaining the quick-search account number.
   *
   * @param tab The tab selected by the route fragment.
   */
  private setActiveTabFromFragment(tab: FinesMciCriminalSearchTab): void {
    if (this.activeTab() !== tab) {
      this.form.get('fsa_search_account_individuals_search_criteria')?.reset(undefined, { emitEvent: false });
      this.form.get('fsa_search_account_companies_search_criteria')?.reset(undefined, { emitEvent: false });
    }
    this.activeTab.set(tab);
    this.clearAllErrorMessages();
    this.setInitialErrorMessages();
  }

  /**
   * Removes leading and trailing spaces from names before validation and storage so spaces-only
   * values trigger existing required-field errors. Preserves spaces within names and characters
   * such as tabs and newlines that must still fail ASCII validation.
   */
  private trimSearchNames(): void {
    const individuals = this.form.controls.fsa_search_account_individuals_search_criteria.controls;
    const companies = this.form.controls.fsa_search_account_companies_search_criteria.controls;
    const nameControls = [
      individuals.fsa_search_account_individuals_last_name,
      individuals.fsa_search_account_individuals_first_names,
      companies.fsa_search_account_companies_company_name,
    ];

    for (const control of nameControls) {
      const value = control.value;
      if (value === null) {
        continue;
      }

      // Preserve non-printable characters so ASCII validation can still reject them.
      let start = 0;
      let end = value.length;
      while (start < end && value[start] === ' ') {
        start++;
      }
      while (end > start && value[end - 1] === ' ') {
        end--;
      }
      if (start > 0 || end < value.length) {
        control.setValue(value.slice(start, end), { emitEvent: false });
      }
    }
  }

  /**
   * Moves focus and activates tabs with Left/Right arrows, Home/End, or Enter/Space.
   * Uses the shared tab click handler to keep fragment navigation and panel rendering consistent.
   * Leaves other keys and keyboard events from panel inputs to their native browser behaviour.
   *
   * @param event The keyboard event bubbling from the tabs component.
   */
  public handleTabKeydown(event: KeyboardEvent): void {
    if (!(event.target instanceof HTMLAnchorElement) || event.target.getAttribute('role') !== 'tab') {
      return;
    }

    const tabs = Array.from((event.currentTarget as HTMLElement).querySelectorAll<HTMLAnchorElement>('[role="tab"]'));
    const currentIndex = tabs.indexOf(event.target);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        nextIndex = currentIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  }

  /**
   * Normalises names before checking exclusive criteria and field validation.
   * Sends combined criteria to the conflict outcome; otherwise navigates only when the form is valid.
   * Empty or invalid searches remain on this page, with field errors handled by the base form.
   * Ignores further submissions while matches navigation is pending to avoid cancelling the active search.
   *
   * @param event The search form submission event.
   */
  public override handleFormSubmit(event: SubmitEvent): void {
    if (this.isContinuing) {
      event.preventDefault();
      return;
    }

    this.trimSearchNames();
    this.form.updateValueAndValidity({ emitEvent: false });

    if (this.form.errors?.['searchCriteriaCannotBeCombined']) {
      event.preventDefault();
      this.navigateToMatches();
      return;
    }

    super.handleFormSubmit(event);

    if (this.form.valid) {
      this.navigateToMatches();
    }
  }

  /**
   * Restores submitted criteria and the selected tab before listening for fragment changes,
   * then initialises error messages and the base form's value-change subscription.
   */
  public override ngOnInit(): void {
    const search = this.finesMciStore.criminalSearch();
    if (search) {
      this.activeTab.set(search.activeTab);
      this.form.patchValue(search.formData);
    }
    this.setupFragmentListener();
    this.setInitialErrorMessages();
    super.ngOnInit();
  }

  /**
   * Allows the intended matches navigation or departure from an empty form without a warning.
   * Other departures with populated criteria require confirmation through the shared route guard.
   *
   * @returns Whether navigation may proceed without confirmation.
   */
  public canDeactivate(): CanDeactivateTypes {
    return this.isContinuing || !hasNestedValue(this.form);
  }

  /**
   * Requests navigation to Till Details through the existing leave guard.
   * Clears the category draft only after successful navigation, preserving it if leaving is declined.
   */
  public handleCancel(): void {
    void this.angularRouter.navigate(this.tillDetailsRoute).then((navigated) => {
      if (navigated) {
        this.finesMciStore.setDraftJourney(null);
      }
    });
  }

  /**
   * Requests the browser's data-loss warning on refresh or close when search criteria are populated.
   *
   * @returns Whether the browser may unload without a warning.
   */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !hasNestedValue(this.form);
  }

  /**
   * Clears form and stored search data on departure, preserving them when navigating to matches
   * so the resolver and return-to-search journey can reuse the criteria. Releases form subscriptions.
   */
  public override ngOnDestroy(): void {
    if (!this.isContinuing) {
      this.form.reset(undefined, { emitEvent: false });
      this.finesMciStore.resetCriminalSearch();
    }
    super.ngOnDestroy();
  }
}
