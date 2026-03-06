import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinesConSelectBuComponent } from './fines-con-select-bu.component';
import { FinesConStore } from '../../stores/fines-con.store';
import { FinesConStoreType } from '../../stores/types/fines-con-store.type';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK } from './mocks/fines-con-select-bu-form-individual.mock';
import { FINES_CON_SELECT_BU_FORM_COMPANY_MOCK } from './mocks/fines-con-select-bu-form-company.mock';

describe('FinesConSelectBuComponent', () => {
  let component: FinesConSelectBuComponent;
  let fixture: ComponentFixture<FinesConSelectBuComponent>;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: { snapshot: { data: { businessUnits: IOpalFinesBusinessUnitRefData } }; parent: null };
  let finesConStore: InstanceType<FinesConStoreType>;

  const mockBusinessUnitsRefData = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };
    mockActivatedRoute = {
      snapshot: { data: { businessUnits: mockBusinessUnitsRefData } },
      parent: null,
    };

    await TestBed.configureTestingModule({
      imports: [FinesConSelectBuComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSelectBuComponent);
    component = fixture.componentInstance;
    finesConStore = TestBed.inject(FinesConStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize business unit autocomplete items on ngOnInit', () => {
    component.ngOnInit();

    expect(component.businessUnitAutoCompleteItems().length).toBeGreaterThan(0);
    expect(component.businessUnitAutoCompleteItems()[0].value).toBeDefined();
    expect(component.businessUnitAutoCompleteItems()[0].name).toBeDefined();
  });

  it('should automatically select business unit when only one is available', () => {
    const singleBusinessUnitMock: IOpalFinesBusinessUnitRefData = {
      refData: [mockBusinessUnitsRefData.refData[0]],
      count: 1,
    };
    const updateSpy = vi.spyOn(finesConStore, 'updateSelectBuForm');

    component.businessUnitsRefData = singleBusinessUnitMock;
    component['setBusinessUnit'](singleBusinessUnitMock);

    expect(updateSpy).toHaveBeenCalled();
  });

  it('should handle form submission with individual defendant type', () => {
    const updateSpy = vi.spyOn(finesConStore, 'updateSelectBuForm');
    component.handleFormSubmit(FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK);

    expect(updateSpy).toHaveBeenCalledWith(FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK.formData);
  });

  it('should create autocomplete items from business unit data', () => {
    component.ngOnInit();

    expect(component.businessUnitAutoCompleteItems().length).toBeGreaterThan(0);
    const firstItem = component.businessUnitAutoCompleteItems()[0];
    expect(firstItem.value).toBeDefined();
    expect(firstItem.name).toBeDefined();
    expect(typeof firstItem.value).toBe('number');
    expect(typeof firstItem.name).toBe('string');
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

  it('should have finesConStore injected', () => {
    expect(component['finesConStore']).toBeDefined();
  });

  it('should restore previously selected business unit from store on init', () => {
    vi.spyOn(finesConStore, 'selectBuForm').mockReturnValue(FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK);

    component.ngOnInit();

    expect(component.businessUnitAutoCompleteItems().length).toBeGreaterThan(0);
  });

  it('should not select business unit when store has no business unit id on init', () => {
    vi.spyOn(finesConStore, 'selectBuForm').mockReturnValue({
      ...FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK,
      formData: {
        ...FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK.formData,
        fcon_select_bu_business_unit_id: null,
      },
    });

    component.ngOnInit();

    expect(component.businessUnitAutoCompleteItems()).toBeDefined();
  });

  it('should handle form submission with different defendant types', () => {
    const updateSpy = vi.spyOn(finesConStore, 'updateSelectBuForm');
    component.handleFormSubmit(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK);

    expect(updateSpy).toHaveBeenCalledWith(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData);
  });
});
