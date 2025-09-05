import { TestBed } from '@angular/core/testing';
import { lastValueFrom, Observable, of } from 'rxjs';
import { finesSaDefendantAccountsResolver } from './fines-sa-defendant-accounts.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FinesSaStoreType } from '../../../stores/types/fines-sa.type';
import { ResolveFn } from '@angular/router';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../../../fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exec: ResolveFn<any> = (...params) =>
  TestBed.runInInjectionContext(() => finesSaDefendantAccountsResolver(...params));

describe('finesSaDefendantAccountsResolver (store-driven)', () => {
  let opalFines: jasmine.SpyObj<OpalFines>;
  let finesSaStore: FinesSaStoreType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: jasmine.createSpyObj('OpalFines', ['getDefendantAccounts']) },
        FinesSaStore,
      ],
    });

    opalFines = TestBed.inject(OpalFines) as jasmine.SpyObj<OpalFines>;
    finesSaStore = TestBed.inject(FinesSaStore);
  });

  it('returns early empty result when no inputs at all', async () => {
    finesSaStore.setActiveTab('individuals');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(exec(undefined as any, undefined as any) as Observable<any>);

    expect(opalFines.getDefendantAccounts).not.toHaveBeenCalled();
    expect(result).toEqual({ count: 0, defendant_accounts: [] });
  });

  it('prioritises account number', async () => {
    finesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_number: 'ACC-1',
      fsa_search_account_reference_case_number: 'PCR-2',
    });
    finesSaStore.setActiveTab('companies');
    opalFines.getDefendantAccounts.and.returnValue(of({ count: 1, defendant_accounts: [] }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(exec(undefined as any, undefined as any) as Observable<any>);

    expect(opalFines.getDefendantAccounts).toHaveBeenCalledWith(jasmine.objectContaining({ account_number: 'ACC-1' }));
    expect(result).toEqual({ count: 1, defendant_accounts: [] });
  });

  it('uses PCR when account number is absent', async () => {
    finesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_reference_case_number: 'PCR-9',
    });
    finesSaStore.setActiveTab('individuals');
    opalFines.getDefendantAccounts.and.returnValue(of({ count: 2, defendant_accounts: [] }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(exec(undefined as any, undefined as any) as Observable<any>);

    expect(opalFines.getDefendantAccounts).toHaveBeenCalledWith(jasmine.objectContaining({ pcr: 'PCR-9' }));
    expect(result).toEqual({ count: 2, defendant_accounts: [] });
  });

  it('builds individual payload when activeTab = individuals and criteria present', async () => {
    finesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: 'Doe',
        fsa_search_account_individuals_last_name_exact_match: true,
        fsa_search_account_individuals_first_names: 'Jane',
        fsa_search_account_individuals_first_names_exact_match: false,
        fsa_search_account_individuals_date_of_birth: '1980-01-02',
        fsa_search_account_individuals_national_insurance_number: 'QQ123456C',
        fsa_search_account_individuals_address_line_1: '10 Lane',
        fsa_search_account_individuals_post_code: 'AB1 2CD',
        fsa_search_account_individuals_include_aliases: true,
      } as never,
    });
    finesSaStore.setActiveTab('individuals');
    opalFines.getDefendantAccounts.and.returnValue(of({ count: 3, defendant_accounts: [] }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await lastValueFrom(exec(undefined as any, undefined as any) as Observable<any>);

    expect(opalFines.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        surname: 'Doe',
        exact_match_surname: true,
        forename: 'Jane',
        exact_match_forenames: false,
        date_of_birth: '1980-01-02',
        ni_number: 'QQ123456C',
        address_line: '10 Lane',
        postcode: 'AB1 2CD',
        include_aliases: true,
      }),
    );
  });

  it('builds company payload when activeTab = companies and criteria present', async () => {
    finesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_companies_search_criteria: {
        fsa_search_account_companies_company_name: 'ACME Ltd',
        fsa_search_account_companies_company_name_exact_match: true,
        fsa_search_account_companies_include_aliases: false,
        fsa_search_account_companies_address_line_1: '2 Road',
        fsa_search_account_companies_post_code: 'XY1 9ZZ',
      } as never,
    });
    finesSaStore.setActiveTab('companies');
    opalFines.getDefendantAccounts.and.returnValue(of({ count: 4, defendant_accounts: [] }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await lastValueFrom(exec(undefined as any, undefined as any) as Observable<any>);

    expect(opalFines.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        organisation_name: 'ACME Ltd',
        exact_match_organisation_name: true,
        include_aliases: false,
        address_line: '2 Road',
        postcode: 'XY1 9ZZ',
      }),
    );
  });

  it('defaults active_accounts_only to true when not set in store', async () => {
    // active flag omitted -> resolver should send true by default
    finesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_active_accounts_only: null,
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: 'Default',
      } as never,
    });
    finesSaStore.setActiveTab('individuals');

    opalFines.getDefendantAccounts.and.returnValue(of({ count: 1, defendant_accounts: [] }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await lastValueFrom(exec(undefined as any, undefined as any) as Observable<any>);

    expect(opalFines.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({ active_accounts_only: true }),
    );
  });

  it('hits the defensive fallback when activeTab mismatches provided criteria', async () => {
    // Only individual criteria present but active tab is companies -> falls through to final of({})
    finesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: 'X',
      } as never,
    });
    finesSaStore.setActiveTab('companies');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(exec(undefined as any, undefined as any) as Observable<any>);

    expect(opalFines.getDefendantAccounts).not.toHaveBeenCalled();
    expect(result).toEqual({ count: 0, defendant_accounts: [] });
  });
});
