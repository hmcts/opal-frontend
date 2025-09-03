import { TestBed } from '@angular/core/testing';
import { lastValueFrom, Observable, of } from 'rxjs';
import { finesSaIndividualAccountsResolver } from './fines-sa-individual-accounts.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { FinesSaStoreType } from '../../stores/types/fines-sa.type';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

describe('finesSaIndividualAccountsResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeResolver: ResolveFn<any> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesSaIndividualAccountsResolver(...resolverParameters));

  let opalFinesService: jasmine.SpyObj<OpalFines>;
  let finesSaStore: FinesSaStoreType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: jasmine.createSpyObj('OpalFines', ['getDefendantAccounts']) },
        FinesSaStore,
      ],
    });

    opalFinesService = TestBed.inject(OpalFines) as jasmine.SpyObj<OpalFines>;
    finesSaStore = TestBed.inject(FinesSaStore);
  });

  it('should call API with account number if provided', async () => {
    finesSaStore.setSearchAccount({
      fsa_search_account_number: 'ACC123',
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: null,
      fsa_search_account_companies_search_criteria: null,
      fsa_search_account_minor_creditors_search_criteria: null,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: [1],
      fsa_search_account_active_accounts_only: true,
    });
    opalFinesService.getDefendantAccounts.and.returnValue(of({ count: 1, defendant_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        account_number: 'ACC123',
        search_type: 'individual',
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 1, defendant_accounts: [] });
  });

  it('should call API with reference if account number is missing but reference is present', async () => {
    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: 'REF456',
      fsa_search_account_individuals_search_criteria: null,
      fsa_search_account_companies_search_criteria: null,
      fsa_search_account_minor_creditors_search_criteria: null,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: [1],
      fsa_search_account_active_accounts_only: true,
    });
    opalFinesService.getDefendantAccounts.and.returnValue(of({ count: 1, defendant_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pcr: 'REF456',
        search_type: 'individual',
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 1, defendant_accounts: [] });
  });

  it('should call API with individual criteria if account and reference are missing', async () => {
    const ind = {
      fsa_search_account_individuals_last_name: 'Smith',
      fsa_search_account_individuals_last_name_exact_match: false,
      fsa_search_account_individuals_first_names: 'John',
      fsa_search_account_individuals_first_names_exact_match: false,
      fsa_search_account_individuals_date_of_birth: null,
      fsa_search_account_individuals_national_insurance_number: '',
      fsa_search_account_individuals_address_line_1: '',
      fsa_search_account_individuals_post_code: '',
      fsa_search_account_individuals_include_aliases: false,
    };
    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: ind,
      fsa_search_account_companies_search_criteria: null,
      fsa_search_account_minor_creditors_search_criteria: null,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: [1],
      fsa_search_account_active_accounts_only: true,
    });
    opalFinesService.getDefendantAccounts.and.returnValue(of({ count: 1, defendant_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        surname: 'Smith',
        exact_match_surname: false,
        forename: 'John',
        exact_match_forenames: false,
        date_of_birth: null,
        ni_number: '',
        address_line: '',
        postcode: '',
        include_aliases: false,
        search_type: 'individual',
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 1, defendant_accounts: [] });
  });

  it('should return empty result if no search criteria is provided', async () => {
    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: null,
      fsa_search_account_companies_search_criteria: null,
      fsa_search_account_minor_creditors_search_criteria: null,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: null,
      fsa_search_account_active_accounts_only: null,
    });
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(result).toEqual({ count: 0, defendant_accounts: [] });
    expect(opalFinesService.getDefendantAccounts).not.toHaveBeenCalled();
  });

  it('should return empty result if individual criteria is present but not populated', async () => {
    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: null,
      fsa_search_account_companies_search_criteria: null,
      fsa_search_account_minor_creditors_search_criteria: null,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: null,
      fsa_search_account_active_accounts_only: null,
    });
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(result).toEqual({ count: 0, defendant_accounts: [] });
    expect(opalFinesService.getDefendantAccounts).not.toHaveBeenCalled();
  });
});
