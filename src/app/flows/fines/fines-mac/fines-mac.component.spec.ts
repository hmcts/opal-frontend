import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacComponent } from './fines-mac.component';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from './mocks/fines-mac-state.mock';

describe('FinesMacComponent', () => {
  let component: FinesMacComponent;
  let fixture: ComponentFixture<FinesMacComponent>;
  let mockFinesService: FinesService;
  let mockGlobalStateService: GlobalStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacComponent);
    component = fixture.componentInstance;

    mockFinesService = TestBed.inject(FinesService);
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
    mockGlobalStateService = TestBed.inject(GlobalStateService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on destroy and clear state', () => {
    const destroy = spyOn(component, 'ngOnDestroy');

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(destroy).toHaveBeenCalled();
    expect(mockFinesService.finesMacState).toEqual(FINES_MAC_STATE_MOCK);
    expect(mockGlobalStateService.error()).toEqual({ error: false, message: '' });
  });

  it('should call handleBeforeUnload ', () => {
    mockFinesService.finesMacState.stateChanges = true;
    mockFinesService.finesMacState.unsavedChanges = false;
    expect(component.handleBeforeUnload()).toBeFalsy();

    mockFinesService.finesMacState.stateChanges = false;
    mockFinesService.finesMacState.unsavedChanges = true;
    expect(component.handleBeforeUnload()).toBeFalsy();

    mockFinesService.finesMacState.stateChanges = false;
    mockFinesService.finesMacState.unsavedChanges = false;
    expect(component.handleBeforeUnload()).toBeTruthy();
  });

  it('should call canDeactivate ', () => {
    // Empty state, should return true
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
    expect(component.canDeactivate()).toBeTruthy();

    mockFinesService.finesMacState.stateChanges = true;
    expect(component.canDeactivate()).toBeFalsy();

    mockFinesService.finesMacState.stateChanges = false;
    expect(component.canDeactivate()).toBeTruthy();
  });
});
