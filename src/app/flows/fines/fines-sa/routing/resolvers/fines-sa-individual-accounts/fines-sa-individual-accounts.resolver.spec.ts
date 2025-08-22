import { TestBed } from '@angular/core/testing';
import { lastValueFrom, Observable, of } from 'rxjs';
import { finesSaIndividualAccountsResolver } from './fines-sa-individual-accounts.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FinesSaStoreType } from '../../../stores/types/fines-sa.type';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
} from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE } from '../../../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individuals-state.constant';

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
        reference_number: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
          account_number: 'ACC123',
          organisation: false,
        },
        business_unit_ids: [1],
        active_accounts_only: false,
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
        reference_number: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
          prosecutor_case_reference: 'REF456',
          organisation: false,
        },
        business_unit_ids: [1],
        active_accounts_only: false,
      }),
    );
    expect(result).toEqual({ count: 1, defendant_accounts: [] });
  });

  it('should call API with individual criteria if account and reference are missing', async () => {
    const ind = {
      ...FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE,
      fsa_search_account_individuals_last_name: 'Smith',
      fsa_search_account_individuals_last_name_exact_match: false,
      fsa_search_account_individuals_first_names: 'John',
      fsa_search_account_individuals_first_names_exact_match: false,
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
        defendant: {
          ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
          surname: 'Smith',
          exact_match_surname: false,
          forenames: 'John',
          exact_match_forenames: false,
          include_aliases: false,
          organisation: false,
        },
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 1, defendant_accounts: [] });
  });

  it('should default active_accounts_only to true when nullish in individual criteria search', async () => {
    const ind = {
      ...FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE,
      fsa_search_account_individuals_last_name: 'Doe',
      fsa_search_account_individuals_last_name_exact_match: true,
      fsa_search_account_individuals_first_names: 'Jane',
      fsa_search_account_individuals_first_names_exact_match: true,
      fsa_search_account_individuals_address_line_1: '2 Side St',
      fsa_search_account_individuals_post_code: 'CD3 4EF',
      fsa_search_account_individuals_include_aliases: true,
    };

    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: ind,
      fsa_search_account_companies_search_criteria: null,
      fsa_search_account_minor_creditors_search_criteria: null,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: [99],
      // Intentionally nullish to exercise the `?? true` default
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
          surname: 'Doe',
          exact_match_surname: true,
          forenames: 'Jane',
          exact_match_forenames: true,
          address_line_1: '2 Side St',
          postcode: 'CD3 4EF',
          include_aliases: true,
          organisation: false,
        },
        business_unit_ids: [99],
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
