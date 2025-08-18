import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { finesSaMinorCreditorAccountsResolver } from './fines-sa-minor-creditor-accounts.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FinesSaStoreType } from '../../../stores/types/fines-sa.type';
import { of, lastValueFrom, Observable } from 'rxjs';
import { IFinesSaSearchAccountFormMinorCreditorsState } from '../../../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/interfaces/fines-sa-search-account-form-minor-creditors-state.interface';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE } from '../../../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/constants/fines-sa-search-account-form-minor-creditors-state.constant';

describe('finesSaMinorCreditorAccountsResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeResolver: ResolveFn<any> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesSaMinorCreditorAccountsResolver(...resolverParameters));

  let opalFinesService: jasmine.SpyObj<OpalFines>;
  let finesSaStore: FinesSaStoreType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: jasmine.createSpyObj('OpalFines', ['getCreditorAccounts']) },
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
    opalFinesService.getCreditorAccounts.and.returnValue(of({ count: 1, creditor_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getCreditorAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        account_number: 'ACC123',
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 1, creditor_accounts: [] });
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
    opalFinesService.getCreditorAccounts.and.returnValue(of({ count: 0, creditor_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getCreditorAccounts).not.toHaveBeenCalled();
    expect(result).toEqual({ count: 0, creditor_accounts: [] });
  });

  it('should call API with minor creditor individual criteria if account and reference are missing', async () => {
    const min: IFinesSaSearchAccountFormMinorCreditorsState = {
      ...FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE,
      fsa_search_account_minor_creditors_minor_creditor_type: 'individual',
      fsa_search_account_minor_creditors_individual: {
        fsa_search_account_minor_creditors_first_names: 'John',
        fsa_search_account_minor_creditors_last_name: 'Smith',
        fsa_search_account_minor_creditors_first_names_exact_match: false,
        fsa_search_account_minor_creditors_last_name_exact_match: false,
        fsa_search_account_minor_creditors_individual_address_line_1: '',
        fsa_search_account_minor_creditors_individual_post_code: '',
      },
    };
    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: null,
      fsa_search_account_companies_search_criteria: null,
      fsa_search_account_minor_creditors_search_criteria: min,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: [1],
      fsa_search_account_active_accounts_only: true,
    });
    opalFinesService.getCreditorAccounts.and.returnValue(of({ count: 1, creditor_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getCreditorAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        creditor: {
          organisation: false,
          surname: 'Smith',
          exact_match_surname: false,
          forenames: 'John',
          exact_match_forenames: false,
          address_line_1: '',
          postcode: '',
        },
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 1, creditor_accounts: [] });
  });

  it('should call API with minor creditor company criteria if account and reference are missing', async () => {
    const min: IFinesSaSearchAccountFormMinorCreditorsState = {
      ...FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE,
      fsa_search_account_minor_creditors_minor_creditor_type: 'company',
      fsa_search_account_minor_creditors_company: {
        fsa_search_account_minor_creditors_company_name: 'Acme Corp',
        fsa_search_account_minor_creditors_company_name_exact_match: false,
        fsa_search_account_minor_creditors_company_address_line_1: '',
        fsa_search_account_minor_creditors_company_post_code: '',
      },
    };
    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: null,
      fsa_search_account_companies_search_criteria: null,
      fsa_search_account_minor_creditors_search_criteria: min,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: [1],
      fsa_search_account_active_accounts_only: true,
    });
    opalFinesService.getCreditorAccounts.and.returnValue(of({ count: 1, creditor_accounts: [] }));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesService.getCreditorAccounts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        creditor: {
          organisation: true,
          organisation_name: 'Acme Corp',
          exact_match_organisation_name: false,
          address_line_1: '',
          postcode: '',
        },
        business_unit_ids: [1],
        active_accounts_only: true,
      }),
    );
    expect(result).toEqual({ count: 1, creditor_accounts: [] });
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

    expect(result).toEqual({ count: 0, creditor_accounts: [] });
    expect(opalFinesService.getCreditorAccounts).not.toHaveBeenCalled();
  });

  it('should return empty result if no search criteria is provided', async () => {
    finesSaStore.setSearchAccount({
      fsa_search_account_number: null,
      fsa_search_account_reference_case_number: null,
      fsa_search_account_individuals_search_criteria: null,
      fsa_search_account_companies_search_criteria: null,
      fsa_search_account_minor_creditors_search_criteria: {} as IFinesSaSearchAccountFormMinorCreditorsState,
      fsa_search_account_major_creditor_search_criteria: null,
      fsa_search_account_business_unit_ids: null,
      fsa_search_account_active_accounts_only: null,
    });
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(result).toEqual({ count: 0, creditor_accounts: [] });
    expect(opalFinesService.getCreditorAccounts).not.toHaveBeenCalled();
  });
});
