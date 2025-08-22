import { TestBed } from '@angular/core/testing';
import { lastValueFrom, Observable, of } from 'rxjs';
import { finesSaCompanyAccountsResolver } from './fines-sa-company-accounts.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FinesSaStoreType } from '../../../stores/types/fines-sa.type';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
} from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE } from '../../../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-companies/constants/fines-sa-search-account-form-companies-state.constant';

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
        reference_number: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
          account_number: 'ACC123',
          organisation: true,
        },
        business_unit_ids: [1],
        active_accounts_only: false,
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
        reference_number: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
          prosecutor_case_reference: 'REF456',
          organisation: true,
        },
        business_unit_ids: [1],
        active_accounts_only: false,
      }),
    );
    expect(result).toEqual({ count: 0, defendant_accounts: [] });
  });

  it('should call API with company criteria if account and reference are missing', async () => {
    const comp = {
      ...FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE,
      fsa_search_account_companies_company_name: 'Acme Corp',
      fsa_search_account_companies_company_name_exact_match: false,
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
        defendant: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
          organisation: true,
          organisation_name: 'Acme Corp',
          exact_match_organisation_name: false,
          include_aliases: false,
        },
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 0, defendant_accounts: [] });
  });

  it('should default active_accounts_only to true when nullish in company criteria search', async () => {
    const comp = {
      ...FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE,
      fsa_search_account_companies_company_name: 'Umbrella Inc',
      fsa_search_account_companies_company_name_exact_match: true,
      fsa_search_account_companies_address_line_1: '1 Main St',
      fsa_search_account_companies_post_code: 'AB1 2CD',
      fsa_search_account_companies_include_aliases: true,
    };

    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: null,
      fsa_search_account_companies_search_criteria: comp,
      fsa_search_account_minor_creditors_search_criteria: null,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: [42],
      // This is intentionally nullish to exercise the `?? true` default
      fsa_search_account_active_accounts_only: null,
    });

    opalFinesService.getDefendantAccounts.and.returnValue(of({ count: 0, defendant_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getDefendantAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        defendant: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
          organisation: true,
          organisation_name: 'Umbrella Inc',
          exact_match_organisation_name: true,
          address_line_1: '1 Main St',
          postcode: 'AB1 2CD',
          include_aliases: true,
        },
        business_unit_ids: [42],
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
