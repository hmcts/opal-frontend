import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IOpalFinesCreditorAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-creditor-accounts.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { of } from 'rxjs';
import {
  OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_CREDITOR_DEFAULT,
  OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
} from '@services/fines/opal-fines-service/constants/opal-fines-creditor-account-search-params-defaults.constant';

/**
 * Resolves minor creditor account search results for the Fines SA flow.
 *
 * This resolver determines the appropriate search parameters based on the current state
 * from the `FinesSaStore` and invokes the `OpalFines` service to fetch creditor accounts.
 *
 * The logic follows these rules:
 * - If a reference case number is present, returns an empty result.
 * - If neither an account number nor minor creditor search criteria are present, returns an empty result.
 * - If an account number is present, searches by account number.
 * - If minor creditor criteria are present, searches by either individual or organisation details.
 *
 * @returns An observable of `IOpalFinesCreditorAccountResponse` containing the search results.
 */
export const finesSaMinorCreditorAccountsResolver: ResolveFn<IOpalFinesCreditorAccountResponse> = () => {
  const opalFinesService = inject(OpalFines);
  const finesSaStore = inject(FinesSaStore);
  const state = finesSaStore.searchAccount();

  // Create base object with defaults, search type, and common fields
  const baseSearchParams = {
    ...OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
    // MODIFY BELOW CODE ONCE BU SELECTION IMPLEMENTED
    business_unit_ids:
      state.fsa_search_account_business_unit_ids ??
      OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_DEFAULTS.business_unit_ids,
    active_accounts_only: false,
  };

  const hasAccountNumber = !!state.fsa_search_account_number;
  const hasReference = !!state.fsa_search_account_reference_case_number;
  const hasMinorCreditorCriteria = Object.values(state.fsa_search_account_minor_creditors_search_criteria ?? {}).some(
    (x) => x !== null,
  );

  if (hasReference) {
    return of({ count: 0, creditor_accounts: [] } as IOpalFinesCreditorAccountResponse);
  }

  if (!hasAccountNumber && !hasMinorCreditorCriteria) {
    return of({ count: 0, creditor_accounts: [] } as IOpalFinesCreditorAccountResponse);
  }

  if (hasAccountNumber) {
    return opalFinesService.getMinorCreditorAccounts({
      ...baseSearchParams,
      account_number: state.fsa_search_account_number,
      active_accounts_only: false,
    });
  }

  // Minor creditor search
  const minorCreditorCriteria = state.fsa_search_account_minor_creditors_search_criteria!;
  if (minorCreditorCriteria.fsa_search_account_minor_creditors_minor_creditor_type === 'individual') {
    return opalFinesService.getMinorCreditorAccounts({
      ...baseSearchParams,
      creditor: {
        ...OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_CREDITOR_DEFAULT,
        organisation: false,
        surname:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_individual
            .fsa_search_account_minor_creditors_last_name,
        exact_match_surname:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_individual
            .fsa_search_account_minor_creditors_last_name_exact_match,
        forenames:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_individual
            .fsa_search_account_minor_creditors_first_names,
        exact_match_forenames:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_individual
            .fsa_search_account_minor_creditors_first_names_exact_match,
        address_line_1:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_individual
            .fsa_search_account_minor_creditors_individual_address_line_1,
        postcode:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_individual
            .fsa_search_account_minor_creditors_individual_post_code,
      },
    });
  } else {
    return opalFinesService.getMinorCreditorAccounts({
      ...baseSearchParams,
      creditor: {
        ...OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_CREDITOR_DEFAULT,
        organisation: true,
        organisation_name:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_company
            .fsa_search_account_minor_creditors_company_name,
        exact_match_organisation_name:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_company
            .fsa_search_account_minor_creditors_company_name_exact_match,
        address_line_1:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_company
            .fsa_search_account_minor_creditors_company_address_line_1,
        postcode:
          minorCreditorCriteria!.fsa_search_account_minor_creditors_company
            .fsa_search_account_minor_creditors_company_post_code,
      },
    });
  }
};
