import { TestBed } from '@angular/core/testing';
import { lastValueFrom, Observable, of } from 'rxjs';
import { finesSaCompanyAccountsResolver } from './fines-sa-company-accounts.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FinesSaStoreType } from '../../../stores/types/fines-sa.type';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

describe('finesSaCompanyAccountsResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeResolver: ResolveFn<any> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesSaCompanyAccountsResolver(...resolverParameters));

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
    opalFinesService.getDefendantAccounts.and.returnValue(of({ count: 0, defendant_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        account_number: 'ACC123',
        search_type: 'company',
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 0, defendant_accounts: [] });
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
    opalFinesService.getDefendantAccounts.and.returnValue(of({ count: 0, defendant_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pcr: 'REF456',
        search_type: 'company',
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 0, defendant_accounts: [] });
  });

  it('should call API with company criteria if account and reference are missing', async () => {
    const comp = {
      fsa_search_account_companies_company_name: 'Acme Corp',
      fsa_search_account_companies_company_name_exact_match: false,
      fsa_search_account_companies_address_line_1: '',
      fsa_search_account_companies_post_code: '',
      fsa_search_account_companies_include_aliases: false,
    };
    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: null,
      fsa_search_account_companies_search_criteria: comp,
      fsa_search_account_minor_creditors_search_criteria: null,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: [1],
      fsa_search_account_active_accounts_only: true,
    });
    opalFinesService.getDefendantAccounts.and.returnValue(of({ count: 0, defendant_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        organisation_name: 'Acme Corp',
        exact_match_organisation_name: false,
        address_line: '',
        postcode: '',
        include_aliases: false,
        search_type: 'company',
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 0, defendant_accounts: [] });
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

  it('should return empty result if company criteria is present but not populated', async () => {
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
