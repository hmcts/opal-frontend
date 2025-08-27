import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';

/**
 * Resolver that retrieves individual defendant accounts based on current search criteria in the Fines SA flow.
 *
 * The resolver determines which search criteria to apply in the following order of precedence:
 *
 * 1. If an account number is provided, the search is performed using only the account number.
 * 2. If no account number is provided but a reference case number is, the search is performed using the reference.
 * 3. If neither of the above are provided but the "Individual" tab contains populated data, a detailed individual criteria search is performed.
 * 4. If none of the above criteria are present, no API call is made and an empty result set is returned.
 *
 * This resolver is intended specifically for individual account searches. If only the "Companies" tab is filled,
 * this resolver will return an empty response without making an API call.
 *
 * @returns Observable of IOpalFinesDefendantAccountResponse
 */
export const finesSaIndividualAccountsResolver: ResolveFn<IOpalFinesDefendantAccountResponse> = () => {
  const opalFinesService = inject(OpalFines);
  const finesSaStore = inject(FinesSaStore);
  const state = finesSaStore.searchAccount();

  // Create base object with defaults, search type, and common fields
  const baseSearchParams = {
    ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
    search_type: 'individual' as const,
    business_unit_ids: state.fsa_search_account_business_unit_ids,
    active_accounts_only: state.fsa_search_account_active_accounts_only ?? true,
  };

  const hasAccountNumber = !!state.fsa_search_account_number;
  const hasReference = !!state.fsa_search_account_reference_case_number;
  const individualCriteria = state.fsa_search_account_individuals_search_criteria;

  if (!hasAccountNumber && !hasReference && !individualCriteria) {
    return of({ count: 0, defendant_accounts: [] } as IOpalFinesDefendantAccountResponse);
  }

  if (hasAccountNumber) {
    return opalFinesService.getDefendantAccounts({
      ...baseSearchParams,
      account_number: state.fsa_search_account_number,
      active_accounts_only: false,
    });
  }

  if (hasReference) {
    return opalFinesService.getDefendantAccounts({
      ...baseSearchParams,
      pcr: state.fsa_search_account_reference_case_number,
      active_accounts_only: false,
    });
  }

  // Individual criteria search
  return opalFinesService.getDefendantAccounts({
    ...baseSearchParams,
    surname: individualCriteria!.fsa_search_account_individuals_last_name,
    exact_match_surname: individualCriteria!.fsa_search_account_individuals_last_name_exact_match,
    forename: individualCriteria!.fsa_search_account_individuals_first_names,
    exact_match_forenames: individualCriteria!.fsa_search_account_individuals_first_names_exact_match,
    date_of_birth: individualCriteria!.fsa_search_account_individuals_date_of_birth,
    ni_number: individualCriteria!.fsa_search_account_individuals_national_insurance_number,
    address_line: individualCriteria!.fsa_search_account_individuals_address_line_1,
    postcode: individualCriteria!.fsa_search_account_individuals_post_code,
    include_aliases: individualCriteria!.fsa_search_account_individuals_include_aliases,
    active_accounts_only: state.fsa_search_account_active_accounts_only ?? true,
  });
};
