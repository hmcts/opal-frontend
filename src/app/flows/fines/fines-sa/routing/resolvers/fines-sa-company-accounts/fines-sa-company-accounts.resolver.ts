import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import {
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
} from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';

/**
 * Resolver that retrieves company defendant accounts based on current search criteria in the Fines SA flow.
 *
 * The resolver determines which search criteria to apply in the following order of precedence:
 *
 * 1. If an account number is provided, the search is performed using only the account number.
 * 2. If no account number is provided but a reference case number is, the search is performed using the reference.
 * 3. If neither of the above are provided but the "Company" tab contains populated data, a detailed company criteria search is performed.
 * 4. If none of the above criteria are present, no API call is made and an empty result set is returned.
 *
 * This resolver is intended specifically for Company account searches.
 *
 * @returns Observable of IOpalFinesDefendantAccountResponse
 */
export const finesSaCompanyAccountsResolver: ResolveFn<IOpalFinesDefendantAccountResponse> = () => {
  const opalFinesService = inject(OpalFines);
  const finesSaStore = inject(FinesSaStore);
  const state = finesSaStore.searchAccount();

  // Create base object with defaults, search type, and common fields
  const baseSearchParams = {
    ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
    // MODIFY BELOW CODE ONCE BU SELECTION IMPLEMENTED
    business_unit_ids:
      state.fsa_search_account_business_unit_ids ??
      OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS.business_unit_ids,
  };

  const hasAccountNumber = !!state.fsa_search_account_number;
  const hasReference = !!state.fsa_search_account_reference_case_number;
  const hasCompanyCriteria = Object.values(state.fsa_search_account_companies_search_criteria ?? {}).some(
    (x) => x !== null,
  );

  if (!hasAccountNumber && !hasReference && !hasCompanyCriteria) {
    return of({ count: 0, defendant_accounts: [] } as IOpalFinesDefendantAccountResponse);
  }

  if (hasAccountNumber) {
    return opalFinesService.getDefendantAccounts({
      ...baseSearchParams,
      reference_number: {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
        account_number: state.fsa_search_account_number,
        organisation: true,
      },
      active_accounts_only: false,
    });
  }

  if (hasReference) {
    return opalFinesService.getDefendantAccounts({
      ...baseSearchParams,
      reference_number: {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
        prosecutor_case_reference: state.fsa_search_account_reference_case_number,
        organisation: true,
      },
      active_accounts_only: false,
    });
  }

  // Company criteria search
  const companyCriteria = state.fsa_search_account_companies_search_criteria;
  return opalFinesService.getDefendantAccounts({
    ...baseSearchParams,
    defendant: {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
      organisation_name: companyCriteria!.fsa_search_account_companies_company_name,
      exact_match_organisation_name: companyCriteria!.fsa_search_account_companies_company_name_exact_match,
      include_aliases: companyCriteria!.fsa_search_account_companies_include_aliases ?? false,
      address_line_1: companyCriteria!.fsa_search_account_companies_address_line_1,
      postcode: companyCriteria!.fsa_search_account_companies_post_code,
      organisation: true,
    },
    active_accounts_only: state.fsa_search_account_active_accounts_only ?? true,
  });
};
