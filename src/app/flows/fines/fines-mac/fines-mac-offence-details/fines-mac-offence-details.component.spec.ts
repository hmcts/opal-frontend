import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsComponent } from './fines-mac-offence-details.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FinesMacOffenceDetailsService } from './services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from './constants/fines-mac-offence-details-draft-state.constant';

describe('FinesMacOffenceDetailsComponent', () => {
  let component: FinesMacOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsComponent>;
  let mockFinesService: FinesService;
  let mockFinesMacOffenceDetailsService: FinesMacOffenceDetailsService;
  let mockGlobalStateService: GlobalStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsComponent);
    component = fixture.componentInstance;

    mockFinesService = TestBed.inject(FinesService);
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
    mockFinesMacOffenceDetailsService = TestBed.inject(FinesMacOffenceDetailsService);
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
    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState).toEqual(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE,
    );
    expect(mockGlobalStateService.error()).toEqual({ error: false, message: '' });
  });

  it('should call canDeactivate ', () => {
    // Empty state, should return true
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
    expect(component.canDeactivate()).toBeTruthy();

    mockFinesService.finesMacState = {
      ...mockFinesService.finesMacState,
      unsavedChanges: true,
    };
    expect(component.canDeactivate()).toBeFalsy();

    mockFinesService.finesMacState = {
      ...mockFinesService.finesMacState,
      unsavedChanges: false,
    };
    expect(component.canDeactivate()).toBeTruthy();
  });
});
