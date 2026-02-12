import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FinesConConsolidateAccComponent } from './fines-con-consolidate-acc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FinesConStore } from '../../stores/fines-con.store';
import { FinesConStoreType } from '../../stores/types/fines-con-store.type';

describe('FinesConConsolidateAccComponent', () => {
  let component: FinesConConsolidateAccComponent;
  let fixture: ComponentFixture<FinesConConsolidateAccComponent>;
  let router: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const parentActivatedRoute = {};
    mockActivatedRoute = {
      parent: parentActivatedRoute,
    } as jasmine.SpyObj<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [FinesConConsolidateAccComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConConsolidateAccComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
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

    expect(router.navigate).toHaveBeenCalledWith(['select-business-unit'], {
      relativeTo: mockActivatedRoute.parent,
    });
  });

  it('should return true for canDeactivate when there are no unsaved changes', () => {
    const result = component.canDeactivate();

    expect(result).toBe(true);
  });

  it('should return false for canDeactivate when there are unsaved changes', () => {
    spyOn(finesConStore, 'unsavedChanges').and.returnValue(true);
    const result = component.canDeactivate();

    expect(result).toBe(false);
  });

  it('should reset consolidation state and navigate to dashboard on cancelConsolidation', () => {
    spyOn(finesConStore, 'resetConsolidationState');
    component.cancelConsolidation();

    expect(finesConStore.resetConsolidationState).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
  });
});
