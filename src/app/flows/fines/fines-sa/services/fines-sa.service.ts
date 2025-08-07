import { inject, Injectable } from '@angular/core';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { AbstractControl } from '@angular/forms';
import { IFinesSaSearchAccountFormIndividualsState } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/interfaces/fines-sa-search-account-form-individuals-state.interface';
import { IFinesSaSearchAccountFormCompaniesState } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-companies/interfaces/fines-sa-search-account-form-companies-state.interface';
import { IFinesSaSearchAccountFormMinorCreditorsState } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/interfaces/fines-sa-search-account-form-minor-creditors-state.interface';
import { FinesSaResultsTabsType } from '../fines-sa-results/types/fines-sa-results-tabs.type';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IFinesSaResultsDefendantTableWrapperTableData } from '../fines-sa-results/fines-sa-results-defendant-table-wrapper/interfaces/fines-sa-results-defendant-table-wrapper-table-data.interface';
import { FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_EMPTY } from '../fines-sa-results/fines-sa-results-defendant-table-wrapper/constants/fines-sa-result-default-table-wrapper-table-data-empty.constant';

@Injectable({
  providedIn: 'any',
})
export class FinesSaService {
  private readonly utilsService = inject(UtilsService);

  /**
   * Determines whether any tab-specific search criteria group contains user input.
   * Checks all four search criteria objects (individual, company, minor creditor, major creditor).
   *
   * @param state - The full search account form state.
   * @returns True if any of the search criteria objects contain a non-empty, non-null value.
   */
  public hasAnySearchCriteriaPopulated(state: IFinesSaSearchAccountState): boolean {
    return (
      this.utilsService.hasSetProperty(state.fsa_search_account_individual_search_criteria) ||
      this.utilsService.hasSetProperty(state.fsa_search_account_companies_search_criteria) ||
      this.utilsService.hasSetProperty(state.fsa_search_account_minor_creditors_search_criteria) ||
      this.utilsService.hasSetProperty(state.fsa_search_account_major_creditor_search_criteria)
    );
  }

  /**
   * Determines whether the provided tab data is populated.
   *
   * @param tabData - The tab data to check, which can be of type
   *   `IFinesSaSearchAccountFormIndividualsState`, `IFinesSaSearchAccountFormCompaniesState`,
   *   `IFinesSaSearchAccountFormMinorCreditorsState`, or `null`.
   * @returns `true` if the tab data is set and populated; otherwise, `false`.
   */
  public hasTabPopulated(
    tabData:
      | IFinesSaSearchAccountFormIndividualsState
      | IFinesSaSearchAccountFormCompaniesState
      | IFinesSaSearchAccountFormMinorCreditorsState
      | null,
  ): boolean {
    return this.utilsService.hasSetProperty(tabData);
  }

  /**
   * Determines the appropriate results tab to display based on the provided search account state.
   *
   * The method checks the state in the following order:
   * - If `fsa_search_account_number` is present, returns `'accountNumber'`.
   * - If `fsa_search_account_reference_case_number` is present, returns `'referenceCaseNumber'`.
   * - If individual search criteria are populated, returns `'individuals'`.
   * - If company search criteria are populated, returns `'companies'`.
   * - If minor creditor search criteria are populated, returns `'minorCreditors'`.
   * - Defaults to `'accountNumber'` if none of the above conditions are met.
   *
   * @param state - The current fines search account state.
   * @returns The type of results tab to display.
   */
  public getSearchResultView(state: IFinesSaSearchAccountState): FinesSaResultsTabsType {
    if (state.fsa_search_account_number) {
      return 'accountNumber';
    } else if (state.fsa_search_account_reference_case_number) {
      return 'referenceCaseNumber';
    } else if (this.hasTabPopulated(state.fsa_search_account_individual_search_criteria)) {
      return 'individuals';
    } else if (this.hasTabPopulated(state.fsa_search_account_companies_search_criteria)) {
      return 'companies';
    } else if (this.hasTabPopulated(state.fsa_search_account_minor_creditors_search_criteria)) {
      return 'minorCreditors';
    } else {
      return 'accountNumber';
    }
  }

  /**
   * Determines if any control in the provided array contains a non-empty, trimmed string value.
   *
   * @param controls - An array of AbstractControl or null.
   * @returns True if at least one control has a non-blank, non-null value; otherwise, false.
   */
  public isAnyTextFieldPopulated(controls: (AbstractControl | null)[]): boolean {
    return controls.some((ctrl) => {
      const value = ctrl?.value;
      return typeof value === 'string' ? !!value.trim() : !!value;
    });
  }

  /**
   * Maps defendant account response data to an array of table data objects for display.
   *
   * @param data - The defendant account response data to map.
   * @param type - The type of defendant, either 'individual' or 'company'.
   * @returns An array of table data objects formatted for the defendant results table.
   */
  public mapDefendantAccounts(
    data: IOpalFinesDefendantAccountResponse,
    type: 'individual' | 'company',
  ): IFinesSaResultsDefendantTableWrapperTableData[] {
    if (data.count === 0) return [];

    return data.defendant_accounts.map((defendantAccount) => {
      const commonFields = {
        ...FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_EMPTY,
        Account: defendantAccount.account_number,
        'Address line 1': defendantAccount.address_line_1,
        Postcode: defendantAccount.postcode,
        'Business unit': defendantAccount.business_unit_name,
        Ref: defendantAccount.prosecutor_case_reference,
        Enf: defendantAccount.last_enforcement_action,
        Balance: defendantAccount.account_balance,
      };

      if (type === 'individual') {
        return {
          ...commonFields,
          Name: `${defendantAccount.defendant_surname}, ${defendantAccount.defendant_first_names}`,
          Aliases: defendantAccount.aliases
            ? defendantAccount.aliases.map((alias) => `${alias.alias_surname}, ${alias.alias_forenames}`).join('\n')
            : null,
          'Date of birth': defendantAccount.birth_date,
          'NI number': defendantAccount.national_insurance_number,
          'Parent or guardian': `${defendantAccount.parent_guardian_surname}, ${defendantAccount.parent_guardian_first_names}`,
        };
      } else {
        return {
          ...commonFields,
          Name: defendantAccount.organisation_name,
          Aliases: defendantAccount.aliases
            ? defendantAccount.aliases.map((alias) => alias.organisation_name).join('\n')
            : null,
        };
      }
    });
  }
}
