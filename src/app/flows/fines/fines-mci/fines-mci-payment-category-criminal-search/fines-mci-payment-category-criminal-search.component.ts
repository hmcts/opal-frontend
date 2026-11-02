import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
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
    RouterLink,
    GovukErrorSummaryComponent,
    GovukTextInputComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
  ],
  templateUrl: './fines-mci-payment-category-criminal-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalSearchComponent extends AbstractFormBaseComponent {
  private readonly currentRoute = inject(ActivatedRoute);
  private readonly angularRouter = inject(Router);
  private readonly criminalMatchesRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    ...FINES_MCI_ROUTING_PATHS.children.paymentCategoryCriminalMatches.split('/'),
  ];

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

  private setupSearchForm(): void {
    this.form = new FormGroup(
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
  }

  private setupFragmentListener(): void {
    this.currentRoute.fragment.pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe)).subscribe((fragment) => {
      if (fragment === 'companies') {
        this.setActiveTabFromFragment('companies');
        return;
      }

      const tab = fragment ? 'individuals' : (this.finesMciStore.criminalSearch()?.activeTab ?? 'individuals');
      this.setActiveTabFromFragment(tab);

      if (!fragment) {
        this.angularRouter.navigate([], {
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
    this.angularRouter.navigate(this.criminalMatchesRoute);
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

  protected setActiveTab(tab: FinesMciCriminalSearchTab, event: Event): void {
    event.preventDefault();
    this.angularRouter.navigate([], {
      relativeTo: this.currentRoute,
      fragment: tab,
    });
  }

  public override handleFormSubmit(event: SubmitEvent): void {
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
    this.setupSearchForm();
    const search = this.finesMciStore.criminalSearch();
    if (search) {
      this.activeTab.set(search.activeTab);
      this.form.patchValue(search.formData);
    }
    this.setupFragmentListener();
    this.setInitialErrorMessages();
    super.ngOnInit();
  }
}
