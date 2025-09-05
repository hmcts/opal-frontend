import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';
import { of } from 'rxjs';

/**
 * Generic defendant accounts resolver
 * Precedence: account_number > reference (PCR) > criteria form for the selected party type.
 */
export const finesSaDefendantAccountsResolver: ResolveFn<IOpalFinesDefendantAccountResponse> = () => {
  const opalFinesService = inject(OpalFines);
  const finesSaStore = inject(FinesSaStore);
  const state = finesSaStore.searchAccount();
  const activeTab = finesSaStore.activeTab();

  // Common flags
  const hasAccountNumber = !!state.fsa_search_account_number;
  const hasReference = !!state.fsa_search_account_reference_case_number;
  const individualCriteria = state.fsa_search_account_individuals_search_criteria;
  const companyCriteria = state.fsa_search_account_companies_search_criteria;

  // Build shared base params once
  const baseSearchParams = {
    ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
    business_unit_ids: state.fsa_search_account_business_unit_ids,
    active_accounts_only: state.fsa_search_account_active_accounts_only ?? true,
  } as const;

  // Early exit when nothing to search for the SELECTED party type
  const hasSelectedCriteria = !!individualCriteria || !!companyCriteria;
  if (!hasAccountNumber && !hasReference && !hasSelectedCriteria) {
    return of({ count: 0, defendant_accounts: [] } as IOpalFinesDefendantAccountResponse);
  }

  // 1) Account number wins
  if (hasAccountNumber) {
    return opalFinesService.getDefendantAccounts({
      ...baseSearchParams,
      account_number: state.fsa_search_account_number,
      active_accounts_only: false,
    });
  }

  // 2) Reference (PCR)
  if (hasReference) {
    return opalFinesService.getDefendantAccounts({
      ...baseSearchParams,
      pcr: state.fsa_search_account_reference_case_number,
      active_accounts_only: false,
    });
  }

  // 3) Criteria based on searchType
  if (activeTab === 'individuals' && individualCriteria) {
    return opalFinesService.getDefendantAccounts({
      ...baseSearchParams,
      search_type: 'individual',
      surname: individualCriteria.fsa_search_account_individuals_last_name,
      exact_match_surname: individualCriteria.fsa_search_account_individuals_last_name_exact_match,
      forename: individualCriteria.fsa_search_account_individuals_first_names,
      exact_match_forenames: individualCriteria.fsa_search_account_individuals_first_names_exact_match,
      date_of_birth: individualCriteria.fsa_search_account_individuals_date_of_birth,
      ni_number: individualCriteria.fsa_search_account_individuals_national_insurance_number,
      address_line: individualCriteria.fsa_search_account_individuals_address_line_1,
      postcode: individualCriteria.fsa_search_account_individuals_post_code,
      include_aliases: individualCriteria.fsa_search_account_individuals_include_aliases,
    });
  }

  if (activeTab === 'companies' && companyCriteria) {
    return opalFinesService.getDefendantAccounts({
      ...baseSearchParams,
      search_type: 'company',
      organisation_name: companyCriteria.fsa_search_account_companies_company_name,
      exact_match_organisation_name: companyCriteria.fsa_search_account_companies_company_name_exact_match,
      include_aliases: companyCriteria.fsa_search_account_companies_include_aliases,
      address_line: companyCriteria.fsa_search_account_companies_address_line_1,
      postcode: companyCriteria.fsa_search_account_companies_post_code,
    });
  }

  // Fallback (should be unreachable due to early-exit guard)
  return of({ count: 0, defendant_accounts: [] } as IOpalFinesDefendantAccountResponse);
};
