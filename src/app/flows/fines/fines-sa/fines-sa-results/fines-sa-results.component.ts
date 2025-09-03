import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FinesSaStore } from '../stores/fines-sa.store';
import { CommonModule } from '@angular/common';
import { GovukTabsComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs';
import { GovukTabsListItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs/govuk-tabs-list-item';
import { GovukTabsPanelComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tabs/govuk-tabs-panel';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IOpalFinesDefendantAccount,
  IOpalFinesDefendantAccountAlias,
  IOpalFinesDefendantAccountResponse,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { FinesSaResultsDefendantTableWrapperComponent } from './fines-sa-results-defendant-table-wrapper/fines-sa-results-defendant-table-wrapper.component';
import { FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './fines-sa-results-defendant-table-wrapper/constants/fines-sa-results-defendant-table-wrapper-table-sort-default.constant';
import { IFinesSaResultsDefendantTableWrapperTableData } from './fines-sa-results-defendant-table-wrapper/interfaces/fines-sa-results-defendant-table-wrapper-table-data.interface';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../fines-sa-search/routing/constants/fines-sa-search-routing-paths.constant';
import { Subject, takeUntil } from 'rxjs';
import { FinesSaSearchAccountTab } from '../fines-sa-search/fines-sa-search-account/types/fines-sa-search-account-tab.type';
import { FinesSaResultsTabsType } from './types/fines-sa-results-tabs.type';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_EMPTY } from './fines-sa-results-defendant-table-wrapper/constants/fines-sa-result-default-table-wrapper-table-data-empty.constant';

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
  private readonly router = inject(Router);
  private readonly finesSaSearchRoutingPaths = FINES_SA_SEARCH_ROUTING_PATHS;
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly finesSaStore = inject(FinesSaStore);
  public resultView!: FinesSaResultsTabsType;

  public readonly defendantsSort = FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  public individualsData = [] as IFinesSaResultsDefendantTableWrapperTableData[];
  public companiesData = [] as IFinesSaResultsDefendantTableWrapperTableData[];

  /**
   * Retrieves the current search type from the finesSaStore and assigns it to the `resultView` property.
   * This method is used to update the view based on the selected search type.
   *
   * @private
   */
  private getResultView() {
    this.resultView = this.finesSaStore.getSearchType();
  }

  /**
   * Maps defendant account response data to an array of table data objects for display in the fines results table.
   *
   * @param data - The response object containing defendant account information.
   * @param type - The type of defendant, either 'individual' or 'company', which determines the mapping logic.
   * @returns An array of table data objects formatted for the fines results table. Returns an empty array if no accounts are present.
   */
  private mapDefendantAccounts(
    data: IOpalFinesDefendantAccountResponse,
    type: 'individual' | 'company',
  ): IFinesSaResultsDefendantTableWrapperTableData[] {
    if (data.count === 0) return [];

    return data.defendant_accounts.map((defendantAccount) => {
      const commonFields = this.buildCommonFields(defendantAccount);

      return type === 'individual'
        ? this.buildIndividualFields(commonFields, defendantAccount)
        : this.buildCompanyFields(commonFields, defendantAccount);
    });
  }

  /**
   * Builds common fields shared between individual and company defendant accounts.
   *
   * @param defendantAccount - The defendant account data from the API response.
   * @returns Object containing common fields for both individual and company types.
   */
  private buildCommonFields(
    defendantAccount: IOpalFinesDefendantAccount,
  ): IFinesSaResultsDefendantTableWrapperTableData {
    return {
      ...FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_EMPTY,
      Account: defendantAccount.account_number,
      'Address line 1': defendantAccount.address_line_1,
      Postcode: defendantAccount.postcode,
      'Business unit': defendantAccount.business_unit_name,
      Ref: defendantAccount.prosecutor_case_reference,
      Enf: defendantAccount.last_enforcement_action,
      Balance: defendantAccount.account_balance,
    };
  }

  /**
   * Builds individual-specific fields for defendant account table data.
   *
   * @param commonFields - Base fields shared between individual and company types.
   * @param defendantAccount - The defendant account data from the API response.
   * @returns Complete individual defendant table data object.
   */
  private buildIndividualFields(
    commonFields: IFinesSaResultsDefendantTableWrapperTableData,
    defendantAccount: IOpalFinesDefendantAccount,
  ): IFinesSaResultsDefendantTableWrapperTableData {
    return {
      ...commonFields,
      Name: `${defendantAccount.defendant_surname}, ${defendantAccount.defendant_first_names}`,
      Aliases: defendantAccount.aliases
        ? defendantAccount.aliases
            .map((alias: IOpalFinesDefendantAccountAlias) => `${alias.alias_surname}, ${alias.alias_forenames}`)
            .join('\n')
        : null,
      'Date of birth': defendantAccount.birth_date,
      'NI number': defendantAccount.national_insurance_number,
      'Parent or guardian': `${defendantAccount.parent_guardian_surname}, ${defendantAccount.parent_guardian_first_names}`,
    };
  }

  /**
   * Builds company-specific fields for defendant account table data.
   *
   * @param commonFields - Base fields shared between individual and company types.
   * @param defendantAccount - The defendant account data from the API response.
   * @returns Complete company defendant table data object.
   */
  private buildCompanyFields(
    commonFields: IFinesSaResultsDefendantTableWrapperTableData,
    defendantAccount: IOpalFinesDefendantAccount,
  ): IFinesSaResultsDefendantTableWrapperTableData {
    return {
      ...commonFields,
      Name: defendantAccount.organisation_name,
      Aliases: defendantAccount.aliases
        ? defendantAccount.aliases.map((alias: IOpalFinesDefendantAccountAlias) => alias.organisation_name).join('\n')
        : null,
    };
  }

  /**
   * Loads individual and company defendant data from the activated route snapshot if available.
   * Transforms the raw data using the fines service mapper before assigning to component state.
   *
   * @private
   */
  private loadDefendantDataFromRouteSnapshot(): void {
    const individualAccounts = this.activatedRoute.snapshot.data[
      'individualAccounts'
    ] as IOpalFinesDefendantAccountResponse | null;
    const companyAccounts = this.activatedRoute.snapshot.data[
      'companyAccounts'
    ] as IOpalFinesDefendantAccountResponse | null;

    if (individualAccounts && individualAccounts.count > 0) {
      this.individualsData = this.mapDefendantAccounts(individualAccounts, 'individual');
    }

    if (companyAccounts && companyAccounts.count > 0) {
      this.companiesData = this.mapDefendantAccounts(companyAccounts, 'company');
    }
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
    this.loadDefendantDataFromRouteSnapshot();
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
