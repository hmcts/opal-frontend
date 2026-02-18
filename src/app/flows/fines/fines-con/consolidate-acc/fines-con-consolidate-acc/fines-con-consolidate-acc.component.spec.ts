import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinesConConsolidateAccComponent } from './fines-con-consolidate-acc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FinesConStore } from '../../stores/fines-con.store';
import { FinesConStoreType } from '../../stores/types/fines-con-store.type';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';

describe('FinesConConsolidateAccComponent', () => {
  let component: FinesConConsolidateAccComponent;
  let fixture: ComponentFixture<FinesConConsolidateAccComponent>;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: {
    parent: Record<string, unknown>;
    snapshot: { data: Record<string, unknown> };
  };
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };
    const parentActivatedRoute = {};
    mockActivatedRoute = {
      parent: parentActivatedRoute,
      snapshot: {
        data: {
          businessUnits: {
            refData: [
              {
                business_unit_id: 1,
                business_unit_name: 'Business Unit 1',
                business_unit_type: 'Accounting Division',
              } as IOpalFinesBusinessUnit,
              {
                business_unit_id: 2,
                business_unit_name: 'Business Unit 2',
                business_unit_type: 'Accounting Division',
              } as IOpalFinesBusinessUnit,
            ],
          },
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [FinesConConsolidateAccComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConConsolidateAccComponent);
    component = fixture.componentInstance;
    finesConStore = TestBed.inject(FinesConStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have search tab as initial active tab', () => {
    expect(finesConStore.activeTab()).toBe('search');
  });

  it('should switch to results tab when clicked', () => {
    component.handleTabSwitch('results');
    expect(finesConStore.activeTab()).toBe('results');
  });

  it('should switch to for-consolidation tab when clicked', () => {
    component.handleTabSwitch('for-consolidation');
    expect(finesConStore.activeTab()).toBe('for-consolidation');
  });

  it('should get defendant type from store', () => {
    const defendantType = component['getDefendantType']();
    expect(defendantType).toBe('individual');
  });

  it('should navigate back to select business unit', () => {
    component['navigateBack']();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['select-business-unit'], {
      relativeTo: mockActivatedRoute.parent,
    });
  });

  it('should return true for canDeactivate when there are no unsaved changes', () => {
    const result = component.canDeactivate();

    expect(result).toBe(true);
  });

  it('should return false for canDeactivate when there are unsaved changes', () => {
    vi.spyOn(finesConStore, 'unsavedChanges').mockReturnValue(true);
    const result = component.canDeactivate();

    expect(result).toBe(false);
  });

  it('should reset consolidation state and navigate to dashboard on cancelConsolidation', () => {
    const resetSpy = vi.spyOn(finesConStore, 'resetConsolidationState');
    component.cancelConsolidation();

    expect(resetSpy).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['dashboard']);
  });

  it('should call getBusinessUnits on ngOnInit', () => {
    // @ts-expect-error - Testing private method
    const getBusinessUnitsSpy = vi.spyOn(component, 'getBusinessUnits');
    component.ngOnInit();

    expect(getBusinessUnitsSpy).toHaveBeenCalled();
  });

  describe('getBusinessUnits', () => {
    it('should populate businessUnitRefData from resolver data', () => {
      component['getBusinessUnits']();

      expect(component['businessUnitRefData']).toBeDefined();
      expect(component['businessUnitRefData'].length).toBe(2);
      expect(component['businessUnitRefData'][0].business_unit_name).toBe('Business Unit 1');
      expect(component['businessUnitRefData'][1].business_unit_name).toBe('Business Unit 2');
    });

    it('should initialize businessUnitRefData as empty array when resolver data is missing', () => {
      mockActivatedRoute.snapshot.data = {};
      component['getBusinessUnits']();

      expect(component['businessUnitRefData']).toEqual([]);
    });

    it('should initialize businessUnitRefData as empty array when refData is not an array', () => {
      mockActivatedRoute.snapshot.data = { businessUnits: { refData: null } };
      component['getBusinessUnits']();

      expect(component['businessUnitRefData']).toEqual([]);
    });

    it('should initialize businessUnitRefData as empty array when businessUnits is undefined', () => {
      mockActivatedRoute.snapshot.data = { businessUnits: undefined };
      component['getBusinessUnits']();

      expect(component['businessUnitRefData']).toEqual([]);
    });
  });

  describe('businessUnitText', () => {
    beforeEach(() => {
      component['getBusinessUnits']();
    });

    it('should return business unit name when business unit id is found', () => {
      vi.spyOn(finesConStore, 'getBusinessUnitId').mockReturnValue(1);

      const result = component.businessUnitText;

      expect(result).toBe('Business Unit 1');
    });

    it('should return null when business unit id is not selected', () => {
      vi.spyOn(finesConStore, 'getBusinessUnitId').mockReturnValue(null);

      const result = component.businessUnitText;

      expect(result).toBeNull();
    });

    it('should return null when business unit is not found in ref data', () => {
      vi.spyOn(finesConStore, 'getBusinessUnitId').mockReturnValue(999);

      const result = component.businessUnitText;

      expect(result).toBeNull();
    });
  });
});
