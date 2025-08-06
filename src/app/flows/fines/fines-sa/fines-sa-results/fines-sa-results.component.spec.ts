import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaResultsComponent } from './fines-sa-results.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesSaService } from '../services/fines-sa.service';
import { FinesSaStore } from '../stores/fines-sa.store';
import { FinesSaStoreType } from '../stores/types/fines-sa.type';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';

describe('FinesSaResultsComponent', () => {
  let component: FinesSaResultsComponent;
  let fixture: ComponentFixture<FinesSaResultsComponent>;
  let finesSaService: jasmine.SpyObj<FinesSaService>;
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
          provide: FinesSaService,
          useValue: jasmine.createSpyObj('FinesSaService', ['getSearchResultView']),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsComponent);
    component = fixture.componentInstance;
    finesSaService = TestBed.inject(FinesSaService) as jasmine.SpyObj<FinesSaService>;
    finesSaStore = TestBed.inject(FinesSaStore);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise resultView and individualsData on init', () => {
    const resultView = 'accountNumber';
    const searchAccount = {};
    finesSaStore.setSearchAccount(searchAccount as IFinesSaSearchAccountState);
    finesSaService.getSearchResultView.and.returnValue(resultView);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getIndividualsData');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getCompaniesData');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupFragmentListener');

    component.ngOnInit();

    expect(component.resultView).toBe(resultView);
    expect(component['getIndividualsData']).toHaveBeenCalled();
    expect(component['getCompaniesData']).toHaveBeenCalled();
    expect(component['setupFragmentListener']).toHaveBeenCalled();
  });

  it('should set individualsData when data is available', () => {
    const mockData = {
      count: 1,
      defendant_accounts: [
        {
          account_number: 'ACC123',
          defendant_surname: 'Smith',
          defendant_first_names: 'John',
          aliases: [{ alias_surname: 'Jones', alias_forenames: 'J' }],
          birth_date: '1980-01-01',
          address_line_1: '1 High St',
          postcode: 'AB1 2CD',
          national_insurance_number: 'AB123456C',
          parent_guardian_surname: 'Doe',
          parent_guardian_first_names: 'Jane',
          business_unit_name: 'Test BU',
          prosecutor_case_reference: 'REF123',
          last_enforcement_action: 'Warrant',
          account_balance: 123.45,
        },
      ],
    };
    component['activatedRoute'].snapshot.data = { individualAccounts: mockData };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).getIndividualsData();

    expect(component.individualsData.length).toBe(1);
    expect(component.individualsData[0]).toEqual(
      jasmine.objectContaining({
        Account: 'ACC123',
        Name: 'Smith, John',
        Aliases: 'Jones, J',
        'Address line 1': '1 High St',
        Postcode: 'AB1 2CD',
        'Business unit': 'Test BU',
        Ref: 'REF123',
        Enf: 'Warrant',
        Balance: 123.45,
      }),
    );
  });

  it('should set companiesData when data is available', () => {
    const mockData = {
      count: 1,
      defendant_accounts: [
        {
          account_number: 'ACC123',
          organisation_name: 'Acme Corp',
          aliases: [{ organisation_name: 'Acme Ltd' }],
          address_line_1: '1 High St',
          postcode: 'AB1 2CD',
          business_unit_name: 'Test BU',
          prosecutor_case_reference: 'REF123',
          last_enforcement_action: 'Warrant',
          account_balance: 123.45,
        },
      ],
    };
    component['activatedRoute'].snapshot.data = { companyAccounts: mockData };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).getCompaniesData();

    expect(component.companiesData.length).toBe(1);
    expect(component.companiesData[0]).toEqual(
      jasmine.objectContaining({
        Account: 'ACC123',
        Name: 'Acme Corp',
        Aliases: 'Acme Ltd',
        'Address line 1': '1 High St',
        Postcode: 'AB1 2CD',
        'Business unit': 'Test BU',
        Ref: 'REF123',
        Enf: 'Warrant',
        Balance: 123.45,
      }),
    );
  });

  it('should set individualsData and companiesData to empty when no data is available', () => {
    component['activatedRoute'].snapshot.data = { individualAccounts: null, companyAccounts: null };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).getIndividualsData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).getCompaniesData();
    expect(component.companiesData).toEqual([]);
    expect(component.individualsData).toEqual([]);
  });

  it('should open account details in a new tab', () => {
    const mockUrl = '/fines/account/ACC123/details';
    router.serializeUrl.and.returnValue(mockUrl);

    spyOn(window, 'open');
    component.onAccountNumberClick('ACC123');

    expect(router.serializeUrl).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(mockUrl, '_blank');
  });

  it('should set Individuals Aliases to null when no aliases are present', () => {
    const mockData = {
      count: 1,
      defendant_accounts: [
        {
          account_number: 'ACC999',
          defendant_surname: 'Bloggs',
          defendant_first_names: 'Joe',
          aliases: null,
          birth_date: '1970-01-01',
          address_line_1: '2 Low St',
          postcode: 'XY9 9ZZ',
          national_insurance_number: 'CD987654Z',
          parent_guardian_surname: 'Smith',
          parent_guardian_first_names: 'Mary',
          business_unit_name: 'BU 1',
          prosecutor_case_reference: 'PCR000',
          last_enforcement_action: 'Fine',
          account_balance: 0,
        },
      ],
    };
    component['activatedRoute'].snapshot.data = { individualAccounts: mockData };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).getIndividualsData();

    expect(component.individualsData[0].Aliases).toBeNull();
  });

  it('should set Companies Aliases to null when no aliases are present', () => {
    const mockData = {
      count: 1,
      defendant_accounts: [
        {
          account_number: 'ACC123',
          organisation_name: 'Acme Corp',
          aliases: null,
          address_line_1: '1 High St',
          postcode: 'AB1 2CD',
          business_unit_name: 'Test BU',
          prosecutor_case_reference: 'REF123',
          last_enforcement_action: 'Warrant',
          account_balance: 123.45,
        },
      ],
    };
    component['activatedRoute'].snapshot.data = { companyAccounts: mockData };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).getCompaniesData();

    expect(component.companiesData[0].Aliases).toBeNull();
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
});
