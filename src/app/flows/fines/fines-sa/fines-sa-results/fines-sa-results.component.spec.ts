import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaResultsComponent } from './fines-sa-results.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesSaService } from '../services/fines-sa.service';
import { FinesSaStore } from '../stores/fines-sa.store';
import { FinesSaStoreType } from '../stores/types/fines-sa.type';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_EMPTY } from './fines-sa-results-defendant-table-wrapper/constants/fines-sa-result-default-table-wrapper-table-data-empty.constant';

describe('FinesSaResultsComponent', () => {
  let component: FinesSaResultsComponent;
  let fixture: ComponentFixture<FinesSaResultsComponent>;
  let finesSaService: jasmine.SpyObj<FinesSaService>;
  let finesSaStore: FinesSaStoreType;
  let router: jasmine.SpyObj<Router>;
  const expectedResult = [{ ...FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_EMPTY, Account: 'IND001' }];

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
          useValue: jasmine.createSpyObj('FinesSaService', ['getSearchResultView', 'mapDefendantAccounts']),
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
    finesSaService.mapDefendantAccounts.and.returnValue(expectedResult);
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
    finesSaService.getSearchResultView.and.returnValue(resultView);

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
    expect(finesSaService.mapDefendantAccounts).not.toHaveBeenCalled();
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

  it('should navigate back to search page with correct fragment', () => {
    spyOn(finesSaStore, 'activeTab').and.returnValue('individuals');

    component.navigateBackToSearch();

    expect(router.navigate).toHaveBeenCalledWith([component['finesSaSearchRoutingPaths'].root], {
      relativeTo: component['activatedRoute'].parent,
      fragment: 'individuals',
    });
  });
});
