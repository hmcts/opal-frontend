import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaSearchAccountComponent } from './fines-sa-search-account.component';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { FINES_SA_ROUTING_PATHS } from '../../routing/constants/fines-sa-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FinesSaStoreType } from '../../stores/types/fines-sa.type';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MOCK } from './mocks/fines-sa-search-account-form.mock';
import { of } from 'rxjs';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from './constants/fines-sa-search-account-state.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';

describe('FinesSaSearchAccountComponent', () => {
  let component: FinesSaSearchAccountComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountComponent>;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
              },
            },
            parent: 'search',
            fragment: of('individuals'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountComponent);
    component = fixture.componentInstance;

    mockFinesSaStore = TestBed.inject(FinesSaStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submit', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const mockForm = FINES_SA_SEARCH_ACCOUNT_FORM_MOCK;

    component.handleSearchAccountSubmit(mockForm);
    expect(mockFinesSaStore.searchAccount()).toEqual(mockForm.formData);
    expect(routerSpy).toHaveBeenCalledWith(
      [`${FINES_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.children.results}`],
      {},
    );
  });

  it('should handle form submit when major creditor', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'navigateToMajorCreditor').and.callThrough();
    const mockForm = {
      ...FINES_SA_SEARCH_ACCOUNT_FORM_MOCK,
      formData: {
        ...FINES_SA_SEARCH_ACCOUNT_FORM_MOCK.formData,
        fsa_search_account_major_creditors_search_criteria: {
          fsa_search_account_major_creditors_major_creditor_id: 1,
        },
      },
    };
    mockFinesSaStore.setActiveTab('majorCreditors');

    component.handleSearchAccountSubmit(mockForm);
    expect(mockFinesSaStore.searchAccount()).toEqual(mockForm.formData);
    expect(routerSpy).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).navigateToMajorCreditor).toHaveBeenCalledWith(
      mockForm.formData.fsa_search_account_major_creditors_search_criteria!
        .fsa_search_account_major_creditors_major_creditor_id!,
    );
  });

  it('should handle unsaved changes flag', () => {
    component.handleUnsavedChanges(true);
    expect(mockFinesSaStore.unsavedChanges()).toEqual(true);
    expect(component.stateUnsavedChanges).toBeTrue();
  });

  it('ngOnInit should populate businessUnitRefData (filtering by opal_domain) and set default ids in store when missing', () => {
    // Ensure store starts clean
    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fsa_search_account_business_unit_ids: undefined as any,
    });

    component.ngOnInit();

    expect(component.businessUnitRefData.map((b) => b.business_unit_id).length).toEqual(7);

    // Store should be initialised with those ids when missing
    expect(mockFinesSaStore.searchAccount().fsa_search_account_business_unit_ids?.length).toEqual(7);
  });

  it('ngOnInit should NOT overwrite store ids if already present', () => {
    // Pre-populate store with different ids
    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_business_unit_ids: [999],
    });

    component.ngOnInit();

    // Store stays as-is
    expect(mockFinesSaStore.searchAccount().fsa_search_account_business_unit_ids).toEqual([999]);

    // But component ref data is still populated/filtered from resolver (7 entries in mock)
    expect(component.businessUnitRefData.map((b) => b.business_unit_id)).toEqual([61, 67, 68, 69, 70, 71, 73]);
  });

  it('ngOnInit should handle non-array resolver refData by setting empty refData and defaulting ids to []', () => {
    // Ensure store starts clean and missing ids
    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fsa_search_account_business_unit_ids: undefined as any,
    });

    // Override the activated route snapshot to simulate non-array refData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['activatedRoute'] = {
      snapshot: { data: { businessUnits: { refData: null } } },
      parent: 'search',
      fragment: of('individuals'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const setSpy = spyOn(mockFinesSaStore, 'setSearchAccount').and.callThrough();

    component.ngOnInit();

    expect(component.businessUnitRefData).toEqual([]);
    expect(mockFinesSaStore.searchAccount().fsa_search_account_business_unit_ids).toEqual([]);
    expect(setSpy).toHaveBeenCalledTimes(1);
  });

  it('ngOnInit should filter out business units with falsy opal_domain', () => {
    // Ensure store starts clean and missing ids
    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fsa_search_account_business_unit_ids: undefined as any,
    });

    const refData = [
      { business_unit_id: 1, opal_domain: 'Fines' },
      { business_unit_id: 2, opal_domain: '' },
      { business_unit_id: 3, opal_domain: undefined },
      { business_unit_id: 4, opal_domain: 'Confiscation' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any[];

    // Override the activated route snapshot with custom refData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['activatedRoute'] = {
      snapshot: { data: { businessUnits: { refData }, majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } },
      parent: 'search',
      fragment: of('individuals'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const setSpy = spyOn(mockFinesSaStore, 'setSearchAccount').and.callThrough();

    component.ngOnInit();

    // Only ids 1 and 4 remain (truthy opal_domain)
    expect(component.businessUnitRefData.map((b) => b.business_unit_id)).toEqual([1, 4]);
    expect(mockFinesSaStore.searchAccount().fsa_search_account_business_unit_ids).toEqual([1, 4]);
    expect(setSpy).toHaveBeenCalledTimes(1);
  });

  it('ngOnInit should not call setSearchAccount when ids already exist in store', () => {
    // Pre-populate store with existing ids
    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_business_unit_ids: [123],
    });

    const setSpy = spyOn(mockFinesSaStore, 'setSearchAccount').and.callThrough();

    component.ngOnInit();

    expect(setSpy).not.toHaveBeenCalled();
    expect(mockFinesSaStore.searchAccount().fsa_search_account_business_unit_ids).toEqual([123]);
  });

  it('getAccountEnquiryUrl should return the correct URL for account enquiry', () => {
    const accountId = 123;
    const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${accountId}/${FINES_ACC_ROUTING_PATHS.children.details}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (component as any).getAccountEnquiryUrl(accountId);
    expect(result).toEqual(expectedUrl);
  });

  it('navigateToMajorCreditor should open a new tab with the correct URL', () => {
    const accountId = 456;
    const routerSpy = spyOn(component['router'], 'serializeUrl').and.returnValue('mockUrl');
    const windowOpenSpy = spyOn(window, 'open');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).navigateToMajorCreditor(accountId);

    expect(routerSpy).toHaveBeenCalled();
    expect(windowOpenSpy).toHaveBeenCalledWith('mockUrl', '_blank');
  });
});
