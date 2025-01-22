import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacComponent } from './fines-mac.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from './mocks/fines-mac-state.mock';
import { GlobalStore } from 'src/app/stores/global/global.store';

describe('FinesMacComponent', () => {
  let component: FinesMacComponent;
  let fixture: ComponentFixture<FinesMacComponent>;
  let mockFinesService: FinesService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let globalStore: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacComponent);
    component = fixture.componentInstance;

    mockFinesService = TestBed.inject(FinesService);
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };

    globalStore = TestBed.inject(GlobalStore);

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
    expect(globalStore.error()).toEqual({ error: false, message: '' });
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
