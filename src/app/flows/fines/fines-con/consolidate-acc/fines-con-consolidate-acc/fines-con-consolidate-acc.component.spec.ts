import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinesConConsolidateAccComponent } from './fines-con-consolidate-acc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FinesConStore } from '../../stores/fines-con.store';
import { FinesConStoreType } from '../../stores/types/fines-con-store.type';

describe('FinesConConsolidateAccComponent', () => {
  let component: FinesConConsolidateAccComponent;
  let fixture: ComponentFixture<FinesConConsolidateAccComponent>;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: { parent: Record<string, unknown> };
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };
    const parentActivatedRoute = {};
    mockActivatedRoute = {
      parent: parentActivatedRoute,
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
    // Don't call detectChanges to avoid initializing child components
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have search tab as initial active tab', () => {
    expect(component['activeTab']).toBe('search');
  });

  it('should switch to results tab when clicked', () => {
    component.handleTabSwitch('results');
    expect(component['activeTab']).toBe('results');
  });

  it('should switch to for-consolidation tab when clicked', () => {
    component.handleTabSwitch('for-consolidation');
    expect(component['activeTab']).toBe('for-consolidation');
  });

  it('should get defendant type from store', () => {
    const defendantType = component['getDefendantType']();
    expect(defendantType).toBe('individual');
  });

  it('should navigate back to select business unit', () => {
    component.navigateBack();

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
});
