import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, RouterStateSnapshot, provideRouter } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_COMPANY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-company.mock';
import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';
import { FinesMciStore } from '../../../stores/fines-mci.store';
import { IFinesMciCriminalSearch } from '../../../stores/interfaces/fines-mci-criminal-search.interface';
import { finesMciCriminalAccountsResolver } from './fines-mci-criminal-accounts.resolver';
import { IFinesMciCriminalAccountsResult } from '../../../interfaces/fines-mci-criminal-accounts-result.interface';

describe('finesMciCriminalAccountsResolver', () => {
  let store: InstanceType<typeof FinesMciStore>;
  let search: IFinesMciCriminalSearch;
  const response = { count: 1, defendant_accounts: [] };
  const service = { getDefendantAccounts: vi.fn() };
  const resolve = () =>
    TestBed.runInInjectionContext(() =>
      finesMciCriminalAccountsResolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  const resolveResult = () => firstValueFrom(resolve() as Observable<IFinesMciCriminalAccountsResult>);

  beforeEach(() => {
    service.getDefendantAccounts.mockReset().mockReturnValue(of(response));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: OpalFines, useValue: service }] });
    store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    search = {
      activeTab: 'individuals',
      searchCriteriaCannotBeCombined: false,
      formData: {
        fsa_search_account_number: null,
        fsa_search_account_individuals_search_criteria: {
          fsa_search_account_individuals_last_name: 'Smith',
          fsa_search_account_individuals_first_names: 'John',
          fsa_search_account_individuals_last_name_exact_match: true,
          fsa_search_account_individuals_first_names_exact_match: false,
          fsa_search_account_individuals_include_aliases: true,
        },
        fsa_search_account_companies_search_criteria: {
          fsa_search_account_companies_company_name: null,
          fsa_search_account_companies_company_name_exact_match: null,
          fsa_search_account_companies_include_aliases: null,
        },
      },
    };
    store.setCriminalSearch(search);
  });

  it('searches using stored individual criteria and the selected business unit', async () => {
    const result = await resolveResult();

    expect(service.getDefendantAccounts).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        business_unit_ids: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id],
        active_accounts_only: true,
        reference_number: null,
        defendant: expect.objectContaining({
          surname: 'Smith',
          forenames: 'John',
          exact_match_surname: true,
          exact_match_forenames: false,
          include_aliases: true,
          organisation: false,
        }),
      }),
    );
    expect(result.response).toBe(response);
  });

  it('searches using stored company criteria', async () => {
    search.activeTab = 'companies';
    search.formData.fsa_search_account_companies_search_criteria = {
      fsa_search_account_companies_company_name: 'Acme Ltd',
      fsa_search_account_companies_company_name_exact_match: true,
      fsa_search_account_companies_include_aliases: true,
    };
    store.setCriminalSearch({ ...search });

    await resolveResult();

    expect(service.getDefendantAccounts).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        active_accounts_only: true,
        defendant: expect.objectContaining({
          organisation_name: 'Acme Ltd',
          exact_match_organisation_name: true,
          include_aliases: true,
          organisation: true,
        }),
      }),
    );
  });

  it('defaults unselected individual search options to false', async () => {
    search.formData.fsa_search_account_individuals_search_criteria = {
      fsa_search_account_individuals_last_name: 'Smith',
      fsa_search_account_individuals_first_names: null,
      fsa_search_account_individuals_last_name_exact_match: null,
      fsa_search_account_individuals_first_names_exact_match: null,
      fsa_search_account_individuals_include_aliases: null,
    };
    store.setCriminalSearch({ ...search });

    await resolveResult();

    expect(service.getDefendantAccounts).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        defendant: expect.objectContaining({
          surname: 'Smith',
          forenames: null,
          exact_match_surname: false,
          exact_match_forenames: false,
          include_aliases: false,
          organisation: false,
        }),
      }),
    );
  });

  it('defaults unselected company search options to false', async () => {
    store.setCriminalSearch({
      ...search,
      activeTab: 'companies',
      formData: {
        ...search.formData,
        fsa_search_account_companies_search_criteria: {
          fsa_search_account_companies_company_name: 'Acme Ltd',
          fsa_search_account_companies_company_name_exact_match: null,
          fsa_search_account_companies_include_aliases: null,
        },
      },
    });

    await resolveResult();

    expect(service.getDefendantAccounts).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        defendant: expect.objectContaining({
          organisation_name: 'Acme Ltd',
          exact_match_organisation_name: false,
          include_aliases: false,
          organisation: true,
        }),
      }),
    );
  });

  it.each(['individuals', 'companies'] as const)(
    'searches both party types for an account number from %s',
    async (tab) => {
      store.setCriminalSearch({
        ...search,
        activeTab: tab,
        formData: { ...search.formData, fsa_search_account_number: '12345678' },
      });

      await resolveResult();

      expect(service.getDefendantAccounts).toHaveBeenCalledTimes(2);
      for (const organisation of [false, true]) {
        expect(service.getDefendantAccounts).toHaveBeenCalledWith(
          expect.objectContaining({
            business_unit_ids: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id],
            active_accounts_only: false,
            defendant: null,
            reference_number: expect.objectContaining({ account_number: '12345678', organisation }),
          }),
        );
      }
    },
  );

  it.each(['individuals', 'companies'] as const)(
    'finds an account belonging to the opposite party type when %s is selected',
    async (tab) => {
      const isCompanyAccount = tab === 'individuals';
      const account = isCompanyAccount
        ? OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_COMPANY_MOCK.defendant_accounts[0]
        : OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0];
      store.setCriminalSearch({
        ...search,
        activeTab: tab,
        formData: { ...search.formData, fsa_search_account_number: '12345678' },
      });
      service.getDefendantAccounts.mockImplementation((params: IOpalFinesDefendantAccountSearchParams) =>
        of(
          params.reference_number?.organisation === isCompanyAccount
            ? { count: 1, defendant_accounts: [account] }
            : { count: 0, defendant_accounts: [] },
        ),
      );

      expect(await resolveResult()).toEqual({
        results: 'matches',
        response: { count: 1, defendant_accounts: [account] },
      });
    },
  );

  it('retains account records from both account-number searches', async () => {
    const individual = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0];
    const company = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_COMPANY_MOCK.defendant_accounts[0];
    store.setCriminalSearch({
      ...search,
      formData: { ...search.formData, fsa_search_account_number: '12345678' },
    });
    service.getDefendantAccounts
      .mockReturnValueOnce(of({ count: 1, defendant_accounts: [individual] }))
      .mockReturnValueOnce(of({ count: 1, defendant_accounts: [company] }));

    expect(await resolveResult()).toEqual({
      results: 'matches',
      response: { count: 2, defendant_accounts: [individual, company] },
    });
  });

  it.each([
    [0, 0, 'no-matches'],
    [0, 1, 'matches'],
    [1, 0, 'matches'],
    [50, 50, 'matches'],
    [50, 51, 'too-many'],
  ] as const)(
    'classifies combined account-number counts of %s and %s as %s',
    async (individualCount, companyCount, results) => {
      store.setCriminalSearch({
        ...search,
        formData: { ...search.formData, fsa_search_account_number: '12345678' },
      });
      service.getDefendantAccounts
        .mockReturnValueOnce(of({ count: individualCount, defendant_accounts: [] }))
        .mockReturnValueOnce(of({ count: companyCount, defendant_accounts: [] }));

      expect(await resolveResult()).toEqual({
        results,
        response: { count: individualCount + companyCount, defendant_accounts: [] },
      });
    },
  );

  it.each([false, true])('propagates account-number search failures for organisation=%s', async (organisation) => {
    const error = new Error('Search failed');
    store.setCriminalSearch({
      ...search,
      formData: { ...search.formData, fsa_search_account_number: '12345678' },
    });
    service.getDefendantAccounts.mockImplementation((params: IOpalFinesDefendantAccountSearchParams) =>
      params.reference_number?.organisation === organisation
        ? throwError(() => error)
        : of({ count: 0, defendant_accounts: [] }),
    );

    await expect(resolveResult()).rejects.toBe(error);
  });

  it.each([
    [0, 'no-matches'],
    [1, 'matches'],
    [100, 'matches'],
    [101, 'too-many'],
  ])('resolves count %s as %s and retains the API response', async (count, results) => {
    const accounts = { count, defendant_accounts: [] };
    service.getDefendantAccounts.mockReturnValue(of(accounts));

    expect(await resolveResult()).toEqual({ results, response: accounts });
  });

  it('resolves combined criteria without calling the API', async () => {
    store.setCriminalSearch({ ...search, searchCriteriaCannotBeCombined: true });

    expect(await resolveResult()).toEqual({ results: 'search-criteria-cannot-be-combined', response: null });
    expect(service.getDefendantAccounts).not.toHaveBeenCalled();
  });

  it('redirects to search when criteria are missing', () => {
    store.reset();
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);

    const result = resolve() as RedirectCommand;

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(result.redirectTo.toString()).toBe('/fines/manual-cash-input/create/till/payment/category/criminal/search');
    expect(service.getDefendantAccounts).not.toHaveBeenCalled();
  });

  it('does not search without a selected business unit', () => {
    store.reset();
    store.setCriminalSearch(search);

    expect(resolve()).toBeInstanceOf(RedirectCommand);
    expect(service.getDefendantAccounts).not.toHaveBeenCalled();
  });

  it('clears stored search criteria when the business unit changes', () => {
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1]);

    expect(store.criminalSearch()).toBeNull();
  });

  it('clears stored search criteria when the flow resets', () => {
    store.reset();

    expect(store.criminalSearch()).toBeNull();
  });

  it('propagates HTTP errors rather than treating them as no matches', async () => {
    const error = new Error('Search failed');
    service.getDefendantAccounts.mockReturnValue(throwError(() => error));

    await expect(resolveResult()).rejects.toBe(error);
  });
});
