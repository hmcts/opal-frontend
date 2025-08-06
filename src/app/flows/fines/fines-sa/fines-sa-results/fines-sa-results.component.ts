import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FinesSaStore } from '../stores/fines-sa.store';
import { CommonModule } from '@angular/common';
import { GovukTabsComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs';
import { GovukTabsListItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs/govuk-tabs-list-item';
import { GovukTabsPanelComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs/govuk-tabs-panel';
import { ActivatedRoute, Router } from '@angular/router';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { FinesSaResultsDefendantTableWrapperComponent } from './fines-sa-results-defendant-table-wrapper/fines-sa-results-defendant-table-wrapper.component';
import { FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './fines-sa-results-defendant-table-wrapper/constants/fines-sa-results-defendant-table-wrapper-table-sort-default.constant';
import { IFinesSaResultsDefendantTableWrapperTableData } from './fines-sa-results-defendant-table-wrapper/interfaces/fines-sa-results-defendant-table-wrapper-table-data.interface';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../fines-sa-search/routing/constants/fines-sa-search-routing-paths.constant';
import { Subject, takeUntil } from 'rxjs';
import { FinesSaSearchAccountTab } from '../fines-sa-search/fines-sa-search-account/types/fines-sa-search-account-tab.type';
import { FinesSaService } from '../services/fines-sa.service';
import { FinesSaResultsTabsType } from './types/fines-sa-results-tabs.type';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../fines-acc/routing/constants/fines-acc-routing-paths.constant';

@Component({
  selector: 'app-fines-sa-results',
  imports: [
    CommonModule,
    GovukBackLinkComponent,
    GovukTabsComponent,
    GovukTabsListItemComponent,
    GovukTabsPanelComponent,
    FinesSaResultsDefendantTableWrapperComponent,
  ],
  templateUrl: './fines-sa-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaResultsComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly finesSaService = inject(FinesSaService);
  private readonly router = inject(Router);
  private readonly finesSaSearchRoutingPaths = FINES_SA_SEARCH_ROUTING_PATHS;
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly finesSaStore = inject(FinesSaStore);
  public resultView!: FinesSaResultsTabsType;

  public readonly defendantsSort = FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  public readonly minorCreditorsSort = FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  public individualsData = [] as IFinesSaResultsDefendantTableWrapperTableData[];
  public companiesData = [] as IFinesSaResultsDefendantTableWrapperTableData[];
  public minorCreditorsData = [] as IFinesSaResultsDefendantTableWrapperTableData[];

  /**
   * Retrieves the search result view for fines and assigns it to the `resultView` property.
   *
   * This method calls the `getSearchResultView` method of the `finesSaService`, passing in
   * the current search account from the `finesSaStore`. The resulting view is then stored
   * in the `resultView` property for use within the component.
   *
   * @private
   */
  private getResultView() {
    this.resultView = this.finesSaService.getSearchResultView(this.finesSaStore.searchAccount());
  }

  /**
   * Retrieves and transforms individual defendant account data from the activated route's snapshot data.
   * Maps the raw data into a structured format suitable for display in the fines results table.
   * If no data is available, initializes the individualsData array as empty.
   *
   * @private
   * @returns {void}
   */
  private getIndividualsData() {
    const data = this.activatedRoute.snapshot.data['individualAccounts'] as IOpalFinesDefendantAccountResponse;
    if (!data) {
      this.individualsData = [];
      return;
    }
    this.individualsData = data.defendant_accounts.map((defendantAccount) => {
      return {
        Account: defendantAccount.account_number,
        Name: `${defendantAccount.defendant_surname}, ${defendantAccount.defendant_first_names}`,
        Aliases: defendantAccount.aliases
          ? defendantAccount.aliases.map((alias) => `${alias.alias_surname}, ${alias.alias_forenames}`).join('\n')
          : null,
        'Date of birth': defendantAccount.birth_date,
        'Address line 1': defendantAccount.address_line_1,
        Postcode: defendantAccount.postcode,
        'NI number': defendantAccount.national_insurance_number,
        'Parent or guardian': `${defendantAccount.defendant_surname}, ${defendantAccount.defendant_first_names}`,
        'Business unit': defendantAccount.business_unit_name,
        Ref: defendantAccount.prosecutor_case_reference,
        Enf: defendantAccount.last_enforcement_action,
        Balance: defendantAccount.account_balance,
      };
    }) as IFinesSaResultsDefendantTableWrapperTableData[];
  }

  /**
   * Retrieves company account data from the activated route's snapshot and transforms it
   * into a format suitable for display in the fines results table.
   *
   * - If no data is found, sets `companiesData` to an empty array.
   * - Otherwise, maps each defendant account to a table data object, extracting and formatting
   *   relevant fields such as account number, organisation name, aliases (joined by newlines),
   *   address, postcode, business unit, prosecutor case reference, last enforcement action, and balance.
   *
   * @private
   * @returns {void}
   */
  private getCompaniesData() {
    const data = this.activatedRoute.snapshot.data['companyAccounts'] as IOpalFinesDefendantAccountResponse;
    if (!data) {
      this.companiesData = [];
      return;
    }
    this.companiesData = data.defendant_accounts.map((defendantAccount) => {
      return {
        Account: defendantAccount.account_number,
        Name: defendantAccount.organisation_name,
        Aliases: defendantAccount.aliases
          ? defendantAccount.aliases.map((alias) => alias.organisation_name).join('\n')
          : null,
        'Address line 1': defendantAccount.address_line_1,
        Postcode: defendantAccount.postcode,
        'Business unit': defendantAccount.business_unit_name,
        Ref: defendantAccount.prosecutor_case_reference,
        Enf: defendantAccount.last_enforcement_action,
        Balance: defendantAccount.account_balance,
      };
    }) as IFinesSaResultsDefendantTableWrapperTableData[];
  }

  /**
   * Sets up a listener for changes to the URL fragment and updates the active tab in the fines search results accordingly.
   *
   * - Listens to the fragment observable from the activated route.
   * - Determines a default fragment based on the availability of individuals and companies data.
   * - If no fragment is present in the URL, navigates to the same route with the resolved default fragment.
   * - Updates the active tab in the fines search results store to match the resolved fragment.
   *
   * This method is only invoked when the `resultView` is either 'referenceCaseNumber' or 'accountNumber'.
   *
   * @private
   */
  private setupFragmentListener(): void {
    if (this.resultView === 'referenceCaseNumber' || this.resultView === 'accountNumber') {
      this.activatedRoute.fragment.pipe(takeUntil(this.ngUnsubscribe)).subscribe((fragment) => {
        let defaultedFragment: FinesSaSearchAccountTab = 'individuals';
        if (this.individualsData.length === 0) {
          if (this.companiesData.length === 0) {
            defaultedFragment = 'minorCreditors';
          } else {
            defaultedFragment = 'companies';
          }
        }
        const resolvedFragment = fragment ?? defaultedFragment;

        if (!fragment) {
          this['router'].navigate([], {
            relativeTo: this['activatedRoute'],
            fragment: resolvedFragment,
            replaceUrl: true,
          });
        }

        this.finesSaStore.setResultsActiveTab(resolvedFragment as FinesSaSearchAccountTab);
      });
    }
  }

  /**
   * Navigates the user back to the fines search page.
   *
   * This method uses the Angular Router to navigate to the root path defined in `finesSaSearchRoutingPaths`.
   * The navigation is performed relative to the parent of the current activated route.
   * Additionally, it sets the URL fragment to the currently active tab as determined by `finesSaStore.activeTab()`.
   */
  public navigateBackToSearch() {
    this['router'].navigate([this.finesSaSearchRoutingPaths.root], {
      relativeTo: this['activatedRoute'].parent,
      fragment: this.finesSaStore.activeTab(),
    });
  }

  /**
   * Handles the click event on an account number.
   *
   * Constructs a URL to the account details page using the provided account number,
   * then opens the URL in a new browser tab.
   *
   * @param accountNumber - The account number to navigate to.
   */
  public onAccountNumberClick(accountNumber: string): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        FINES_ROUTING_PATHS.root,
        FINES_ACC_ROUTING_PATHS.root,
        accountNumber,
        FINES_ACC_ROUTING_PATHS.children.details,
      ]),
    );
    window.open(url, '_blank');
  }

  /**
   * Angular lifecycle hook that is called after the component's data-bound properties have been initialized.
   * Initializes the result view, fetches individuals data, and sets up a listener for URL fragment changes.
   */
  public ngOnInit(): void {
    this.getResultView();
    this.getIndividualsData();
    this.getCompaniesData();
    this.setupFragmentListener();
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Cleans up any subscriptions by emitting a value and completing the `ngUnsubscribe` subject,
   * preventing memory leaks from ongoing subscriptions.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
