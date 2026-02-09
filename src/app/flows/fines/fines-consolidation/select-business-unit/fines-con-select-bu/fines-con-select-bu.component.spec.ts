import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { FinesConSelectBuComponent } from './fines-con-select-bu.component';
import { FinesConStore } from '../../stores/fines-con.store';
import { FINES_CON_BUSINESS_UNITS_SINGLE_MOCK } from './mocks/fines-con-business-units-single.mock';
import { FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK } from './mocks/fines-con-select-bu-form-individual.mock';
import { FINES_CON_SELECT_BU_FORM_COMPANY_MOCK } from './mocks/fines-con-select-bu-form-company.mock';

interface MockFinesConStore {
  updateSelectBuForm: jasmine.Spy;
  getBusinessUnitId: jasmine.Spy;
}

describe('FinesConSelectBuComponent', () => {
  let component: FinesConSelectBuComponent;
  let fixture: ComponentFixture<FinesConSelectBuComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockFinesConStore: jasmine.SpyObj<MockFinesConStore>;

  const mockBusinessUnitsRefData = FINES_CON_BUSINESS_UNITS_SINGLE_MOCK;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { data: { businessUnits: mockBusinessUnitsRefData } },
      parent: null,
    });
    mockFinesConStore = jasmine.createSpyObj('FinesConStore', ['updateSelectBuForm', 'getBusinessUnitId']);
    mockFinesConStore.getBusinessUnitId.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [FinesConSelectBuComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: FinesConStore, useValue: mockFinesConStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSelectBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize business unit autocomplete items on ngOnInit', () => {
    component.ngOnInit();

    expect(component.businessUnitAutoCompleteItems()).toEqual([{ value: 1, name: 'Test Business Unit' }]);
  });

  it('should automatically select business unit when only one is available', () => {
    component.ngOnInit();

    expect(component.selectedBusinessUnit()?.business_unit_id).toBe(1);
  });

  it('should handle form submission with individual defendant type', () => {
    component.handleFormSubmit(FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK);

    expect(mockFinesConStore.updateSelectBuForm).toHaveBeenCalledWith(
      FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK.formData,
    );
  });

  it('should create autocomplete items from business unit data', () => {
    component.ngOnInit();

    // Verify that autocomplete items are created correctly from the business unit data
    expect(component.businessUnitAutoCompleteItems().length).toBeGreaterThan(0);
    expect(component.businessUnitAutoCompleteItems()[0]).toEqual({
      value: 1,
      name: 'Test Business Unit',
    });
  });

  it('should handle unsaved changes when set to true', () => {
    component.handleUnsavedChanges(true);

    expect(component['stateUnsavedChanges']).toBe(true);
  });

  it('should handle unsaved changes when set to false', () => {
    component.handleUnsavedChanges(false);

    expect(component['stateUnsavedChanges']).toBe(false);
  });

  it('should toggle unsaved changes correctly', () => {
    component.handleUnsavedChanges(false);
    expect(component['stateUnsavedChanges']).toBe(false);

    component.handleUnsavedChanges(true);
    expect(component['stateUnsavedChanges']).toBe(true);

    component.handleUnsavedChanges(false);
    expect(component['stateUnsavedChanges']).toBe(false);
  });

  it('should have defendant types defined', () => {
    expect(component.defendantTypes).toBeDefined();
    expect(component.defendantTypes.length).toBeGreaterThan(0);
  });

  it('should have business units ref data after init', () => {
    component.ngOnInit();

    expect(component.businessUnitsRefData).toBeDefined();
    expect(component.businessUnitsRefData.refData.length).toBeGreaterThan(0);
  });

  it('should initialize with empty auto complete items signal', () => {
    expect(component.businessUnitAutoCompleteItems()).toBeDefined();
  });

  it('should initialize with null selected business unit signal before init', () => {
    // Before ngOnInit, the selectedBusinessUnit signal should be null
    // Create a fresh component without calling ngOnInit
    const freshFixture = TestBed.createComponent(FinesConSelectBuComponent);
    const freshComponent = freshFixture.componentInstance;

    expect(freshComponent.selectedBusinessUnit()).toBeNull();
  });

  it('should have finesConStore injected', () => {
    expect(component['finesConStore']).toBeDefined();
  });

  it('should prePopulateFromStore when business unit id exists in store', () => {
    mockFinesConStore.getBusinessUnitId.and.returnValue(1);
    component.businessUnitsRefData = mockBusinessUnitsRefData;

    component['prePopulateFromStore']();

    expect(component.selectedBusinessUnit()?.business_unit_id).toBe(1);
  });

  it('should not update selected business unit when store has no business unit id', () => {
    mockFinesConStore.getBusinessUnitId.and.returnValue(null);
    component.businessUnitsRefData = mockBusinessUnitsRefData;

    const initialSelection = component.selectedBusinessUnit();
    component['prePopulateFromStore']();

    expect(component.selectedBusinessUnit()).toEqual(initialSelection);
  });

  it('should handle form submission with different defendant types', () => {
    component.handleFormSubmit(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK);

    expect(mockFinesConStore.updateSelectBuForm).toHaveBeenCalledWith(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData);
  });
});
