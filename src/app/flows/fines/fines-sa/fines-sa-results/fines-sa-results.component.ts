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
import {
  IOpalFinesCreditorAccountResponse,
  IOpalFinesCreditorAccount,
  IOpalFinesCreditorAccountDefendant,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-creditor-accounts.interface';
import { IFinesSaResultsMinorCreditorTableWrapperTableData } from './fines-sa-results-minor-creditor-table-wrapper/interfaces/fines-sa-results-minor-creditor-table-wrapper-table-data.interface';
import { FinesSaResultsMinorCreditorTableWrapperComponent } from './fines-sa-results-minor-creditor-table-wrapper/fines-sa-results-minor-creditor-table-wrapper.component';
import { FINES_SA_RESULTS_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './fines-sa-results-minor-creditor-table-wrapper/constants/fines-sa-result-minor-creditor-table-wrapper-table-sort-default.constant';
import { FINES_SA_RESULTS_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_DATA_EMPTY } from './fines-sa-results-minor-creditor-table-wrapper/constants/fines-sa-result-minor-creditor-table-wrapper-table-data-empty.constant';

@Component({
  selector: 'app-fines-sa-results',
  imports: [
    CommonModule,
    GovukBackLinkComponent,
    GovukTabsComponent,
    GovukTabsListItemComponent,
    GovukTabsPanelComponent,
    FinesSaResultsDefendantTableWrapperComponent,
    FinesSaResultsMinorCreditorTableWrapperComponent,
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
  public readonly minorCreditorsSort = FINES_SA_RESULTS_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  public individualsData = [] as IFinesSaResultsDefendantTableWrapperTableData[];
  public companiesData = [] as IFinesSaResultsDefendantTableWrapperTableData[];
  public minorCreditorsData = [] as IFinesSaResultsMinorCreditorTableWrapperTableData[];

  /**
   * Computes the default fragment based on the sizes of the results buckets.
   * Rules:
   * - If any bucket has >= 100 results → ''.
   * - If all buckets are 0 → ''.
   * - Otherwise pick the first bucket with 1–99 results in the order: individuals → companies → minorCreditors.
   */
  private computeDefaultFragment(): FinesSaSearchAccountTab {
    const individualsDataLen = this.individualsData.length;
    const companiesDataLen = this.companiesData.length;
    const minorCreditorsDataLen = this.minorCreditorsData.length;

    const anyOversize = individualsDataLen >= 100 || companiesDataLen >= 100 || minorCreditorsDataLen >= 100;
    const allZero = individualsDataLen === 0 && companiesDataLen === 0 && minorCreditorsDataLen === 0;

    if (anyOversize || allZero) return '' as FinesSaSearchAccountTab;
    if (individualsDataLen >= 1 && individualsDataLen <= 99) return 'individuals';
    if (companiesDataLen >= 1 && companiesDataLen <= 99) return 'companies';
    if (minorCreditorsDataLen >= 1 && minorCreditorsDataLen <= 99) return 'minorCreditors';

    // Fallback safety - should not be reached
    return '' as FinesSaSearchAccountTab;
  }

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
   * Maps the creditor accounts response data to an array of table data objects for display.
   *
   * @param data - The response object containing creditor account information.
   * @returns An array of table data objects formatted for the minor creditor table.
   *
   * If the response contains no creditor accounts (`count === 0`), an empty array is returned.
   * For each creditor account, common fields are built and then extended with either
   * organisation-specific or individual-specific fields based on the presence of `organisation_name`.
   */
  private mapCreditorAccounts(
    data: IOpalFinesCreditorAccountResponse,
  ): IFinesSaResultsMinorCreditorTableWrapperTableData[] {
    if (data.count === 0) return [];

    return data.creditor_accounts.map((account) => {
      const commonFields = this.buildCommonCreditorFields(account);
      return account.organisation_name
        ? this.buildOrganisationCreditorFields(commonFields, account)
        : this.buildIndividualCreditorFields(commonFields, account);
    });
  }

  /**
   * Builds the defendant name string from defendant data
   */
  private buildDefendantName(defendant: IOpalFinesCreditorAccountDefendant | null): string | null {
    if (!defendant) {
      return null;
    }

    if (defendant.organisation_name) {
      return defendant.organisation_name;
    }

    if (defendant.surname || defendant.firstnames) {
      const surname = defendant.surname ?? '';
      const firstnames = defendant.firstnames ?? '';
      const separator = defendant.surname && defendant.firstnames ? ', ' : '';
      return `${surname}${separator}${firstnames}`;
    }

    return null;
  }

  /**
   * Builds the parent/guardian name string from defendant account data
   */
  private buildParentGuardianName(defendantAccount: IOpalFinesDefendantAccount): string | null {
    const surname = defendantAccount.parent_guardian_surname;
    const firstnames = defendantAccount.parent_guardian_firstnames;

    if (!surname && !firstnames) {
      return null;
    }

    const surnameText = surname ?? '';
    const firstnamesText = firstnames ?? '';
    const separator = surname && firstnames ? ', ' : '';

    return `${surnameText}${separator}${firstnamesText}`;
  }

  /**
   * Builds a table data object containing common creditor fields for a given creditor account.
   *
   * @param account - The creditor data ob object containing account and ect conta details.i   * @returns An object representing the table data for the minor creditor, populated with fields such as account ID, ds for  number, address, business unit, defendant information, and  given .reditor account.
   *
   * @param account - The creditor account object containing account and defendant details.
   * @returns An object representing the table data for the minor creditor, populated with fields such as account ID, account number, address, business unit, defendant information, and balance.
   */
  private buildCommonCreditorFields(
    account: IOpalFinesCreditorAccount,
  ): IFinesSaResultsMinorCreditorTableWrapperTableData {
    return {
      ...FINES_SA_RESULTS_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_DATA_EMPTY,
      'Creditor account id': account.creditor_account_id,
      Account: account.account_number,
      'Address line 1': account.address_line_1,
      Postcode: account.postcode,
      'Business unit': account.business_unit_name,
      'Defendant account id': account.defendant_account_id,
      Defendant: this.buildDefendantName(account.defendant),
      Balance: account.account_balance,
    };
  }

  /**
   * Builds a new `IFinesSaResultsMinorCreditorTableWrapperTableData` object by merging the provided
   * `common` data with the creditor organisation's name from the given account.
   *
   * @param common - The base table data to be extended.
   * @param account - The creditor account containing the organisation name.
   * @returns A new table data object with the organisation name set in the `Name` field.
   */
  private buildOrganisationCreditorFields(
    common: IFinesSaResultsMinorCreditorTableWrapperTableData,
    account: IOpalFinesCreditorAccount,
  ): IFinesSaResultsMinorCreditorTableWrapperTableData {
    return {
      ...common,
      Name: `${account.organisation_name}`,
    };
  }

  /**
   * Builds and returns a new `IFinesSaResultsMinorCreditorTableWrapperTableData` object
   * by merging the provided `common` data with the creditor's name, formatted as "surname, firstnames".
   *
   * @param common - The base table data to be extended.
   * @param account - The creditor account containing name details.
   * @returns A new table data object with the creditor's name field populated.
   */
  private buildIndividualCreditorFields(
    common: IFinesSaResultsMinorCreditorTableWrapperTableData,
    account: IOpalFinesCreditorAccount,
  ): IFinesSaResultsMinorCreditorTableWrapperTableData {
    return {
      ...common,
      Name: `${account.surname}, ${account.firstnames}`,
    };
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
      Name: `${defendantAccount.defendant_surname}, ${defendantAccount.defendant_firstnames}`,
      Aliases: defendantAccount.aliases
        ? defendantAccount.aliases
            .map((alias: IOpalFinesDefendantAccountAlias) => `${alias.surname}, ${alias.forenames}`)
            .join('\n')
        : null,
      'Date of birth': defendantAccount.birth_date,
      'NI number': defendantAccount.national_insurance_number,
      'Parent or guardian': this.buildParentGuardianName(defendantAccount),
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
   * Loads individual and company defendant data and minor creditor data from the activated route snapshot if available.
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
    const minorCreditorAccounts = this.activatedRoute.snapshot.data[
      'minorCreditorAccounts'
    ] as IOpalFinesCreditorAccountResponse | null;

    if (individualAccounts && individualAccounts.count > 0) {
      this.individualsData = this.mapDefendantAccounts(individualAccounts, 'individual');
    }

    if (companyAccounts && companyAccounts.count > 0) {
      this.companiesData = this.mapDefendantAccounts(companyAccounts, 'company');
    }

    if (minorCreditorAccounts && minorCreditorAccounts.count > 0) {
      this.minorCreditorsData = this.mapCreditorAccounts(minorCreditorAccounts);
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
        const resolvedFragment = fragment ?? this.computeDefaultFragment();

        if (!fragment && resolvedFragment !== '') {
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
