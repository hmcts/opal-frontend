import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_MCI_CRIMINAL_SEARCH_MOCK } from '../mocks/fines-mci-criminal-search.mock';
import { IFinesMciCriminalSearch } from '../stores/interfaces/fines-mci-criminal-search.interface';
import { buildFinesMciCriminalAccountSearchParams } from './fines-mci-criminal-account-search-params.utils';

describe('buildFinesMciCriminalAccountSearchParams', () => {
  let search: IFinesMciCriminalSearch;

  beforeEach(() => {
    search = structuredClone(FINES_MCI_CRIMINAL_SEARCH_MOCK);
  });

  it('maps individual names and selected matching options to an active-account search', () => {
    search.formData.fsa_search_account_individuals_search_criteria = {
      fsa_search_account_individuals_last_name: 'Example',
      fsa_search_account_individuals_first_names: 'Test',
      fsa_search_account_individuals_last_name_exact_match: true,
      fsa_search_account_individuals_first_names_exact_match: true,
      fsa_search_account_individuals_include_aliases: true,
    };
    expect(buildFinesMciCriminalAccountSearchParams(search, 77)).toEqual(
      expect.objectContaining({
        business_unit_ids: [77],
        active_accounts_only: true,
        reference_number: null,
        defendant: expect.objectContaining({
          surname: 'Example',
          forenames: 'Test',
          organisation: false,
          exact_match_surname: true,
          exact_match_forenames: true,
          include_aliases: true,
        }),
      }),
    );
  });

  it('maps company criteria using the selected Companies tab', () => {
    search.activeTab = 'companies';
    search.formData.fsa_search_account_companies_search_criteria = {
      fsa_search_account_companies_company_name: 'Example Company',
      fsa_search_account_companies_company_name_exact_match: true,
      fsa_search_account_companies_include_aliases: true,
    };
    expect(buildFinesMciCriminalAccountSearchParams(search, 78)).toEqual(
      expect.objectContaining({
        business_unit_ids: [78],
        active_accounts_only: true,
        reference_number: null,
        defendant: expect.objectContaining({
          organisation: true,
          organisation_name: 'Example Company',
          exact_match_organisation_name: true,
          include_aliases: true,
        }),
      }),
    );
  });

  it('defaults missing individual matching options to false and preserves null first names', () => {
    const criteria = search.formData.fsa_search_account_individuals_search_criteria;
    criteria.fsa_search_account_individuals_last_name_exact_match = null;
    criteria.fsa_search_account_individuals_first_names_exact_match = null;
    criteria.fsa_search_account_individuals_include_aliases = null;
    expect(buildFinesMciCriminalAccountSearchParams(search, 77).defendant).toEqual(
      expect.objectContaining({
        surname: 'Example',
        forenames: null,
        exact_match_surname: false,
        exact_match_forenames: false,
        include_aliases: false,
      }),
    );
  });

  it('defaults missing company matching options to false', () => {
    search.activeTab = 'companies';
    search.formData.fsa_search_account_companies_search_criteria = {
      fsa_search_account_companies_company_name: 'Example Company',
      fsa_search_account_companies_company_name_exact_match: null,
      fsa_search_account_companies_include_aliases: null,
    };
    expect(buildFinesMciCriminalAccountSearchParams(search, 77).defendant).toEqual(
      expect.objectContaining({
        organisation_name: 'Example Company',
        exact_match_organisation_name: false,
        include_aliases: false,
      }),
    );
  });

  it.each(['individuals', 'companies'] as const)(
    'supports both explicit party types for an account-number search from the %s tab',
    (tab) => {
      search.activeTab = tab;
      search.formData.fsa_search_account_number = '12345678A';
      for (const isCompany of [false, true]) {
        expect(buildFinesMciCriminalAccountSearchParams(search, 77, isCompany)).toEqual(
          expect.objectContaining({
            business_unit_ids: [77],
            active_accounts_only: false,
            defendant: null,
            reference_number: expect.objectContaining({ account_number: '12345678A', organisation: isCompany }),
          }),
        );
      }
    },
  );

  it('does not mutate submitted criteria and creates independent request payloads', () => {
    const original = structuredClone(search);
    const first = buildFinesMciCriminalAccountSearchParams(search, 77);
    const second = buildFinesMciCriminalAccountSearchParams(search, 78);
    first.business_unit_ids!.push(99);
    first.defendant!.surname = 'Changed';
    expect(search).toEqual(original);
    expect(second.business_unit_ids).toEqual([78]);
    expect(second.defendant?.surname).toBe('Example');
  });
});
