import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import {
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
} from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';
import { of } from 'rxjs';

/**
 * Resolver that retrieves defendant accounts based on current search criteria in the Fines SA flow.
 *
 * The resolver determines which search criteria to apply in the following order of precedence:
 *
 * 1. If an account number is provided, the search is performed using only the account number.
 * 2. If no account number is provided but a reference case number is, the search is performed using the reference.
 * 3. If neither of the above are provided but the active tab contains populated data, a detailed criteria search is performed.
 * 4. If none of the above criteria are present, no API call is made and an empty result set is returned.
 *
 * This resolver is intended specifically for defendant account searches.
 *
 * @returns Observable of IOpalFinesDefendantAccountResponse
 */
export const finesSaDefendantAccountsResolver =
  (isCompany: boolean): ResolveFn<IOpalFinesDefendantAccountResponse> =>
  () => {
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
      business_unit_ids:
        state.fsa_search_account_business_unit_ids ??
        OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS.business_unit_ids,
    } as const;

    // Early exit when nothing to search for the SELECTED party type
    const hasIndividualCriteria = Object.values(state.fsa_search_account_individuals_search_criteria ?? {}).some(
      (x) => x !== null,
    );
    const hasCompanyCriteria = Object.values(state.fsa_search_account_companies_search_criteria ?? {}).some(
      (x) => x !== null,
    );
    const hasSelectedCriteria = isCompany ? hasCompanyCriteria : hasIndividualCriteria;
    if (!hasAccountNumber && !hasReference && !hasSelectedCriteria) {
      return of({ count: 0, defendant_accounts: [] } as IOpalFinesDefendantAccountResponse);
    }

    // 1) Account number wins
    if (hasAccountNumber) {
      return opalFinesService.getDefendantAccounts({
        ...baseSearchParams,
        reference_number: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
          account_number: state.fsa_search_account_number,
          organisation: isCompany,
        },
        active_accounts_only: false,
      });
    }

    // 2) Reference (PCR)
    if (hasReference) {
      return opalFinesService.getDefendantAccounts({
        ...baseSearchParams,
        reference_number: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
          prosecutor_case_reference: state.fsa_search_account_reference_case_number,
          organisation: isCompany,
        },
        active_accounts_only: false,
      });
    }

    // 3) Criteria based on searchType
    if (activeTab === 'individuals' && individualCriteria) {
      return opalFinesService.getDefendantAccounts({
        ...baseSearchParams,
        reference_number: null,
        defendant: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
          surname: individualCriteria.fsa_search_account_individuals_last_name,
          exact_match_surname: individualCriteria.fsa_search_account_individuals_last_name_exact_match ?? false,
          forenames: individualCriteria.fsa_search_account_individuals_first_names,
          exact_match_forenames: individualCriteria.fsa_search_account_individuals_first_names_exact_match ?? false,
          birth_date: individualCriteria.fsa_search_account_individuals_date_of_birth,
          national_insurance_number: individualCriteria.fsa_search_account_individuals_national_insurance_number,
          address_line_1: individualCriteria.fsa_search_account_individuals_address_line_1,
          postcode: individualCriteria.fsa_search_account_individuals_post_code,
          include_aliases: individualCriteria.fsa_search_account_individuals_include_aliases ?? false,
          organisation: isCompany,
        },
        active_accounts_only: state.fsa_search_account_active_accounts_only ?? true,
      });
    }

    if (activeTab === 'companies' && companyCriteria) {
      return opalFinesService.getDefendantAccounts({
        ...baseSearchParams,
        reference_number: null,
        defendant: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
          organisation_name: companyCriteria.fsa_search_account_companies_company_name,
          exact_match_organisation_name: companyCriteria.fsa_search_account_companies_company_name_exact_match ?? false,
          include_aliases: companyCriteria.fsa_search_account_companies_include_aliases ?? false,
          address_line_1: companyCriteria.fsa_search_account_companies_address_line_1,
          postcode: companyCriteria.fsa_search_account_companies_post_code,
          organisation: isCompany,
        },
        active_accounts_only: state.fsa_search_account_active_accounts_only ?? true,
      });
    }

    // Fallback (should be unreachable due to early-exit guard)
    return of({ count: 0, defendant_accounts: [] } as IOpalFinesDefendantAccountResponse);
  };

/**
 * Resolver for fetching individual defendant accounts in the Fines SA flow.
 *
 * This resolver is a specialized version of `finesSaDefendantAccountsResolver`
 * configured for individual (non-organization) defendants by passing `false`
 * as the parameter.
 *
 * @see finesSaDefendantAccountsResolver
 */
export const finesSaIndividualDefendantAccountsResolver = finesSaDefendantAccountsResolver(false);

/**
 * Resolver for retrieving company defendant accounts in the Fines SA flow.
 *
 * This resolver is a specialized version of `finesSaDefendantAccountsResolver`
 * configured for company defendants by passing `true` as an argument.
 *
 * @see finesSaDefendantAccountsResolver
 */
export const finesSaCompanyDefendantAccountsResolver = finesSaDefendantAccountsResolver(true);
