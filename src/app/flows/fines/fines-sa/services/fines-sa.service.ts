import { Injectable } from '@angular/core';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { IFinesSaSearchAccountFormIndividualsState } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/interfaces/fines-sa-search-account-form-individuals-state.interface';
import { IFinesSaSearchAccountFormCompaniesState } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-companies/interfaces/fines-sa-search-account-form-companies-state.interface';
import { IFinesSaSearchAccountFormMinorCreditorState } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/interfaces/fines-sa-search-account-form-minor-creditor-state.interface';
import { FinesSaResultsTabsType } from '../fines-sa-results/types/fines-sa-results-tabs.type';

@Injectable({
  providedIn: 'any',
})
export class FinesSaService {
  private isSet(value: object | null | undefined): boolean {
    return Object.values(value ?? {}).some((v) => (typeof v === 'boolean' ? v === true : v !== null && v !== ''));
  }

  /**
   * Determines whether any tab-specific search criteria group contains user input.
   * Checks all four search criteria objects (individual, company, minor creditor, major creditor).
   *
   * @param state - The full search account form state.
   * @returns True if any of the search criteria objects contain a non-empty, non-null value.
   */
  public hasAnySearchCriteriaPopulated(state: IFinesSaSearchAccountState): boolean {
    return (
      this.isSet(state.fsa_search_account_individual_search_criteria) ||
      this.isSet(state.fsa_search_account_companies_search_criteria) ||
      this.isSet(state.fsa_search_account_minor_creditor_search_criteria) ||
      this.isSet(state.fsa_search_account_major_creditor_search_criteria)
    );
  }

  public hasTabPopulated(
    tabData:
      | IFinesSaSearchAccountFormIndividualsState
      | IFinesSaSearchAccountFormCompaniesState
      | IFinesSaSearchAccountFormMinorCreditorState
      | null,
  ): boolean {
    return this.isSet(tabData);
  }

  public getSearchResultView(state: IFinesSaSearchAccountState): FinesSaResultsTabsType {
    if (state.fsa_search_account_number) {
      return 'accountNumber';
    } else if (state.fsa_search_account_reference_case_number) {
      return 'referenceCaseNumber';
    } else if (this.hasTabPopulated(state.fsa_search_account_individual_search_criteria)) {
      return 'individuals';
    } else if (this.hasTabPopulated(state.fsa_search_account_companies_search_criteria)) {
      return 'companies';
    } else if (this.hasTabPopulated(state.fsa_search_account_minor_creditor_search_criteria)) {
      return 'minorCreditors';
    } else {
      return 'accountNumber';
    }
  }
}
