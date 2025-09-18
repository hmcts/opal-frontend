import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaResultsComponent } from './fines-sa-results.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesSaStore } from '../stores/fines-sa.store';
import { FinesSaStoreType } from '../stores/types/fines-sa.type';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';

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

    component['activatedRoute'].snapshot.data = {
      individualAccounts: mockIndividualData,
      companyAccounts: mockCompanyData,
    };

    component['loadDefendantDataFromRouteSnapshot']();

    expect(component.individualsData.length).toEqual(1);
    expect(component.companiesData.length).toEqual(1);
  });

  it('should open account details in a new tab', () => {
    const mockUrl = '/fines/account/ACC123/details';
    router.serializeUrl.and.returnValue(mockUrl);

    spyOn(window, 'open');
    component.onAccountIdClick(1);

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
          defendant_account_id: 1,
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
          defendant_account_id: 1,
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
});
