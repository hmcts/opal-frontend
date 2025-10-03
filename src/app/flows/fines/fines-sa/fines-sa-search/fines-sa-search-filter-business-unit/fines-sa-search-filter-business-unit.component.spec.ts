import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinesSaSearchFilterBusinessUnitComponent } from './fines-sa-search-filter-business-unit.component';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FinesSaStoreType } from '../../stores/types/fines-sa.type';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

describe('FinesSaSearchFilterBusinessUnitComponent', () => {
  let component: FinesSaSearchFilterBusinessUnitComponent;
  let fixture: ComponentFixture<FinesSaSearchFilterBusinessUnitComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FinesSaSearchFilterBusinessUnitComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } },
            parent: 'search-account',
            fragment: of('individuals'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchFilterBusinessUnitComponent);
    component = fixture.componentInstance;
    mockFinesSaStore = TestBed.inject(FinesSaStore);
    mockFinesSaStore.setActiveTab('individuals');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit populates businessUnits from resolver and filters items without opal_domain', () => {
    expect(component.businessUnits.map((b) => b.business_unit_id)).toEqual([61, 67, 68, 69, 70, 71, 73]);
  });

  it('ngOnInit sets businessUnits to [] when resolver refData is not an array', () => {
    // Override the activatedRoute snapshot to simulate missing/invalid refData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['activatedRoute'] = {
      snapshot: { data: { businessUnits: { refData: null } } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component.ngOnInit();

    expect(component.businessUnits).toEqual([]);
  });

  it('handleUnsavedChanges updates store and local state', () => {
    spyOn(mockFinesSaStore, 'setUnsavedChanges');
    component.handleUnsavedChanges(true);
    expect(mockFinesSaStore.setUnsavedChanges).toHaveBeenCalledWith(true);
    expect(component.stateUnsavedChanges).toBeTrue();

    component.handleUnsavedChanges(false);
    expect(mockFinesSaStore.setUnsavedChanges).toHaveBeenCalledWith(false);
    expect(component.stateUnsavedChanges).toBeFalse();
  });

  it('getBusinessUnitsFromSelectedIds returns matching units by selected ids', () => {
    // Access the private method for unit test purposes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = (component as any).getBusinessUnitsFromSelectedIds.bind(component) as (
      m: Record<number, boolean>,
    ) => IOpalFinesBusinessUnit[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selected = fn({ 61: true, 68: false } as any);
    expect(selected.map((u) => u.business_unit_id)).toEqual([61]);
  });

  it('handleFilterBusinessUnitSubmit maps selected ids -> unit ids, updates store and navigates with active tab fragment', () => {
    const form = {
      formData: {
        // selection object: select 61 and 68
        fsa_search_account_business_unit_ids: { 61: true, 68: true },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component.handleFilterBusinessUnitSubmit(form);

    expect(mockFinesSaStore.searchAccount().fsa_search_account_business_unit_ids).toEqual([61, 68]);
    expect(routerSpy.navigate).toHaveBeenCalled();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [, navOpts] = routerSpy.navigate.calls.mostRecent().args as [unknown, any];
    expect(navOpts.fragment).toBe('individuals');
    expect(navOpts.relativeTo).toBe('search-account');
  });
});
