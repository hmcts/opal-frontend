import { FinesSaService } from './fines-sa.service';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';
import { AbstractControl } from '@angular/forms';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/mocks/fines-sa-search-account-form-individuals-state.mock';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-companies/mocks/fines-sa-search-account-form-companies-state.mock';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/mocks/fines-sa-search-account-form-minor-creditors-state.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { TestBed } from '@angular/core/testing';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';

describe('FinesSaService', () => {
  let service: FinesSaService;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['hasSetProperty']);
    mockUtilsService.hasSetProperty.and.returnValue(true);

    TestBed.configureTestingModule({
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    });

    service = TestBed.inject(FinesSaService);
  });

  const getBaseState = (): IFinesSaSearchAccountState => FINES_SA_SEARCH_ACCOUNT_STATE;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createControl = (value: any) => ({ value }) as AbstractControl;

  it('should return false when all search criteria are null', () => {
    mockUtilsService.hasSetProperty.and.returnValue(false);
    const state = getBaseState();
    expect(service.hasAnySearchCriteriaPopulated(state)).toBeFalse();
  });

  it('should return false when all search criteria are empty objects', () => {
    mockUtilsService.hasSetProperty.and.returnValue(false);
    const state = {
      ...getBaseState(),
      fsa_search_account_individual_search_criteria: {},
      fsa_search_account_companies_search_criteria: {},
      fsa_search_account_minor_creditors_search_criteria: {},
      fsa_search_account_major_creditor_search_criteria: {},
    } as IFinesSaSearchAccountState;
    expect(service.hasAnySearchCriteriaPopulated(state)).toBeFalse();
  });

  it('should return true when individual search criteria has data', () => {
    const state = {
      ...getBaseState(),
      fsa_search_account_individual_search_criteria: { fsa_search_account_individuals_last_name: 'Smith' },
    } as IFinesSaSearchAccountState;
    expect(service.hasAnySearchCriteriaPopulated(state)).toBeTrue();
  });

  it('should return true when any boolean field is true', () => {
    const state = {
      ...getBaseState(),
      fsa_search_account_individual_search_criteria: {
        fsa_search_account_individuals_first_names_exact_match: true,
      },
    } as IFinesSaSearchAccountState;

    expect(service.hasAnySearchCriteriaPopulated(state)).toBeTrue();
  });

  it('should return true if at least one control has a non-empty trimmed string', () => {
    const controls = [createControl(''), createControl('   '), createControl('test')];
    expect(service.isAnyTextFieldPopulated(controls)).toBeTrue();
  });

  it('should return false if all controls are empty or whitespace strings', () => {
    const controls = [createControl(''), createControl('  '), createControl('   ')];
    expect(service.isAnyTextFieldPopulated(controls)).toBeFalse();
  });

  it('should return true if at least one control has a truthy non-string value', () => {
    const controls = [createControl(null), createControl(false), createControl(123)];
    expect(service.isAnyTextFieldPopulated(controls)).toBeTrue();
  });

  it('should return false if all controls are null or falsy', () => {
    const controls = [createControl(null), createControl(undefined), createControl(false), createControl(0)];
    expect(service.isAnyTextFieldPopulated(controls)).toBeFalse();
  });

  it('should return "accountNumber" if fsa_search_account_number is present', () => {
    const state = {
      ...getBaseState(),
      fsa_search_account_number: 'ACC123456',
    };
    expect(service.getSearchResultView(state)).toBe('accountNumber');
  });

  it('should return "referenceCaseNumber" if reference is present and account number is not', () => {
    const state = {
      ...getBaseState(),
      fsa_search_account_reference_case_number: 'REF123456',
    };
    expect(service.getSearchResultView(state)).toBe('referenceCaseNumber');
  });

  it('should return "individuals" if individual criteria is populated', () => {
    mockUtilsService.hasSetProperty.and.callFake(
      (input) => input === FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
    );

    const state = {
      ...getBaseState(),
      fsa_search_account_individual_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
    };

    expect(service.getSearchResultView(state)).toBe('individuals');
  });

  it('should return "companies" if company criteria is populated and others are not', () => {
    mockUtilsService.hasSetProperty.and.callFake(
      (input) => input === FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE_MOCK,
    );

    const state = {
      ...getBaseState(),
      fsa_search_account_companies_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE_MOCK,
    };

    expect(service.getSearchResultView(state)).toBe('companies');
  });

  it('should return "minorCreditors" if minor creditor criteria is populated and others are not', () => {
    mockUtilsService.hasSetProperty.and.callFake(
      (input) => input === FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE_MOCK,
    );

    const state = {
      ...getBaseState(),
      fsa_search_account_minor_creditors_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE_MOCK,
    };

    expect(service.getSearchResultView(state)).toBe('minorCreditors');
  });

  it('should default to "accountNumber" if no criteria is populated', () => {
    mockUtilsService.hasSetProperty.and.returnValue(false);
    const state = getBaseState();
    expect(service.getSearchResultView(state)).toBe('accountNumber');
  });

  it('should return mapped individual defendant data with aliases', () => {
    const mockData: IOpalFinesDefendantAccountResponse = {
      count: 1,
      defendant_accounts: [
        {
          organisation_flag: false,
          defendant_account_id: '1',
          business_unit_id: 'BU001',
          account_number: 'ACC123',
          defendant_title: null,
          defendant_first_names: 'John',
          defendant_surname: 'Smith',
          aliases: [{ alias_number: 1, alias_surname: 'Jones', alias_forenames: 'J', organisation_name: null }],
          birth_date: '1990-01-01',
          national_insurance_number: 'QQ123456C',
          parent_guardian_first_names: 'Anna',
          parent_guardian_surname: 'Smith',
          organisation_name: null,
          address_line_1: '1 Main St',
          postcode: 'AB1 2CD',
          business_unit_name: 'Unit A',
          prosecutor_case_reference: 'REF123',
          last_enforcement_action: 'Fine',
          account_balance: 500,
        },
      ],
    };

    const result = service.mapDefendantAccounts(mockData, 'individual');
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(
      jasmine.objectContaining({
        Account: 'ACC123',
        Name: 'Smith, John',
        Aliases: 'Jones, J',
        'Date of birth': '1990-01-01',
        'NI number': 'QQ123456C',
        'Parent or guardian': 'Smith, Anna',
        'Address line 1': '1 Main St',
        Postcode: 'AB1 2CD',
        'Business unit': 'Unit A',
        Ref: 'REF123',
        Enf: 'Fine',
        Balance: 500,
      }),
    );
  });

  it('should return mapped company defendant data without aliases', () => {
    const mockData: IOpalFinesDefendantAccountResponse = {
      count: 1,
      defendant_accounts: [
        {
          organisation_flag: false,
          defendant_account_id: '1',
          business_unit_id: 'BU001',
          account_number: 'ACC999',
          organisation_name: 'Acme Corp',
          aliases: null,
          defendant_title: null,
          defendant_first_names: null,
          defendant_surname: null,
          birth_date: null,
          national_insurance_number: null,
          parent_guardian_first_names: null,
          parent_guardian_surname: null,
          address_line_1: '99 Corp Way',
          postcode: 'XY9 8ZT',
          business_unit_name: 'Unit C',
          prosecutor_case_reference: 'REF999',
          last_enforcement_action: 'Summons',
          account_balance: 250,
        },
      ],
    };

    const result = service.mapDefendantAccounts(mockData, 'company');
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(
      jasmine.objectContaining({
        Account: 'ACC999',
        Name: 'Acme Corp',
        Aliases: null,
        'Address line 1': '99 Corp Way',
        Postcode: 'XY9 8ZT',
        'Business unit': 'Unit C',
        Ref: 'REF999',
        Enf: 'Summons',
        Balance: 250,
      }),
    );
  });

  it('should return an empty array if no defendant accounts are provided', () => {
    const mockData: IOpalFinesDefendantAccountResponse = {
      count: 0,
      defendant_accounts: [],
    };
    const result = service.mapDefendantAccounts(mockData, 'individual');
    expect(result).toEqual([]);
  });

  it('should aliases correctly for company accounts', () => {
    const mockData: IOpalFinesDefendantAccountResponse = {
      count: 1,
      defendant_accounts: [
        {
          organisation_flag: false,
          defendant_account_id: '1',
          business_unit_id: 'BU001',
          account_number: 'ACC999',
          organisation_name: 'Acme Corp',
          aliases: [
            { alias_number: 1, alias_forenames: null, alias_surname: null, organisation_name: 'Acme Subsidiary' },
          ],
          defendant_title: null,
          defendant_first_names: null,
          defendant_surname: null,
          birth_date: null,
          national_insurance_number: null,
          parent_guardian_first_names: null,
          parent_guardian_surname: null,
          address_line_1: '99 Corp Way',
          postcode: 'XY9 8ZT',
          business_unit_name: 'Unit C',
          prosecutor_case_reference: 'REF999',
          last_enforcement_action: 'Summons',
          account_balance: 250,
        },
      ],
    };
    const result = service.mapDefendantAccounts(mockData, 'company');
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(
      jasmine.objectContaining({
        Account: 'ACC999',
        Name: 'Acme Corp',
        Aliases: 'Acme Subsidiary',
        'Address line 1': '99 Corp Way',
        Postcode: 'XY9 8ZT',
        'Business unit': 'Unit C',
        Ref: 'REF999',
        Enf: 'Summons',
        Balance: 250,
      }),
    );
  });
});
