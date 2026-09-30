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
  LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN,
  LETTERS_WITH_SPACES_PATTERN,
} from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defendant-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-reference-defaults.constant';
import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_SEARCH_FIELD_ERRORS } from './constants/fines-mci-payment-category-criminal-search-field-errors.constant';
import {
  finesMciPaymentCategoryCriminalSearchCompaniesValidator,
  finesMciPaymentCategoryCriminalSearchIndividualsValidator,
  finesMciPaymentCategoryCriminalSearchOneCriteriaValidator,
} from './validators/fines-mci-payment-category-criminal-search.validator';
import { distinctUntilChanged, takeUntil } from 'rxjs';

type FinesMciCriminalSearchTab = 'individuals' | 'companies';

const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);
const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'lettersWithSpacesPattern');
const LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN,
  'lettersSpacesHyphensApostrophesDotPattern',
);
const DEFAULT_SEARCH_BUSINESS_UNIT_IDS = [65, 66, 73, 77, 80, 78];

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
  private readonly opalFinesService = inject(OpalFines);
  private readonly angularRouter = inject(Router);

  protected readonly activeTab = signal<FinesMciCriminalSearchTab>('individuals');
  protected readonly financeDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.finance,
  ];

  override fieldErrors = FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_SEARCH_FIELD_ERRORS;

  private setupSearchForm(): void {
    this.form = new FormGroup(
      {
        fsa_search_account_business_unit_ids: new FormControl<number[] | null>(DEFAULT_SEARCH_BUSINESS_UNIT_IDS),
        fsa_search_account_number: new FormControl<string | null>(null, [
          patternValidator(ACCOUNT_NUMBER_PATTERN, 'invalidFormat'),
          ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
          Validators.maxLength(9),
        ]),
        fsa_search_account_individuals_search_criteria: new FormGroup(
          {
            fsa_search_account_individuals_last_name: new FormControl<string | null>(null, [
              LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
              Validators.maxLength(30),
            ]),
            fsa_search_account_individuals_last_name_exact_match: new FormControl<boolean | null>(null),
            fsa_search_account_individuals_first_names: new FormControl<string | null>(null, [
              LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
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
              LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN_VALIDATOR,
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

      this.setActiveTabFromFragment('individuals');

      if (!fragment) {
        this.angularRouter.navigate([], {
          relativeTo: this.currentRoute,
          fragment: 'individuals',
          replaceUrl: true,
        });
      }
    });
  }

  private clearInactiveTabCriteria(): void {
    const inactiveGroup =
      this.activeTab() === 'individuals'
        ? this.form.get('fsa_search_account_companies_search_criteria')
        : this.form.get('fsa_search_account_individuals_search_criteria');

    inactiveGroup?.reset();
  }

  private buildSearchParams(): IOpalFinesDefendantAccountSearchParams {
    const formValue = this.form.value;
    const isCompany = this.activeTab() === 'companies';
    const baseSearchParams = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
      business_unit_ids: formValue.fsa_search_account_business_unit_ids,
    };

    if (formValue.fsa_search_account_number) {
      return {
        ...baseSearchParams,
        reference_number: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
          account_number: formValue.fsa_search_account_number,
          organisation: isCompany,
        },
        active_accounts_only: false,
      };
    }

    if (isCompany) {
      const companyCriteria = formValue.fsa_search_account_companies_search_criteria;
      return {
        ...baseSearchParams,
        defendant: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
          organisation_name: companyCriteria?.fsa_search_account_companies_company_name,
          exact_match_organisation_name:
            companyCriteria?.fsa_search_account_companies_company_name_exact_match ?? false,
          include_aliases: companyCriteria?.fsa_search_account_companies_include_aliases ?? false,
          organisation: true,
        },
        active_accounts_only: true,
      };
    }

    const individualCriteria = formValue.fsa_search_account_individuals_search_criteria;

    return {
      ...baseSearchParams,
      defendant: {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
        surname: individualCriteria.fsa_search_account_individuals_last_name,
        exact_match_surname: individualCriteria.fsa_search_account_individuals_last_name_exact_match ?? false,
        forenames: individualCriteria.fsa_search_account_individuals_first_names,
        exact_match_forenames: individualCriteria.fsa_search_account_individuals_first_names_exact_match ?? false,
        include_aliases: individualCriteria.fsa_search_account_individuals_include_aliases ?? false,
        organisation: false,
      },
      active_accounts_only: true,
    };
  }

  private searchDefendantAccounts(): void {
    this.opalFinesService.getDefendantAccounts(this.buildSearchParams()).subscribe();
  }

  private handleFormSubmission(): boolean {
    this.clearInactiveTabCriteria();
    this.form.updateValueAndValidity({ emitEvent: false });

    return !this.form.errors?.['atLeastOneCriteriaRequired'] && !this.form.errors?.['formEmpty'];
  }

  private setActiveTabFromFragment(tab: FinesMciCriminalSearchTab): void {
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
    if (!this.handleFormSubmission()) {
      super.handleFormSubmit(event);
      return;
    }

    super.handleFormSubmit(event);

    if (this.form.valid) {
      this.searchDefendantAccounts();
    }
  }

  public override ngOnInit(): void {
    this.setupSearchForm();
    this.setupFragmentListener();
    this.setInitialErrorMessages();
    super.ngOnInit();
  }
}
