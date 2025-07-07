import { Injectable } from '@angular/core';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';

@Injectable({
  providedIn: 'any',
})
export class FinesSaService {
  /**
   * Determines whether any tab-specific search criteria group contains user input.
   * Checks all four search criteria objects (individual, company, minor creditor, major creditor).
   *
   * @param state - The full search account form state.
   * @returns True if any of the search criteria objects contain a non-empty, non-null value.
   */
  public hasAnySearchCriteriaPopulated(state: IFinesSaSearchAccountState): boolean {
    const isSet = (value: object | null | undefined): boolean =>
      Object.values(value ?? {}).some((v) => (typeof v === 'boolean' ? v === true : v !== null && v !== ''));

    return (
      isSet(state.fsa_search_account_individual_search_criteria) ||
      isSet(state.fsa_search_account_companies_search_criteria) ||
      isSet(state.fsa_search_account_minor_creditor_search_criteria) ||
      isSet(state.fsa_search_account_major_creditor_search_criteria)
    );
  }
}
