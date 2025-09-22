import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaResultsComponent } from './fines-sa-results.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesSaStore } from '../stores/fines-sa.store';
import { FinesSaStoreType } from '../stores/types/fines-sa.type';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IOpalFinesCreditorAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-creditor-accounts.interface';
import { FinesSaSearchAccountTab } from '../fines-sa-search/fines-sa-search-account/types/fines-sa-search-account-tab.type';

describe('FinesSaResultsComponent', () => {
  let component: FinesSaResultsComponent;
  let fixture: ComponentFixture<FinesSaResultsComponent>;
  let finesSaStore: FinesSaStoreType;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {} },
            parent: 'results',
            fragment: of(null),
          },
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsComponent);
    component = fixture.componentInstance;
    finesSaStore = TestBed.inject(FinesSaStore);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise resultView, load snapshot data, and set up fragment listener on init', () => {
    const resultView = 'accountNumber';
    const searchAccount = {};
    finesSaStore.setSearchAccount(searchAccount as IFinesSaSearchAccountState);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupFragmentListener');

    component['activatedRoute'].snapshot.data = {
      individualAccounts: {
        count: 0,
        defendant_accounts: [],
      },
      companyAccounts: {
        count: 0,
        defendant_accounts: [],
      },
      minorCreditorAccounts: {
        count: 0,
        creditor_accounts: [],
      },
    };

    component.ngOnInit();

    expect(component.resultView).toBe(resultView);
    expect(component['setupFragmentListener']).toHaveBeenCalled();
  });

  it('should populate individualsData and companiesData from snapshot if present', () => {
    const mockIndividualData = {
      count: 1,
      defendant_accounts: [{ account_number: 'IND001' }],
    };
    const mockCompanyData = {
      count: 1,
      defendant_accounts: [{ account_number: 'IND001' }],
    };
    const mockMinorCreditorData = {
      count: 1,
      creditor_accounts: [{ account_number: 'MIN001' }],
    };

    component['activatedRoute'].snapshot.data = {
      individualAccounts: mockIndividualData,
      companyAccounts: mockCompanyData,
      minorCreditorAccounts: mockMinorCreditorData,
    };

    component['loadDefendantDataFromRouteSnapshot']();

    expect(component.individualsData.length).toEqual(1);
    expect(component.companiesData.length).toEqual(1);
    expect(component.minorCreditorsData.length).toEqual(1);
  });

  it('should open account details in a new tab', () => {
    const mockUrl = '/fines/account/ACC123/details';
    router.serializeUrl.and.returnValue(mockUrl);

    spyOn(window, 'open');
    component.onAccountNumberClick('ACC123');

    expect(router.serializeUrl).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(mockUrl, '_blank');
  });

  it('should default fragment to "companies" when individuals are empty and companies are not', () => {
    component.resultView = 'referenceCaseNumber';
    component.individualsData = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.companiesData = [{} as any];

    const activatedRoute = component['activatedRoute'];
    activatedRoute.fragment = of(null);

    const navigateSpy = router.navigate;
    const setTabSpy = spyOn(finesSaStore, 'setResultsActiveTab');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).setupFragmentListener();

    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: activatedRoute,
      fragment: 'companies',
      replaceUrl: true,
    });
    expect(setTabSpy).toHaveBeenCalledWith('companies');
  });

  describe('computeDefaultFragment', () => {
    it('returns empty string when all buckets are zero', () => {
      component.individualsData = [];
      component.companiesData = [];
      component.minorCreditorsData = [];
      const result = component['computeDefaultFragment']();
      expect(result).toBe('');
    });

    it('returns empty string when any bucket is >= 100', () => {
      component.individualsData.length = 100;
      component.companiesData.length = 0;
      component.minorCreditorsData.length = 0;
      const result = component['computeDefaultFragment']();
      expect(result).toBe('');
    });

    it('prefers individuals when 1–99', () => {
      component.individualsData.length = 1;
      component.companiesData.length = 50;
      component.minorCreditorsData.length = 50;
      const result = component['computeDefaultFragment']();
      expect(result).toBe('individuals');
    });

    it('returns blank when all buckets are oversize (>= 100)', () => {
      component.individualsData.length = 100;
      component.companiesData.length = 100;
      component.minorCreditorsData.length = 100;
      const result = component['computeDefaultFragment']();
      expect(result).toBe('');
    });

    it('falls back to companies when individuals are 0 and companies are 1–99', () => {
      component.individualsData.length = 0;
      component.companiesData.length = 1;
      component.minorCreditorsData.length = 0;
      const result = component['computeDefaultFragment']();
      expect(result).toBe('companies');
    });

    it('falls back to minorCreditors when individuals and companies are 0 and minorCreditors are 1–99', () => {
      component.individualsData.length = 0;
      component.companiesData.length = 0;
      component.minorCreditorsData.length = 1;
      const result = component['computeDefaultFragment']();
      expect(result).toBe('minorCreditors');
    });

    it('hits the fallback branch for unexpected lengths (guards against impossible states)', () => {
      // Simulate an impossible runtime state by replacing arrays with objects
      // that expose a non-standard length. This avoids triggering anyOversize/allZero
      // and bypasses the 1–99 checks, forcing the fallback.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.individualsData = { length: -1 } as unknown as any;
      component.companiesData.length = 0;
      component.minorCreditorsData.length = 0;

      const result = component['computeDefaultFragment']();
      expect(result).toBe('');
    });

    it('falls back when lengths are NaN', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.individualsData = { length: Number.NaN } as unknown as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.companiesData = { length: Number.NaN } as unknown as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.minorCreditorsData = { length: Number.NaN } as unknown as any;

      const result = component['computeDefaultFragment']();
      expect(result).toBe('');
    });
  });

  it('should not navigate when a fragment is already present and should set the active tab to that fragment', () => {
    component.resultView = 'referenceCaseNumber';
    component.individualsData = [];
    component.companiesData = [];
    component.minorCreditorsData = [];

    const activatedRoute = component['activatedRoute'];
    activatedRoute.fragment = of('individuals');

    const navigateSpy = router.navigate;
    const setTabSpy = spyOn(finesSaStore, 'setResultsActiveTab');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).setupFragmentListener();

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(setTabSpy).toHaveBeenCalledWith('individuals');
  });

  it('should set active tab to empty string and not navigate when any bucket is oversize (>= 100)', () => {
    component.resultView = 'accountNumber';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.individualsData = new Array(100).fill({}) as any;
    component.companiesData = [];
    component.minorCreditorsData = [];

    const activatedRoute = component['activatedRoute'];
    activatedRoute.fragment = of(null);

    const navigateSpy = router.navigate;
    const setTabSpy = spyOn(finesSaStore, 'setResultsActiveTab');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).setupFragmentListener();

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(setTabSpy).toHaveBeenCalledWith('' as FinesSaSearchAccountTab);
  });

  it('should navigate back to search page with correct fragment', () => {
    spyOn(finesSaStore, 'activeTab').and.returnValue('individuals');

    component.navigateBackToSearch();

    expect(router.navigate).toHaveBeenCalledWith([component['finesSaSearchRoutingPaths'].root], {
      relativeTo: component['activatedRoute'].parent,
      fragment: 'individuals',
    });
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
          defendant_firstnames: 'John',
          defendant_surname: 'Smith',
          aliases: [{ alias_number: 1, surname: 'Jones', forenames: 'J', organisation_name: null }],
          birth_date: '1990-01-01',
          national_insurance_number: 'QQ123456C',
          parent_guardian_firstnames: 'Anna',
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

    const result = component['mapDefendantAccounts'](mockData, 'individual');
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

  it('should return an empty array if no defendant accounts are provided', () => {
    const mockData: IOpalFinesDefendantAccountResponse = {
      count: 0,
      defendant_accounts: [],
    };
    const result = component['mapDefendantAccounts'](mockData, 'individual');
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
          aliases: [{ alias_number: 1, forenames: null, surname: null, organisation_name: 'Acme Subsidiary' }],
          defendant_title: null,
          defendant_firstnames: null,
          defendant_surname: null,
          birth_date: null,
          national_insurance_number: null,
          parent_guardian_firstnames: null,
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
    const result = component['mapDefendantAccounts'](mockData, 'company');
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

  it('should return mapped minor creditor individual data', () => {
    const mockData: IOpalFinesCreditorAccountResponse = {
      count: 1,
      creditor_accounts: [
        {
          organisation: false,
          creditor_account_id: '1',
          business_unit_id: 'BU001',
          account_number: 'ACC123',
          defendant_account_id: '1',
          defendant: {
            firstnames: 'John',
            surname: 'Smith',
            organisation_name: null,
          },
          organisation_name: null,
          firstnames: 'John',
          surname: 'Smith',
          address_line_1: '1 Main St',
          postcode: 'AB1 2CD',
          business_unit_name: 'Unit A',
          account_balance: 500,
        },
      ],
    };

    const result = component['mapCreditorAccounts'](mockData);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(
      jasmine.objectContaining({
        Account: 'ACC123',
        Name: 'Smith, John',
        'Address line 1': '1 Main St',
        Postcode: 'AB1 2CD',
        'Business unit': 'Unit A',
        Defendant: 'Smith, John',
        Balance: 500,
      }),
    );
  });

  it('should return mapped minor creditor company data', () => {
    const mockData: IOpalFinesCreditorAccountResponse = {
      count: 1,
      creditor_accounts: [
        {
          organisation: true,
          creditor_account_id: '1',
          business_unit_id: 'BU001',
          account_number: 'ACC123',
          defendant_account_id: '1',
          defendant: {
            firstnames: null,
            surname: null,
            organisation_name: 'Test Corp',
          },
          organisation_name: 'Test Corp',
          firstnames: null,
          surname: null,
          address_line_1: '1 Main St',
          postcode: 'AB1 2CD',
          business_unit_name: 'Unit A',
          account_balance: 500,
        },
      ],
    };

    const result = component['mapCreditorAccounts'](mockData);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(
      jasmine.objectContaining({
        Account: 'ACC123',
        Name: 'Test Corp',
        'Address line 1': '1 Main St',
        Postcode: 'AB1 2CD',
        'Business unit': 'Unit A',
        Defendant: 'Test Corp',
        Balance: 500,
      }),
    );
  });

  it('should return an empty array if no creditor accounts are provided', () => {
    const mockData: IOpalFinesCreditorAccountResponse = {
      count: 0,
      creditor_accounts: [],
    };
    const result = component['mapCreditorAccounts'](mockData);
    expect(result).toEqual([]);
  });

  it('maps minor creditor Defendant using only surname (no comma, no nulls)', () => {
    const mockData: IOpalFinesCreditorAccountResponse = {
      count: 1,
      creditor_accounts: [
        {
          organisation: false,
          creditor_account_id: 'C1',
          business_unit_id: 'BU1',
          account_number: 'ACC-SUR',
          defendant_account_id: 'D1',
          defendant: { firstnames: null, surname: 'Solo', organisation_name: null },
          organisation_name: null,
          firstnames: null,
          surname: 'Solo',
          address_line_1: '1 Lane',
          postcode: 'AA1 1AA',
          business_unit_name: 'Unit X',
          account_balance: 1,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [row] = (component as any)['mapCreditorAccounts'](mockData);
    expect(row.Defendant).toBe('Solo');
  });

  it('maps minor creditor Defendant using only firstnames (no comma, no nulls)', () => {
    const mockData: IOpalFinesCreditorAccountResponse = {
      count: 1,
      creditor_accounts: [
        {
          organisation: false,
          creditor_account_id: 'C2',
          business_unit_id: 'BU1',
          account_number: 'ACC-FN',
          defendant_account_id: 'D2',
          defendant: { firstnames: 'Mono', surname: null, organisation_name: null },
          organisation_name: null,
          firstnames: 'Mono',
          surname: null,
          address_line_1: '2 Lane',
          postcode: 'BB2 2BB',
          business_unit_name: 'Unit Y',
          account_balance: 2,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [row] = (component as any)['mapCreditorAccounts'](mockData);
    expect(row.Defendant).toBe('Mono');
  });

  it('maps minor creditor Defendant to null when both surname and firstnames missing', () => {
    const mockData: IOpalFinesCreditorAccountResponse = {
      count: 1,
      creditor_accounts: [
        {
          organisation: false,
          creditor_account_id: 'C3',
          business_unit_id: 'BU1',
          account_number: 'ACC-NULL',
          defendant_account_id: 'D3',
          defendant: { firstnames: null, surname: null, organisation_name: null },
          organisation_name: null,
          firstnames: null,
          surname: null,
          address_line_1: '3 Lane',
          postcode: 'CC3 3CC',
          business_unit_name: 'Unit Z',
          account_balance: 3,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [row] = (component as any)['mapCreditorAccounts'](mockData);
    expect(row.Defendant).toBeNull();
  });

  it('maps Parent or guardian with only surname present', () => {
    const mockData: IOpalFinesDefendantAccountResponse = {
      count: 1,
      defendant_accounts: [
        {
          organisation_flag: false,
          defendant_account_id: '1',
          business_unit_id: 'BU001',
          account_number: 'ACC-PGS',
          defendant_title: null,
          defendant_firstnames: 'John',
          defendant_surname: 'Smith',
          aliases: [],
          birth_date: null,
          national_insurance_number: null,
          parent_guardian_firstnames: null,
          parent_guardian_surname: 'Guardian',
          organisation_name: null,
          address_line_1: '1 Main St',
          postcode: 'AB1 2CD',
          business_unit_name: 'Unit A',
          prosecutor_case_reference: null,
          last_enforcement_action: null,
          account_balance: 0,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [row] = (component as any)['mapDefendantAccounts'](mockData, 'individual');
    expect(row['Parent or guardian']).toBe('Guardian');
  });

  it('maps Parent or guardian with only firstnames present', () => {
    const mockData: IOpalFinesDefendantAccountResponse = {
      count: 1,
      defendant_accounts: [
        {
          organisation_flag: false,
          defendant_account_id: '2',
          business_unit_id: 'BU001',
          account_number: 'ACC-PGF',
          defendant_title: null,
          defendant_firstnames: 'John',
          defendant_surname: 'Smith',
          aliases: [],
          birth_date: null,
          national_insurance_number: null,
          parent_guardian_firstnames: 'Grace',
          parent_guardian_surname: null,
          organisation_name: null,
          address_line_1: '1 Main St',
          postcode: 'AB1 2CD',
          business_unit_name: 'Unit A',
          prosecutor_case_reference: null,
          last_enforcement_action: null,
          account_balance: 0,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [row] = (component as any)['mapDefendantAccounts'](mockData, 'individual');
    expect(row['Parent or guardian']).toBe('Grace');
  });

  it('maps Parent or guardian to null when neither part is present', () => {
    const mockData: IOpalFinesDefendantAccountResponse = {
      count: 1,
      defendant_accounts: [
        {
          organisation_flag: false,
          defendant_account_id: '3',
          business_unit_id: 'BU001',
          account_number: 'ACC-PGN',
          defendant_title: null,
          defendant_firstnames: 'John',
          defendant_surname: 'Smith',
          aliases: [],
          birth_date: null,
          national_insurance_number: null,
          parent_guardian_firstnames: null,
          parent_guardian_surname: null,
          organisation_name: null,
          address_line_1: '1 Main St',
          postcode: 'AB1 2CD',
          business_unit_name: 'Unit A',
          prosecutor_case_reference: null,
          last_enforcement_action: null,
          account_balance: 0,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [row] = (component as any)['mapDefendantAccounts'](mockData, 'individual');
    expect(row['Parent or guardian']).toBeNull();
  });
});
