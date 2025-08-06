import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { FinesSaService } from '../../services/fines-sa.service';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';

/**
 * Resolver that retrieves company defendant accounts based on current search criteria in the Fines SA flow.
 *
 * The resolver determines which search criteria to apply in the following order of precedence:
 *
 * 1. If an account number is provided, the search is performed using only the account number.
 * 2. If no account number is provided but a reference case number is, the search is performed using the reference.
 * 3. If neither of the above are provided but the "Company" tab contains populated data, a detailed individual criteria search is performed.
 * 4. If none of the above criteria are present, no API call is made and an empty result set is returned.
 *
 * This resolver is intended specifically for Company account searches. If only the "Companies" tab is filled,
 * this resolver will return an empty response without making an API call.
 *
 * @returns Observable of IOpalFinesDefendantAccountResponse
 */
export const finesSaCompanyAccountsResolver: ResolveFn<IOpalFinesDefendantAccountResponse> = () => {
  const opalFinesService = inject(OpalFines);
  const finesSaService = inject(FinesSaService);
  const finesSaStore = inject(FinesSaStore);
  const state = finesSaStore.searchAccount();

  const common = {
    business_unit_ids: state.fsa_search_account_business_unit_ids,
    active_accounts_only: state.fsa_search_account_active_accounts_only ?? true,
  };

  const hasAccountNumber = !!state.fsa_search_account_number;
  const hasReference = !!state.fsa_search_account_reference_case_number;
  const comp = state.fsa_search_account_companies_search_criteria;
  const searchType = 'company';

  if (!hasAccountNumber && !hasReference && !(comp && finesSaService.hasTabPopulated(comp))) {
    return of({ count: 0, defendant_accounts: [] } as IOpalFinesDefendantAccountResponse);
  }

  if (hasAccountNumber) {
    return opalFinesService.getDefendantAccounts({
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
      search_type: searchType,
      account_number: state.fsa_search_account_number,
      ...common,
    });
  } else if (hasReference) {
    return opalFinesService.getDefendantAccounts({
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
      search_type: searchType,
      pcr: state.fsa_search_account_reference_case_number,
      ...common,
    });
  } else {
    const companyCriteria = comp!;
    return opalFinesService.getDefendantAccounts({
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
      search_type: searchType,
      organisation_name: companyCriteria.fsa_search_account_companies_company_name,
      exact_match_organisation_name: companyCriteria.fsa_search_account_companies_company_name_exact_match,
      include_aliases: companyCriteria.fsa_search_account_companies_include_aliases,
      address_line: companyCriteria.fsa_search_account_companies_address_line_1,
      postcode: companyCriteria.fsa_search_account_companies_post_code,
      ...common,
    });
  }
};
