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

  private setActiveTabFromFragment(tab: FinesMciCriminalSearchTab): void {
    if (this.activeTab() !== tab) {
      this.form.get('fsa_search_account_individuals_search_criteria')?.reset(undefined, { emitEvent: false });
      this.form.get('fsa_search_account_companies_search_criteria')?.reset(undefined, { emitEvent: false });
    }
    this.activeTab.set(tab);
    this.clearAllErrorMessages();
    this.setInitialErrorMessages();
  }

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

  public override handleFormSubmit(event: SubmitEvent): void {
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

  public canDeactivate(): CanDeactivateTypes {
    return this.isContinuing || !hasNestedValue(this.form);
  }

  public handleCancel(): void {
    void this.angularRouter.navigate(this.tillDetailsRoute).then((navigated) => {
      if (navigated) {
        this.finesMciStore.setDraftJourney(null);
      }
    });
  }

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !hasNestedValue(this.form);
  }

  public override ngOnDestroy(): void {
    if (!this.isContinuing) {
      this.form.reset(undefined, { emitEvent: false });
      this.finesMciStore.resetCriminalSearch();
    }
    super.ngOnDestroy();
  }
}
